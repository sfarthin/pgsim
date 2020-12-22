{
    function combineComments(...c) {
        return c.filter(Boolean).join('\n').replace(/\n\n/gi, '\n')
    }

    /**
     * ColDef
     */

    const includesReferenceCatalog = [
        "time with time zone", 
        "timestamp with time zone", 
        "smallint", 
        "integer",
        "bigint",
        "boolean",
        "real",
        "bit varying",
        "double precision",
        "bit",
        "int",
        "interval day to hour",
        'interval',
        'decimal',
        'numeric',
        'varchar',
        'char',
        'character',
        'character varying'
    ];

    const colTypeMap = {
        'bit varying': 'varbit',
        'bigint': 'int8',
        'integer': 'int4',
        'int': 'int4',
        'interval day to hour': 'interval',
        'boolean': 'bool',
        'real': 'float4',
        "smallint": 'int2',
        "double precision": 'float8',
        'decimal': 'numeric',
        'char': 'bpchar',
        'character': 'bpchar',
        'character varying': 'varchar',
        'time with time zone': 'timetz',
        "timestamp with time zone": "timestamptz"
    };

    const defaultTypeMods = {
        'bit': 1,
        "interval day to hour": 1032,
        'char': 1,
        'character': 1
    };
}
start = StatementList

StatementList
  = first:Statement rest:StatementList { 
      return [{ RawStmt: { stmt: first } }, ...rest] 
    }
  / only:Statement { 
      return [{ RawStmt: { stmt: only } }] 
    }

Statement 
  = c:CreateStmt {
    return { CreateStmt: c }
  }
  / c:CreateSeqStmt {
      return { CreateSeqStmt: c }
  }
  / c:AlterSeqStmt {
      return { AlterSeqStmt: c }
  }
  / c:CreateEnumStmt {
      return { CreateEnumStmt: c }
  }
  / c:VariableSetStmt {
      return { VariableSetStmt: c }
  }
  / c:COMMENT {
      return { Comment: c }
  }

CreateStmt = 
    c1:CREATE c2:TABLE ifNotExists:IF_NOT_EXISTS? 
    tblName:Identifier
    c3:DIRECT_COMMENT? // <-- This expression is used when there is inline comment on the same line after tablename
    c4:LPAREN
    columnDefs:ColumnDefs 
    cc:COMMENTS
    c5:RPAREN
    c6:EndOfStatement? { // <-- This expression is only used when there are no defElems

    return {
        relation: {
            RangeVar: {
                relname: tblName.value,
                relpersistence: "p",
                location: location(),
                inh: true
            }
        },
        tableElts: columnDefs,
        oncommit: 0,
        ...(ifNotExists ? {if_not_exists: ifNotExists.value} : null),
        comment: combineComments(c1,c2,ifNotExists && ifNotExists.comment,tblName.comment, c3, c4, c5, c6, cc)
    }
}

// Skipping precision for timestamps for now.
// https://www.postgresql.org/docs/9.1/datatype-datetime.html
ColTypeWithParam = 'bit varying'i / 'varbit'i / 'decimal'i / 'numeric'i / 'character varying'i / 'varchar'i / 'character'i / 'char'i 
                / 'timestamp with time zone'i / 'timestamptz'i / 'timestamp'i
                / 'timestamp without time zone'i 
                / 'time with time zone'i / 'time without time zone'i / 'timetz'i / 'time'i / 'bit'i 
