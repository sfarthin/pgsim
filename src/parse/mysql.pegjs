Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@sfarthin 
SimpleContacts
/
mysql-simulator
2
1
1
Code
Issues
1
Pull requests
11
Actions
Projects
Wiki
Security
Insights
mysql-simulator/src/parser/mysql.pegjs
@nvie
nvie Keep this hack out of the language parser
…
Latest commit b30ef99 on May 29
 History
 2 contributors
@nvie@rquigley
1110 lines (977 sloc)  34.6 KB
  
{

/**
 * Helper functions to more succinctly produce nodes
 */
const invariant = require('invariant');

function identifier(name) {
  return {
    type: 'identifier',
    name,
    id: name,   // Deprecate in favor of `name`
  }
}

function literal(value) {
  return { type: 'literal', value }
}

function unary(op, expr) {
  return { type: 'unary', op, expr }
}

function binary(op, expr1, expr2) {
  return { type: 'binary', op, expr1, expr2 }
}

function callExpression(name, args) {
  invariant(name.type === 'builtinFunction', `requires builtinFunction node as first arg, got ${name}`)
  return { type: 'callExpression', name, args }
}

function builtinFunction(name) {
  return { type: 'builtinFunction', name }
}

function generated(expr, mode) {
  return { type: 'generated', expr, mode }
}

//
// HACK: Using this for now, because the Simulator internals aren't aware of
// Nodes, so we'll have to convert this to strings before we pass it on.
// However, it would be nice if they _would_ work with AST nodes instead, so
// eventually™ we should remove this serialize*() helper family here.
//

function serialize(node) {
  switch (node.type) {
    case 'callExpression':
      return serializeCallExpression(node)
    case 'literal':
      return node.value
    case 'identifier':
      return node.name
    case 'builtinFunction':
      return node.name
    default:
      throw new Error(`Don't know how to serialize ${node} nodes yet.  Please tell me.`);
  }
}

//
// HACK:
// This is a huge hack because the defaultValue that the simulator expects vary
// in types, and it's superinconsistent.
//
// - String literals are sent as quoted strings "'foobar'"
// - Function calls are sent as strings, e.g. "CURRENT_TIMESTAMP"
// - Booleans are sent as booleans literals, e.g. "FALSE"
// - Numbers are sent as true numbers, e.g. 0
// - `null` is sent as the string "NULL"
//
// 🙈
//
function serializeDefaultValue_HACK(node) {
  switch (node.type) {
    case 'literal':
      return node.value === null
        ? 'NULL'
        : node.value === true
        ? 'TRUE'
        : node.value === false
        ? 'FALSE'
        : node.value
    default:
      // Defer to "normal" serializer
      return serialize(node);
  }
}

function serializeCallExpression(node) {
  invariant(node.type === 'callExpression', `not a call expression node: ${node}`);
  let f = serialize(node.name)
  if (node.args !== undefined) {
    f += `(${node.args.map(serialize).join(', ')})`;
  }
  return f;
}

}

start = StatementList

StatementList
  = first:Statement SEMICOLON* rest:StatementList { return [first, ...rest] }
  / only:Statement SEMICOLON? { return [only] }

Statement
  = CreateTable
  / CreateIndex
  / CreateTrigger
  / CreateFunction
  / RenameTable
  / AlterTable
  / DropTable
  / DropIndex
  / SelectStatement
  / InsertStatement
  / DeleteStatement
  / UpdateStatement
  / SetStatement
  / LockStatement
  / UnlockStatement
  / CompoundStatement
  / IfStatement

CompoundStatement
  = BEGIN statements:StatementList END {
    return {
      type: 'BEGIN ... END',
      statements,
    }
  }

Comment
  = SingleLineComment
  / MultiLineComment

SingleLineComment
  = ( '//' / '--' ) p:([^\n]*) { return { type: 'comment', raw: p.join('').trim() } }

MultiLineComment
  = "/*" inner:(!"*/" i:. { return i } )* "*/" { return { type: 'comment', raw: inner.join('') } }

// We ignore select/insert/delete statements for now
SelectStatement = SELECT [^;]* { return null; }
UpdateStatement = UPDATE [^;]* { return null; }
InsertStatement = INSERT [^;]* { return null; }
DeleteStatement = DELETE [^;]* { return null; }
SetStatement = SET [^;]* { return null; }
LockStatement = LOCK [^;]* { return null; }
UnlockStatement = UNLOCK [^;]* { return null; }

Condition
  = BooleanLiteral
  / NOT Condition
  / LPAREN Condition RPAREN
  / left:Expression ( EQ / NE / LTE / GTE / LT / GT ) right:Expression

ExpressionList
  = first:Expression COMMA rest:ExpressionList { return [first, ...rest] }
  / only:Expression { return [only] }

Expression
  = expr1:BooleanPrimary op:BooleanOp expr2:BooleanPrimary { return binary(op, expr1, expr2) }
  / BooleanPrimary

BooleanOp
  = AND
  / OR
  / XOR

BooleanPrimary
  = pred:Predicate IS check:( NULL / NOT_NULL ) {
      if (check === 'NULL') {
        return unary('is null', pred)
      } else {
        return unary('is not null', pred)
      }
    }
  / pred1:Predicate op:CmpOp pred2:Predicate { return binary(op, pred1, pred2) }
  / Predicate