ColTypeWithDoubleParam = 'decimal'i / 'numeric'i
ColTypeNoParam = 'boolean'i / 'bool'i / 'box'i / 'bytea'i / 'cidr'i / 'circle'i / 'date'i / 'inet'i / 'line'i / 'lseg'i / 'macaddr'i 
               / 'money'i / 'tsquery'i / 'tsvector'i / 'txid_snapshot'i / 'uuid'i / 'xml'i / 'integer'i / 'int4'i  / 'bigint'i
               / 'int8'i / 'bigserial'i / 'serial4'i / 'serial8'i / 'serial'i / 'real'i / 'float4'i / 'smallint'i / 'int2'i / 'double precision'i
               / 'float8'i / 'text'i / 'date'i
               / 'interval year to month'i
               / 'interval day to hour'i
               / 'interval day to minute'i
               / 'interval day to second'i
               / 'interval hour to minute'i
               / 'interval hour to second'i 
               / 'interval minute to second'i
               / 'interval year'i
               / 'interval month'i
               / 'interval day'i
               / 'interval hour'i
               / 'interval minute'i
               / 'interval second'i
               / 'interval'i 
               / 'int'i / ColTypeWithParam / ColTypeWithDoubleParam

ColumnDefs = 
   first:ColumnDef _ c:COMMA _ rest:ColumnDefs { 
      return [{ ColumnDef: {...first, comment: combineComments(first.comment, c)} }, ...rest] 
    }
  / only:ColumnDef { 
      return [{ ColumnDef: only }] 
    }

ColumnDef = _ colName:Identifier _ typeName:TypeName {
        return {
            colname: colName.value,
            typeName: { TypeName: typeName },
            // constraints?: Array<{ Constraint: Constraint }>;
            is_local: true,
            // collClause?: unknown;
            location: location(),
            comment: combineComments(colName.comment)
        }
    }

TypeNameWithTwoParams = _ col:ColTypeWithParam _ c1:LPAREN _ a_const1:A_Const_Integer _ c2:COMMA _ a_const2:A_Const_Integer _ c3:RPAREN _ {
    const base = includesReferenceCatalog.includes(col.toLowerCase()) ? [{ String: { str: "pg_catalog" } }] : [];
    return {
        names: base.concat({
            String: { str: (colTypeMap[col.toLowerCase()] || col).toLowerCase() }
        }),
        typemod: -1,
        typmods: [{ A_Const: a_const1 }, { A_Const: a_const2 }],
        location: location()
    }
}

TypeNameWithParam = _ col:ColTypeWithParam _ c1:LPAREN _ a_const:A_Const_Integer _ c3:RPAREN _ {
    const base = includesReferenceCatalog.includes(col.toLowerCase()) ? [{ String: { str: "pg_catalog" } }] : [];
    return {
        names: base.concat({
            String: { str: (colTypeMap[col.toLowerCase()] || col).toLowerCase() }
        }),
        typemod: -1,
        typmods: [{ A_Const: a_const }],
        location: location()
    }
}

TypeNameWithNoParam = _ col:ColTypeNoParam _ {
    const base = includesReferenceCatalog.includes(col.toLowerCase()) ? [{ String: { str: "pg_catalog" } }] : [];
    const typmods = defaultTypeMods[col.toLowerCase()] ? [{
        A_Const: {
            val: {  Integer: { ival: defaultTypeMods[col.toLowerCase()] } },
            location: location()
        }
    }] : null;
    return {
        names: base.concat({
            String: { str: (colTypeMap[col.toLowerCase()] || col).toLowerCase() }
        }),
        typemod: -1,
        ...(typmods ? { typmods } : {}),
        location: location()
    }
}

TypeName = TypeNameWithTwoParams / TypeNameWithParam / TypeNameWithNoParam

// Eventually we'd want to check for only the params in pg_settings and a valid value type.
VariableSetStmt = 
    c1:SET fieldName:Identifier _ "=" _ a_const:A_Const c2:EndOfStatement {
        return {
            kind: 0,
            name: fieldName.value,
            args: [{
                A_Const: a_const
            }],
            comment: combineComments(c1, fieldName.comment, c2)
        }
    }

A_Const = v:SingleQuotedStringLiteral {
    return {
        val: { 
            String: v
        },
        location: location()
    }
} / A_Const_Integer / A_Const_Float / A_Const_Keyword


A_Const_Integer "integer" = seq:([0-9]+) {
    return {
        val: { 
            Integer: { ival: Number(seq.join('')) }
        },
        location: location()
    }
}