CmpOp
  = EQ
  / NE1
  / NE2
  / GTE
  / GT
  / LTE
  / LT
  / LIKE
  / REGEXP
  / RLIKE  // RLIKE is a synonym for REGEXP
    { return 'REGEXP' }

Predicate
  = BitExpr1

BitExpr1
  // Mostly expressed like this to fight left-recursion in the grammer
  = expr1:BitExpr2 rest:( op:BitExprOp1 expr2:BitExpr2 { return { op, expr2 } } )* {
      return rest.reduce(
        (acc, cur) => binary(cur.op, acc, cur.expr2),
        expr1
      )
    }

BitExpr2
  // Mostly expressed like this to fight left-recursion in the grammer
  = expr1:SimpleExpr rest:( op:BitExprOp2 expr2:SimpleExpr { return { op, expr2 } } )* {
      return rest.reduce(
        (acc, cur) => binary(cur.op, acc, cur.expr2),
        expr1
      )
    }

// Binary operators with weak binding
BitExprOp1
  = PLUS
  / MINUS

// Binary operators with strong binding
BitExprOp2
  = MULT
  / DIVIDE
  / DIV
  / PERCENTAGE
  / MOD { return '%' }

/* ArithmeticOperator */
/*   = PLUS */
/*   / MINUS */
  // |
  // &
  // <<
  // >>
  // +
  // -
  // *
  // /
  // DIV
  // MOD
  // %
  // ^
  // +
  // -

/* BitExpr */
/*   = BitExpr ArithmeticOperator BitExpr */
/*   / SimpleExpr */

SimpleExpr
  = Literal
  / FunctionCall
  / MemberAccess  // Not sure where this one fits
  / name:Identifier { return identifier(name) }
  // / simple_expr COLLATE collation_name
  // / param_marker
  // / variable
  // / simple_expr || simple_expr
  / PLUS expr:SimpleExpr { return unary('+', expr) }
  / MINUS expr:SimpleExpr { return unary('-', expr) }
  // / ~ simple_expr
  / BANG expr:SimpleExpr { return unary('!', expr) }
  // / BINARY simple_expr
  / LPAREN exprs:ExpressionList RPAREN { return exprs }
  // / ROW (expr, expr [, expr] ...)
  // / (subquery)
  // / EXISTS (subquery)
  // / {identifier expr}
  // / match_expr
  // / case_expr
  // / interval_expr

FunctionCall
  = name:FunctionName LPAREN exprs:ExpressionList RPAREN {
      return callExpression(builtinFunction(name), exprs)
    }

  / ident:Identifier LPAREN exprs:ExpressionList RPAREN {
      return callExpression(builtinFunction(ident), exprs)
    }

  // JSON_EXTRACT shorthand syntax (e.g. foo->'$.bar', or foo->>'$.bar')
  / ident:Identifier arrow:( ARROWW / ARROW ) lit:StringLiteral {
      let rv = callExpression(builtinFunction('JSON_EXTRACT'), [identifier(ident), lit])
      if (arrow === '->>') {
        rv = callExpression(builtinFunction('JSON_UNQUOTE'), [rv])
      }
      return rv
    }

// Not sure where we can find this syntax in the MySQL manual, or what this is named
MemberAccess
  = object:Identifier '.' property:Identifier { return null }

FunctionName
  = CHAR_LENGTH
  / CONCAT
  / CONV
  / HEX
  / SUBSTRING
  / UNHEX


// ====================================================
// Constant literals
// ====================================================

NullLiteral
  = NULL { return literal(null) }

BooleanLiteral
  = TRUE  { return literal(true) }
  / FALSE { return literal(false) }

NumberLiteral
  = HexNumberLiteral
  / DecimalNumberLiteral

DecimalNumberLiteral
  = digits:[0-9]+ { return literal(parseInt(digits.join(''), 10)) }

HexNumberLiteral
  = '0x' digits:[0-9a-fA-F]+ { return literal(parseInt(digits.join(''), 16)) }

StringLiteral
  = SingleQuotedStringLiteral
  / DoubleQuotedStringLiteral