A_Const_Float "float" = seq1:([0-9]+) "." seq2:([0-9]+) {
    return {
        val: { 
            Float: { str: `${seq1.join('')}.${seq2.join('')}` }
        },
        location: location()
    }
}

A_Const_Keyword "keyword" = seq:([^; \t\r\n]+) {
    return {
        val: { 
            String: { str: seq.join('') }
        },
        location: location()
    }
}

CreateEnumStmt =
    c1:CREATE c2:TYPE
    typeName:TableIdentifier
    c3:AS c4:ENUM c5:LPAREN
    s: SingleQuotedStringLiteralList
    c6:RPAREN 
    c7:EndOfStatement {
        return {
            typeName: typeName.value,
            vals: s,
            comment: combineComments(c1,c2,typeName.comment,c3,c4,c5,c6,c7)
        }
    }

AlterSeqStmt =
    c1:ALTER c2:SEQUENCE
    tblName:Identifier
    c3:DIRECT_COMMENT? // <-- This expression is used when there is inline comment on the same line after tablename
    defElems:SequenceDefElemList 
    c4:EndOfStatement? { // <-- This expression is only used when there are no defElems
        return {
            sequence: { 
                RangeVar: {
                    relname: tblName.value,
                    relpersistence: 'p',
                    inh: true,
                    location: location()
                }
            },
            options: defElems,
            comment: combineComments(c1, c2, tblName.comment, c3, c4)
        }
    }

CreateSeqStmt =
    c1:CREATE c2:SEQUENCE 
    ifNotExists:IF_NOT_EXISTS?
    tblName:Identifier
    c4:DIRECT_COMMENT? // <-- This expression is used when there is inline comment on the same line after tablename
    defElems:SequenceDefElemList?
    c5:EndOfStatement? { // <-- This expression is only used when there are no defElems
        return {
            sequence: { 
                RangeVar: {
                    relname: tblName.value,
                    relpersistence: 'p',
                    inh: true,
                    location: location()
                }
            },
            options: defElems || [],
            ...(ifNotExists ? {if_not_exists: ifNotExists.value} : null),
            comment: combineComments(c1, c2, ifNotExists && ifNotExists.comment, tblName.comment, c4, c5)
        }
    }

SequenceDefElemList
  = first:SequenceDefElem _ rest:SequenceDefElemList { return [{ DefElem: first }, ...rest] }
  / only:SequenceDefElem c:EndOfStatement { return [{ DefElem: { ...only, comment: combineComments(only.comment, c) } } ] }

SequenceDefElem
    =
    c1:OWNED c2:BY c3:NONE c4:DIRECT_COMMENTS {
        return {
            defname: 'owned_by',
            arg: [{ String: { str: "none" } }],
            defaction: 0,
            location: location(),
            comment: combineComments(c1, c2, c3, c4)
        }
    } /
    c1:OWNED c2:BY tbl:Identifier '.' col:Identifier c4:DIRECT_COMMENTS {
        return { 
            defname: 'owned_by',
            defaction: 0,
            arg: [{ String: { str: tbl.value } }, { String: { str: col.value } }],
            location: location(),
            comment: combineComments(c1, c2, tbl.comment, col.comment, c4)
        }
    } /
    c1:NO c2:CYCLE c3:DIRECT_COMMENTS {
        return {
            defname: 'cycle',
            defaction: 0,
            arg: { Integer: { ival: 0 } },
            location: location(),
            comment: combineComments(c1, c2, c3)
        }
    } /
    c1:NO c2:MAXVALUE c3:DIRECT_COMMENTS {
        return {
            defname: 'maxvalue',
            defaction: 0,
            location: location(),
            comment: combineComments(c1, c2, c3)
        }
    } /
    c1:NO c2:MINVALUE c3:DIRECT_COMMENTS {
        return {
            defname: 'minvalue',
            defaction: 0,
            location: location(),
            comment: combineComments(c1, c2, c3)
        }
    } /
    c1:NO c2:CACHE c3:DIRECT_COMMENTS {
        return {
            defname: 'cache',
            defaction: 0,
            location: location(),
            comment: combineComments(c1, c2, c3)
        }
    } /
    c1:CYCLE c2:DIRECT_COMMENTS {
        return {
            defname: 'cycle',
            defaction: 0,
            arg: { Integer: { ival: 1 } },
            location: location(),
            comment: combineComments(c1, c2)
        }
    } /
    c1:MAXVALUE num:NumberLiteral c2:DIRECT_COMMENTS {
        return { 
            defname: 'maxvalue',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, num.comment, c2)
        }
    } /
    c1:MINVALUE num:NumberLiteral c2:DIRECT_COMMENTS {
        return { 
            defname: 'minvalue',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, num.comment, c2)
        }
    } /
    c1:CACHE num:NumberLiteral c2:DIRECT_COMMENTS {
        return { 
            defname: 'cache',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, num.comment, c2)
        }
    } /
    c1:START c2:WITH? num:NumberLiteral c3:DIRECT_COMMENTS {
        return { 
            defname: 'start',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, c2, num.comment, c3)
        }
    } /
    c1:INCREMENT c2:BY? num:NumberLiteral c3:DIRECT_COMMENTS {
        return { 
            defname: 'increment',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, c2, num.comment, c3)
        }
    }