SingleQuotedStringLiteral
  = "'" seq:( "''" / "\\'" { return "''" } / [^'] )* "'" {
    return literal(`'${seq.join('')}'`)
  }

DoubleQuotedStringLiteral
  = '"' seq:( '""' { return '"' } / '\\"' { return '"' } / "'" { return "''" } / [^"] )* '"' {
    return literal(`'${seq.join('')}'`)
  }

StringLiteralList
  = first:StringLiteral COMMA rest:StringLiteralList { return [first, ...rest] }
  / only:StringLiteral { return [only] }

Literal
  = NullLiteral
  / BooleanLiteral
  / NumberLiteral
  / StringLiteral


// ====================================================
// Rename table
// ====================================================

RenameTable
  = RENAME TABLE tblName:Identifier TO newName:Identifier
    {
      return {
        type: 'RENAME TABLE',
        tblName,
        newName,
      }
    }


// ====================================================
// Drop Index
// ====================================================
DropIndex = DROP INDEX indexName:Identifier ON tblName:Identifier {
  return {
    type: 'DROP INDEX',
    indexName,
    tblName
  }
}

// ====================================================
// Drop Table
// ====================================================

DropTable
  = DROP TABLE ifExists:(IF EXISTS)? tblName:Identifier {
    return {
      type: 'DROP TABLE',
      tblName,
      ifExists: !!ifExists,
    }
  }

// ====================================================
// Create Index
// ====================================================

CreateIndex
  = CREATE indexKind:( UNIQUE / FULLTEXT )? INDEX indexName:Identifier ON tblName:Identifier LPAREN indexColNames:IndexColNames RPAREN {
    indexKind = indexKind || 'NORMAL'
    return {
      type: 'CREATE INDEX',
      indexName,
      indexKind,
      tblName,
      indexColNames,
    }
  }

// ====================================================
// Create Trigger
// ====================================================

CreateTrigger
  = CREATE TRIGGER triggerName:Identifier
    ( BEFORE / AFTER )
    ( INSERT / UPDATE / DELETE )
    ON tblName:Identifier FOR EACH ROW ( ( FOLLOWS / PRECEDES ) otherTrigger:Identifier )?
    triggerBody:Statement {
    return {
      type: 'CREATE TRIGGER',
      triggerName,
      tblName,
    }
  }

// ====================================================
// Create Function
// ====================================================

FunctionParamList
  = first:FunctionParam COMMA rest:FunctionParamList { return [first, ...rest] }
  / only:FunctionParam { return [only] }

FunctionParam
  = paramName:Identifier type:DataType { return { paramName, type } }

CreateFunction
  = CREATE FUNCTION spName:Identifier
    params:( LPAREN params:FunctionParamList RPAREN { return params })
    RETURNS DataType
    characteristic:CreateFunctionCharacteristic
    body:FunctionBody {
    return {
      type: 'CREATE FUNCTION',
      spName,
      params,
      characteristic,
      // body,
    }
  }

CreateFunctionCharacteristic
  = NOT? DETERMINISTIC

FunctionBody
  = BEGIN statements:FunctionStatementList END

FunctionStatementList
  = first:FunctionStatement SEMICOLON? rest:FunctionStatementList { return [first, ...rest] }
  / only:FunctionStatement SEMICOLON? { return [only] }

FunctionStatement
  = DECLARE [^;]*
  / SET AssignmentList
  / IfStatement
  / WhileStatement
  / RETURN Expression
  / Statement

AssignmentList
  = first:Assignment COMMA rest:AssignmentList { return [first, ...rest] }
  / only:Assignment { return [only] }

Assignment
  = Identifier EQ Expression

IfStatement
  = IF Condition THEN
      FunctionStatementList
    (ELSEIF Condition THEN FunctionStatementList )*
    (ELSE FunctionStatementList)?
    END IF

WhileStatement
  = WHILE Condition DO
      FunctionStatementList
    END WHILE

// ====================================================
// ALTER TABLE
// ====================================================

AlterTable
  = ALTER TABLE tblName:Identifier changes:AlterSpecs {
    return {
      type: 'ALTER TABLE',
      tblName,
      changes
    }
  }

AlterSpecs
  = first:AlterSpec COMMA rest:AlterSpecs { return [first, ...rest].filter(Boolean) }
  / only:AlterSpec { return [only].filter(Boolean) }

/**
 * See https://dev.mysql.com/doc/refman/5.7/en/alter-table.html
 */
AlterSpec
  = options:TableOptions {
      return {
        type: 'CHANGE TABLE OPTIONS',
        options,
      }
    }
  / ADD COLUMN? colName:Identifier columnDefinition:ColumnDefinition
    position:(
      AFTER ident:Identifier { return `AFTER ${ident}` }
      / FIRST { return 'FIRST' }
    )? {
      return {
        type: 'ADD COLUMN',
        colName,
        definition: columnDefinition,
        position,
      }
    }
  / ADD ( INDEX / KEY ) indexName:Identifier? indexType:IndexType? LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'ADD INDEX',
        indexName,
        indexType,
        indexColNames,
      }
    }
  / ADD constraint:NamedConstraint? PRIMARY KEY indexType:IndexType? LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'ADD PRIMARY KEY',
        constraint,
        indexType,
        indexColNames,
      }
    }
  / ADD constraint:NamedConstraint?
    UNIQUE ( INDEX / KEY )? indexName:Identifier? indexType:IndexType?
    LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'ADD UNIQUE INDEX',
        constraint,
        indexName,
        indexType,
        indexColNames,
      }
    }
  / ADD FULLTEXT ( INDEX / KEY )? indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'ADD FULLTEXT INDEX',
        indexName,
        indexColNames,
      }
    }
  / ADD constraint:NamedConstraint?
    FOREIGN KEY indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN
    reference:ReferenceDefinition {
      return {
        type: 'ADD FOREIGN KEY',
        constraint,
        indexName,
        indexColNames,
        reference,
      }
    }
  // / ALGORITHM
  / ALTER COLUMN? colName:Identifier DROP DEFAULT {
      return {
        type: 'DROP DEFAULT',
        colName,
      }
    }
  / CHANGE COLUMN? oldColName:Identifier newColName:Identifier definition:ColumnDefinition
    position:(
      AFTER ident:Identifier { return `AFTER ${ident}` }
      / FIRST { return 'FIRST' }
    )? {
      return {
        type: 'CHANGE COLUMN',
        oldColName,
        newColName,
        definition,
        position,
      }
    }
  / DROP (INDEX / KEY) indexName:Identifier {
      return {
        type: 'DROP INDEX',
        indexName,
      }
    }
  / DROP PRIMARY KEY { return { type: 'DROP PRIMARY KEY' } }
  / DROP FOREIGN KEY symbol:Identifier {
      return {
        type: 'DROP FOREIGN KEY',
        symbol,
      }
    }
  / DROP COLUMN? colName:Identifier {
      return {
        type: 'DROP COLUMN',
        colName,
      }
    }
  / MODIFY COLUMN? colName:Identifier definition:ColumnDefinition
    position:(
      AFTER ident:Identifier { return `AFTER ${ident}` }
      / FIRST { return 'FIRST' }
    )? {
      // MODIFY COLUMN is like CHANGE COLUMN in every way, except that it
      // cannot be used to rename a column.  We'll therefore parse any MODIFY
      // COLUMN statement as a CHANGE COLUMN statement where old + new columns
      // are identical (i.e. no rename).
      return {
        type: 'CHANGE COLUMN',
        oldColName: colName,
        newColName: colName,
        definition,
        position,
      }
    }
  / RENAME ( INDEX / KEY ) oldIndexName:Identifier TO newIndexName:Identifier {
      return {
        type: 'RENAME INDEX',
        oldIndexName,
        newIndexName,
      }
    }
  / RENAME ( TO / AS )? newTblName:Identifier {
      return {
        type: 'RENAME TABLE',
        newTblName,
      }
    }
  / LOCK EQ? ( DEFAULT / NONE / SHARED / EXCLUSIVE ) { return null; }

NamedConstraint = CONSTRAINT symbol:Identifier? { return symbol }

IndexType = USING ( BTREE / HASH )


// ====================================================
// Create TABLE
// ====================================================
CreateTable
  = CreateTable1   // CREATE TABLE
  // CreateTable2  // See https://dev.mysql.com/doc/refman/5.7/en/create-table.html
  / CreateTable3   // CREATE TABLE ... LIKE

CreateTable1
  = CREATE TABLE
    ifNotExists:(IF NOT EXISTS)?
    tblName:Identifier
    LPAREN definitions:CreateDefinitionsList RPAREN
    tableOptions:TableOptions? {
      // Turn the list-of-option-pairs into an object
      const options = Object.assign({}, ...(tableOptions || []));
      return {
        type: 'CREATE TABLE',
        tblName,
        definitions,
        options,
        ifNotExists: !!ifNotExists,
      }
    }

CreateTable3
  = CREATE TABLE
    ifNotExists:(IF NOT EXISTS)?
    tblName:Identifier LIKE oldTblName:Identifier {
    return {
      type: 'CREATE TABLE LIKE', // Copy table
      tblName,
      oldTblName,
      ifNotExists,
    }
  }

CreateDefinitionsList
  = first:CreateDefinition _ ',' _ rest:CreateDefinitionsList { return [first, ...rest] }
  / only:CreateDefinition { return [only] }

CreateDefinition
  = colName:Identifier _ columnDefinition:ColumnDefinition {
      return {
        type: 'COLUMN',
        colName,
        definition: columnDefinition,
      }
    }
  // / [CONSTRAINT [symbol]] PRIMARY KEY [index_type] (index_col_name, ...) [index_option] ...
  / PRIMARY KEY LPAREN indexColNames:IndexColNames RPAREN {
    return {
      type: 'PRIMARY KEY',
      indexColNames,
    }
  }
  // / {INDEX|KEY} [index_name] [index_type] (index_col_name, ...)
  / ( INDEX / KEY ) indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN {
    return {
      type: 'INDEX',
      indexName,
      indexColNames,
    }
  }
  // / [CONSTRAINT [symbol]] UNIQUE [INDEX|KEY] [index_name] [index_type] (index_col_name, ...) [index_option] ...
  / constraint:NamedConstraint?
    UNIQUE (INDEX / KEY)? indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'UNIQUE INDEX',
        constraint,
        indexName,
        indexColNames,
      }
    }
  / FULLTEXT (INDEX / KEY)? indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN {
      return {
        type: 'FULLTEXT INDEX',
        indexName,
        indexColNames,
      }
    }
  / constraint:NamedConstraint?
    FOREIGN KEY indexName:Identifier? LPAREN indexColNames:IndexColNames RPAREN reference:ReferenceDefinition {
      return {
        type: 'FOREIGN KEY',
        constraint,
        indexName,
        indexColNames,
        reference,
      }
    }
  // / CHECK (expr)


  // ALTER .... ... ....  COMMENT '123';