// ====================================================
// Keywords
// ====================================================
IdentifierStart = [a-zA-Z_]
IdentifierChar = [a-zA-Z0-9_]

Keyword
  = CREATE / SEQUENCE

COMMENT_WITHOUT_SPACE "comment" 
 = "/*" c:(!"*/" .)* "*/" "\n"? {
    // Trim whitespace and preceding "*" s
    return c.map((p) => p[1]).join('').replace(/[\*\s]*\n[\*\s]*/gi, '\n').replace(/^\s|\s$/g, '');
 }
 / "--" c:(!"\n" .)* NEWLINE_OR_EOF {
     // Trim whitespace left and right
    return c.map((p) => p[1]).join('').replace(/^\s|\s$/g, '');
 }

COMMENT "comment" = _ c:COMMENT_WITHOUT_SPACE _ {
    return c;
}

COMMENTS = lc:COMMENT* {
    return combineComments(...lc)
}

NEWLINE_OR_EOF = "\n" / EOF

// A comment directly desribing a piece of code. It can be on the same line or
// directly above.
DIRECT_COMMENT = WhitespaceWithoutNewline* c:COMMENT_WITHOUT_SPACE WhitespaceWithoutNewline* {
    return c;
}

DIRECT_COMMENTS = lc:DIRECT_COMMENT* {
    return combineComments(...lc)
}