ColumnDefinition
  = dataType:DataType
    nullableClause:( NULL / NOT_NULL )?
    defaultValue:( DEFAULT value:DefaultValueExpr { return value } )?
    isPrimary1:( PRIMARY KEY )?
    autoIncrement:AUTO_INCREMENT?
    isUnique:( UNIQUE KEY? )?
    isPrimary2:( PRIMARY KEY )?
    comment:( COMMENT value:StringLiteral { return value.value } )?
    reference:ReferenceDefinition?
    onUpdate:( ON UPDATE expr:DefaultValueExpr { return expr } )?
    generated:( ( GENERATED ALWAYS )? AS LPAREN expr:Expression RPAREN mode:( STORED / VIRTUAL )? { return generated(expr, mode || 'VIRTUAL') } )?
    nullableClause2:( NULL / NOT_NULL )?
    {
      let nullable = null;
      if (nullableClause === 'NULL' || nullableClause2 === 'NULL') {
        nullable = true;
      } else if (nullableClause === 'NOT NULL' || nullableClause2 === 'NOT NULL') {
        nullable = false;
      };

      // Unpack the defaultValue / onUpdate AST nodes into a string version for
      // now.  We changed the parser's output to produce better ASTs, but the
      // internal simulator data structures aren't aware and capable of
      // handling those yet.
      defaultValue = defaultValue === null ? null : serializeDefaultValue_HACK(defaultValue)
      onUpdate = onUpdate === null ? null : serializeDefaultValue_HACK(onUpdate)

      return {
        dataType,
        nullable,
        defaultValue,
        onUpdate,
        isUnique: !!isUnique,
        isPrimary: !!isPrimary1 || !!isPrimary2,
        autoIncrement: !!autoIncrement,
        comment,
        reference,
        generated,
      }
    }


Len
  = LPAREN number:NumberLiteral RPAREN { return number.value }

PrecisionSpec
  = LPAREN length:NumberLiteral COMMA decimals:NumberLiteral RPAREN { return [length.value, decimals.value] }

BoolTypeName
  = BOOLEAN

IntTypeName
  = BIGINT
  / INTEGER
  / INT
  / MEDIUMINT
  / SMALLINT
  / TINYINT

PrecisionTypeName
  = REAL
  / DOUBLE
  / FLOAT
  / DECIMAL
  / NUMERIC

DateTypeName
  = type:TIMESTAMP precision:Len? { return precision ? `${type}(${precision})`:type }
  / TIME
  / type:DATETIME precision:Len? { return precision ? `${type}(${precision})`:type }
  / DATE

BoolDataType
  = type:BoolTypeName len:Len? { return 'TINYINT(1)' }

IntDataType
  = type:IntTypeName len:Len? unsigned:UNSIGNED? {
    len = len ? `(${len})` : '';
    unsigned = unsigned || '';
    return (type + len + ' ' + unsigned).trim()
  }

PrecisionDataType
  = type:PrecisionTypeName _ prec:PrecisionSpec? _ unsigned:UNSIGNED? {
    prec = prec ? `(${prec.join(',')})` : '';
    unsigned = unsigned || '';
    return (type + prec + ' ' + unsigned).trim()
  }

DateDataType
  = type:DateTypeName { return type }

TextDataType
  = // Length required
    type:( VARCHAR / VARBINARY ) len:Len { return `${type}(${len})` }
  / // Length required
    type:( CHAR / BINARY / TEXT ) len:Len? { return len ? `${type}(${len})` : type }

DataType
  = IntDataType
  / BoolDataType
  / DateDataType
  / PrecisionDataType
  / type:TextDataType ignore1:(CHARACTER SET CharsetName)? ignore2:(COLLATE CollationName)? { return type }
  / JSON
  / ENUM LPAREN literals:StringLiteralList RPAREN {
      return `ENUM(${literals.map(str => str.value).join(',')})`;
    }

IndexColNames
  = first:IndexColName COMMA rest:IndexColNames { return [first, ...rest] }
  / only:IndexColName { return [only] }

IndexColName
  = colName:Identifier len:Len? direction:( ASC / DESC )? { return { colName, len, direction } }

ReferenceDefinition
  = REFERENCES tblName:Identifier LPAREN indexColNames:IndexColNames RPAREN
    matchMode:( MATCH ( FULL / PARTIAL / SIMPLE ) )?
    onDelete:( ON DELETE ReferenceOption )?
    onUpdate:( ON UPDATE ReferenceOption )? {
      return {
        tblName,
        indexColNames,
        matchMode,
        onDelete,
        onUpdate,
      }
    }

ReferenceOption
  = RESTRICT
  / CASCADE
  / SET NULL
  / NO ACTION
  / SET DEFAULT

TableOptions
  = first:TableOption COMMA? rest:TableOptions { return [first, ...rest] }
  / only:TableOption { return [only] }

TableOption
  = AUTO_INCREMENT EQ? AUTO_INCREMENT:Value { return { AUTO_INCREMENT } }
  / ENGINE EQ? ENGINE:EngineName { return { ENGINE } }
  / DEFAULT? ( CHARSET / CHARACTER SET ) EQ? CHARSET:CharsetName { return { CHARSET } }
  / DEFAULT? COLLATE EQ? COLLATE:CollationName { return { COLLATE } }

EngineName
  = _ 'InnoDB'i !IdentifierStart _ { return 'InnoDB' }

CharsetName
  = _ 'utf8'i !IdentifierStart _ { return 'utf8' }
  / _ 'latin1'i !IdentifierStart _ { return 'latin1' }

CollationName
  = _ 'utf8_general_ci'i !IdentifierStart _ { return 'utf8_general_ci' }
  / _ 'utf8_bin'i        !IdentifierStart _ { return 'utf8_bin' }

ValueList
  = first:Value COMMA rest:ValueList { return [first, ...rest] }
  / only:Value { return [only] }

Value
  = lit:Literal { return lit.value }

/* System functions */

DefaultValueExpr
  = Literal
  / CurrentTimestamp
  / NowCall

CurrentTimestamp
  = value:CURRENT_TIMESTAMP precision:( LPAREN n:NumberLiteral? RPAREN { return n } )? {
    return callExpression(builtinFunction(value), precision ? [precision] : undefined)
  }

NowCall
  = NOW LPAREN RPAREN { return callExpression(builtinFunction('NOW'), []) }

// ====================================================
// Util
// ====================================================

_ "whitespace" = Whitespace* { return null }
Whitespace
  = [ \t\r\n]
  / Comment

// TODO: Let this return identifier() nodes
Identifier
  = QuotedIdentifier
  / NonQuotedIdentifier