// Keywords will return any comments directly preceding them.
ALTER             = _ c:DIRECT_COMMENTS 'ALTER'i             !IdentifierChar _ { return c }
AS                = _ c:DIRECT_COMMENTS 'AS'i                !IdentifierChar _ { return c }
BY                = _ c:DIRECT_COMMENTS 'BY'i                !IdentifierChar _ { return c }
CACHE             = _ c:DIRECT_COMMENTS 'CACHE'i             !IdentifierChar _ { return c }
CREATE            = _ c:DIRECT_COMMENTS 'CREATE'i            !IdentifierChar _ { return c }
CYCLE             = _ c:DIRECT_COMMENTS 'CYCLE'i             !IdentifierChar _ { return c }
DOT               = _ c:DIRECT_COMMENTS 'DOT'i               !IdentifierChar _ { return c }
ENUM              = _ c:DIRECT_COMMENTS 'ENUM'i              !IdentifierChar _ { return c }
EXISTS            = _ c:DIRECT_COMMENTS 'EXISTS'i            !IdentifierChar _ { return c }
IF                = _ c:DIRECT_COMMENTS 'IF'i                !IdentifierChar _ { return c }
INCREMENT         = _ c:DIRECT_COMMENTS 'INCREMENT'i         !IdentifierChar _ { return c }
MAXVALUE          = _ c:DIRECT_COMMENTS 'MAXVALUE'i          !IdentifierChar _ { return c }
MINVALUE          = _ c:DIRECT_COMMENTS 'MINVALUE'i          !IdentifierChar _ { return c }
NO                = _ c:DIRECT_COMMENTS 'NO'i                !IdentifierChar _ { return c }
NONE              = _ c:DIRECT_COMMENTS 'NONE'i              !IdentifierChar _ { return c }
NOT               = _ c:DIRECT_COMMENTS 'NOT'i               !IdentifierChar _ { return c }
OWNED             = _ c:DIRECT_COMMENTS 'OWNED'i             !IdentifierChar _ { return c }
PUBLIC            = _ c:DIRECT_COMMENTS 'PUBLIC'i            !IdentifierChar _ { return c }
SEQUENCE          = _ c:DIRECT_COMMENTS 'SEQUENCE'i          !IdentifierChar _ { return c }
SET               = _ c:DIRECT_COMMENTS 'SET'i               !IdentifierChar _ { return c }
START             = _ c:DIRECT_COMMENTS 'START'i             !IdentifierChar _ { return c }
TABLE             = _ c:DIRECT_COMMENTS 'TABLE'i             !IdentifierChar _ { return c }
TYPE              = _ c:DIRECT_COMMENTS 'TYPE'i              !IdentifierChar _ { return c }
WITH              = _ c:DIRECT_COMMENTS 'WITH'i              !IdentifierChar _ { return c }

// Phrases
IF_NOT_EXISTS     = c1:IF c2:NOT c3:EXISTS { return { comment: combineComments(c1,c2,c3), value: true }; }

// ====================================================
// Util
// ====================================================
_ "whitespace" = Whitespace* { return null }
Whitespace = [ \t\r\n]
WhitespaceWithoutNewline "whitespace" = [ \t\r]

IdentifierWithoutComment
  = _ !Keyword first:IdentifierStart rest:IdentifierChar* _ { return [first, ...rest].join('') }

Identifier = comment:DIRECT_COMMENTS value:IdentifierWithoutComment {
    return { comment: comment, value: value }
}

// We allow only a single schema, "public"
TableIdentifier
 = (PUBLIC DOT)? s:Identifier {
     return { value: [{ String: { str: s.value } }], comment: s.comment };
 }

NumberLiteralWithoutComment
  = digits:[0-9]+ { return parseInt(digits.join(''), 10) }

NumberLiteral = comment:DIRECT_COMMENTS value:NumberLiteralWithoutComment {
    return { comment: comment, value: value }
}

SingleQuotedStringLiteralList
  = first:SingleQuotedStringLiteralWithComments _ c:COMMA _ rest:SingleQuotedStringLiteralList { 
      return [{ String: first.String, comment: combineComments(first.comment, c) }, ...rest] 
    }
  / only:SingleQuotedStringLiteralWithComments { return [only] }

SingleQuotedStringLiteralWithComments = c1:COMMENTS _ s:SingleQuotedStringLiteral _ c2:COMMENTS {
    return { String: s, comment: combineComments(c1, c2) }
}

SingleQuotedStringLiteral "string"
  = "'" seq:( "''" / "\\'" { return "''" } / [^'] )* "'" {
    return { str: seq.join('') }
  }


EOF
  = !.

EndOfStatement = EOF { return null } / c:SEMICOLON { return c }

// ====================================================
// Tokens
// ====================================================
SEMICOLON  = _ c1:DIRECT_COMMENT? ';' c2:DIRECT_COMMENTS? _    { return combineComments(c1,c2) }
LPAREN     = _ c1:DIRECT_COMMENT? '(' c2:DIRECT_COMMENT? _    { return combineComments(c1,c2) }
RPAREN     = _ c1:DIRECT_COMMENT? ')' c2:DIRECT_COMMENT? _    { return combineComments(c1,c2) }
COMMA      = _ c1:DIRECT_COMMENT? ',' c2:DIRECT_COMMENT? _    { return combineComments(c1,c2) }