QuotedIdentifier
  = _ '`' chars:[^`]+ '`' _ { return chars.join('') }

NonQuotedIdentifier
  = _ !Keyword first:IdentifierStart rest:IdentifierChar* _ { return [first, ...rest].join('') }

// ====================================================
// Keywords
// ====================================================

IdentifierStart = [a-zA-Z_]
IdentifierChar = [a-zA-Z0-9_]

Keyword
  = FOREIGN / KEY / PRIMARY / UNIQUE

ACTION            = _ 'ACTION'i            !IdentifierChar _ { return 'ACTION' }
ADD               = _ 'ADD'i               !IdentifierChar _ { return 'ADD' }
AFTER             = _ 'AFTER'i             !IdentifierChar _ { return 'AFTER' }
ALTER             = _ 'ALTER'i             !IdentifierChar _ { return 'ALTER' }
ALWAYS            = _ 'ALWAYS'i            !IdentifierChar _ { return 'ALWAYS' }
AND               = _ 'AND'i               !IdentifierChar _ { return 'AND' }
AS                = _ 'AS'i                !IdentifierChar _ { return 'AS' }
ASC               = _ 'ASC'i               !IdentifierChar _ { return 'ASC' }
AUTO_INCREMENT    = _ 'AUTO_INCREMENT'i    !IdentifierChar _ { return 'AUTO_INCREMENT' }
BEFORE            = _ 'BEFORE'i            !IdentifierChar _ { return 'BEFORE' }
BEGIN             = _ 'BEGIN'i             !IdentifierChar _ { return 'BEGIN' }
BIGINT            = _ 'BIGINT'i            !IdentifierChar _ { return 'BIGINT' }
BINARY            = _ 'BINARY'i            !IdentifierChar _ { return 'BINARY' }
BOOLEAN           = _ 'BOOLEAN'i           !IdentifierChar _ { return 'BOOLEAN' }
BTREE             = _ 'BTREE'i             !IdentifierChar _ { return 'BTREE' }
CASCADE           = _ 'CASCADE'i           !IdentifierChar _ { return 'CASCADE' }
CHANGE            = _ 'CHANGE'i            !IdentifierChar _ { return 'CHANGE' }
CHAR              = _ 'CHAR'i              !IdentifierChar _ { return 'CHAR' }
CHARACTER         = _ 'CHARACTER'i         !IdentifierChar _ { return 'CHARACTER' }
CHARSET           = _ 'CHARSET'i           !IdentifierChar _ { return 'CHARSET' }
COLLATE           = _ 'COLLATE'i           !IdentifierChar _ { return 'COLLATE' }
COLUMN            = _ 'COLUMN'i            !IdentifierChar _ { return 'COLUMN' }
COMMENT           = _ 'COMMENT'i           !IdentifierChar _ { return 'COMMENT' }
CONSTRAINT        = _ 'CONSTRAINT'i        !IdentifierChar _ { return 'CONSTRAINT' }
CREATE            = _ 'CREATE'i            !IdentifierChar _ { return 'CREATE' }
CURRENT_TIMESTAMP = _ 'CURRENT_TIMESTAMP'i !IdentifierChar _ { return 'CURRENT_TIMESTAMP' }
DATE              = _ 'DATE'i              !IdentifierChar _ { return 'DATE' }
DATETIME          = _ 'DATETIME'i          !IdentifierChar _ { return 'DATETIME' }
DECIMAL           = _ 'DECIMAL'i           !IdentifierChar _ { return 'DECIMAL' }
DECLARE           = _ 'DECLARE'i           !IdentifierChar _ { return 'DECLARE' }
DEFAULT           = _ 'DEFAULT'i           !IdentifierChar _ { return 'DEFAULT' }
DELETE            = _ 'DELETE'i            !IdentifierChar _ { return 'DELETE' }
DESC              = _ 'DESC'i              !IdentifierChar _ { return 'DESC' }
DETERMINISTIC     = _ 'DETERMINISTIC'i     !IdentifierChar _ { return 'DETERMINISTIC' }
DIV               = _ 'DIV'i               !IdentifierChar _ { return 'DIV' }
DO                = _ 'DO'i                !IdentifierChar _ { return 'DO' }
DOUBLE            = _ 'DOUBLE'i            !IdentifierChar _ { return 'DOUBLE' }
DROP              = _ 'DROP'i              !IdentifierChar _ { return 'DROP' }
EACH              = _ 'EACH'i              !IdentifierChar _ { return 'EACH' }
ELSE              = _ 'ELSE'i              !IdentifierChar _ { return 'ELSE' }
ELSEIF            = _ 'ELSEIF'i            !IdentifierChar _ { return 'ELSEIF' }
END               = _ 'END'i               !IdentifierChar _ { return 'END' }
ENGINE            = _ 'ENGINE'i            !IdentifierChar _ { return 'ENGINE' }
ENUM              = _ 'ENUM'i              !IdentifierChar _ { return 'ENUM' }
EXCLUSIVE         = _ 'EXCLUSIVE'i         !IdentifierChar _ { return 'EXCLUSIVE' }
EXISTS            = _ 'EXISTS'i            !IdentifierChar _ { return 'EXISTS' }
FALSE             = _ 'FALSE'i             !IdentifierChar _ { return 'FALSE' }
FIRST             = _ 'FIRST'i             !IdentifierChar _ { return 'FIRST' }
FLOAT             = _ 'FLOAT'i             !IdentifierChar _ { return 'FLOAT' }
FOLLOWS           = _ 'FOLLOWS'i           !IdentifierChar _ { return 'FOLLOWS' }
FOR               = _ 'FOR'i               !IdentifierChar _ { return 'FOR' }
FOREIGN           = _ 'FOREIGN'i           !IdentifierChar _ { return 'FOREIGN' }
FULL              = _ 'FULL'i              !IdentifierChar _ { return 'FULL' }
FULLTEXT          = _ 'FULLTEXT'i          !IdentifierChar _ { return 'FULLTEXT' }
FUNCTION          = _ 'FUNCTION'i          !IdentifierChar _ { return 'FUNCTION' }
GENERATED         = _ 'GENERATED'i         !IdentifierChar _ { return 'GENERATED' }
HASH              = _ 'HASH'i              !IdentifierChar _ { return 'HASH' }
IF                = _ 'IF'i                !IdentifierChar _ { return 'IF' }
INDEX             = _ 'INDEX'i             !IdentifierChar _ { return 'INDEX' }
INSERT            = _ 'INSERT'i            !IdentifierChar _ { return 'INSERT' }
INT               = _ 'INT'i               !IdentifierChar _ { return 'INT' }
INTEGER           = _ 'INTEGER'i           !IdentifierChar _ { return 'INTEGER' }
IS                = _ 'IS'i                !IdentifierChar _ { return 'IS' }
JSON              = _ 'JSON'i              !IdentifierChar _ { return 'JSON' }
KEY               = _ 'KEY'i               !IdentifierChar _ { return 'KEY' }
LIKE              = _ 'LIKE'i              !IdentifierChar _ { return 'LIKE' }
LOCK              = _ 'LOCK'i              !IdentifierChar _ { return 'LOCK' }
MATCH             = _ 'MATCH'i             !IdentifierChar _ { return 'MATCH' }
MEDIUMINT         = _ 'MEDIUMINT'i         !IdentifierChar _ { return 'MEDIUMINT' }
MOD               = _ 'MOD'i               !IdentifierChar _ { return 'MOD' }
MODIFY            = _ 'MODIFY'i            !IdentifierChar _ { return 'MODIFY' }
NEW               = _ 'NEW'i               !IdentifierChar _ { return 'NEW' }
NO                = _ 'NO'i                !IdentifierChar _ { return 'NO' }
NONE              = _ 'NONE'i              !IdentifierChar _ { return 'NONE' }
NOT               = _ 'NOT'i               !IdentifierChar _ { return 'NOT' }
NOW               = _ 'NOW'i               !IdentifierChar _ { return 'NOW' }
NULL              = _ 'NULL'i              !IdentifierChar _ { return 'NULL' }
NUMERIC           = _ 'NUMERIC'i           !IdentifierChar _ { return 'NUMERIC' }
OLD               = _ 'OLD'i               !IdentifierChar _ { return 'OLD' }
ON                = _ 'ON'i                !IdentifierChar _ { return 'ON' }
OR                = _ 'OR'i                !IdentifierChar _ { return 'OR' }
PARTIAL           = _ 'PARTIAL'i           !IdentifierChar _ { return 'PARTIAL' }
PRECEDES          = _ 'PRECEDES'i          !IdentifierChar _ { return 'PRECEDES' }
PRIMARY           = _ 'PRIMARY'i           !IdentifierChar _ { return 'PRIMARY' }
REAL              = _ 'REAL'i              !IdentifierChar _ { return 'REAL' }
REFERENCES        = _ 'REFERENCES'i        !IdentifierChar _ { return 'REFERENCES' }
REGEXP            = _ 'REGEXP'i            !IdentifierChar _ { return 'REGEXP' }
RENAME            = _ 'RENAME'i            !IdentifierChar _ { return 'RENAME' }
RESTRICT          = _ 'RESTRICT'i          !IdentifierChar _ { return 'RESTRICT' }
RETURN            = _ 'RETURN'i            !IdentifierChar _ { return 'RETURN' }
RETURNS           = _ 'RETURNS'i           !IdentifierChar _ { return 'RETURNS' }
RLIKE             = _ 'RLIKE'i             !IdentifierChar _ { return 'RLIKE' }
ROW               = _ 'ROW'i               !IdentifierChar _ { return 'ROW' }
SELECT            = _ 'SELECT'i            !IdentifierChar _ { return 'SELECT' }
SET               = _ 'SET'i               !IdentifierChar _ { return 'SET' }
SHARED            = _ 'SHARED'i            !IdentifierChar _ { return 'SHARED' }
SIMPLE            = _ 'SIMPLE'i            !IdentifierChar _ { return 'SIMPLE' }
SMALLINT          = _ 'SMALLINT'i          !IdentifierChar _ { return 'SMALLINT' }
STORED            = _ 'STORED'i            !IdentifierChar _ { return 'STORED' }
TABLE             = _ 'TABLE'i             !IdentifierChar _ { return 'TABLE' }
TEXT              = _ 'TEXT'i              !IdentifierChar _ { return 'TEXT' }
THEN              = _ 'THEN'i              !IdentifierChar _ { return 'THEN' }
TIME              = _ 'TIME'i              !IdentifierChar _ { return 'TIME' }
TIMESTAMP         = _ 'TIMESTAMP'i         !IdentifierChar _ { return 'TIMESTAMP' }
TINYINT           = _ 'TINYINT'i           !IdentifierChar _ { return 'TINYINT' }
TO                = _ 'TO'i                !IdentifierChar _ { return 'TO' }
TRIGGER           = _ 'TRIGGER'i           !IdentifierChar _ { return 'TRIGGER' }
TRUE              = _ 'TRUE'i              !IdentifierChar _ { return 'TRUE' }
UNIQUE            = _ 'UNIQUE'i            !IdentifierChar _ { return 'UNIQUE' }
UNLOCK            = _ 'UNLOCK'i            !IdentifierChar _ { return 'UNLOCK' }
UNSIGNED          = _ 'UNSIGNED'i          !IdentifierChar _ { return 'UNSIGNED' }
UPDATE            = _ 'UPDATE'i            !IdentifierChar _ { return 'UPDATE' }
USING             = _ 'USING'i             !IdentifierChar _ { return 'USING' }
VARBINARY         = _ 'VARBINARY'i         !IdentifierChar _ { return 'VARBINARY' }
VARCHAR           = _ 'VARCHAR'i           !IdentifierChar _ { return 'VARCHAR' }
VIRTUAL           = _ 'VIRTUAL'i           !IdentifierChar _ { return 'VIRTUAL' }
WHILE             = _ 'WHILE'i             !IdentifierChar _ { return 'WHILE' }
XOR               = _ 'XOR'i               !IdentifierChar _ { return 'XOR' }

// Reserved built-in functions
// TODO: Complete this list
CHAR_LENGTH       = _ 'CHAR_LENGTH'i       !IdentifierChar _ { return 'CHAR_LENGTH' }
CONCAT            = _ 'CONCAT'i            !IdentifierChar _ { return 'CONCAT' }
CONV              = _ 'CONV'i              !IdentifierChar _ { return 'CONV' }
HEX               = _ 'HEX'i               !IdentifierChar _ { return 'HEX' }
SUBSTRING         = _ 'SUBSTRING'i         !IdentifierChar _ { return 'SUBSTRING' }
UNHEX             = _ 'UNHEX'i             !IdentifierChar _ { return 'UNHEX' }

// Composite types
NOT_NULL = NOT NULL { return 'NOT NULL' }

// ====================================================
// Tokens
// ====================================================

ARROW      = _ '->' _   { return '->' }
ARROWW     = _ '->>' _  { return '->>' }
BANG       = _ '!' _    { return '+' }
COMMA      = _ ',' _    { return ',' }
DIVIDE     = _ '/' _    { return '/' }
EQ         = _ '=' _    { return '=' }
GT         = _ '>' _    { return '>' }
GTE        = _ '>=' _   { return '>=' }
LPAREN     = _ '(' _    { return '(' }
LT         = _ '<' _    { return '<' }
LTE        = _ '<=' _   { return '<=' }
MINUS      = _ '-' _    { return '-' }
MULT       = _ '*' _    { return '*' }
NE         = _ '<=>' _  { return '<=>' }
NE1        = _ '<>' _   { return '<>' }
NE2        = _ '!=' _   { return '<>' }
PERCENTAGE = _ '%' _    { return '%' }
PLUS       = _ '+' _    { return '+' }
RPAREN     = _ ')' _    { return ')' }
SEMICOLON  = _ ';' _    { return ';' }
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
