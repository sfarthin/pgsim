start = StatementList

StatementList
  = first:Statement SEMICOLON* rest:StatementList { 
      return [{ RawStmt: { stmt: first } }, ...rest] 
    }
  / only:Statement SEMICOLON? { return [{ RawStmt: { stmt: only } }] }

Statement
  = c:CreateSeqStmt {
      return { CreateSeqStmt: c }
  }
  
CreateSeqStmt =
    CREATE SEQUENCE 
    tblName:Identifier
    defElems:DefElemList {
        return {
            sequence: { RangeVar: { relname: tblName } },
            options: defElems
        }
        
    }

DefElemList
  = first:DefElem _ rest:DefElemList { return [{ DefElem: first }, ...rest] }
  / only:DefElem { return [{ DefElem: only } ] }

DefElem
    =
    OWNED BY NONE {
        return { defname: 'owned_by' }
    } /
    OWNED BY tbl:Identifier '.' col:Identifier {
        return { 
            defname: 'owned_by',
            arg: [{ String: { str: tbl } }, { String: { str: col } }]
        }
    } /
    NO CYCLE {
        return { defname: 'cycle' }
    } /
    NO MAXVALUE {
        return { defname: 'maxvalue' }
    } /
    NO MINVALUE {
        return { defname: 'minvalue' }
    } /
    NO CACHE {
        return { defname: 'cache' }
    } /
    CYCLE {
        return {
            defname: 'cycle',
            arg: { Integer: { ival: 1 } }
        }
    } /
    MAXVALUE num:NumberLiteral {
        return { 
            defname: 'maxvalue',
            arg: { Integer: { ival: num } }
        }
    } /
    MINVALUE num:NumberLiteral {
        return { 
            defname: 'minvalue',
            arg: { Integer: { ival: num } }
        }
    } /
    CACHE num:NumberLiteral {
        return { 
            defname: 'cache',
            arg: { Integer: { ival: num } }
        }
    } /
    START WITH num:NumberLiteral {
        return { 
            defname: 'start',
            arg: { Integer: { ival: num } }
        }
    } /
    INCREMENT BY num:NumberLiteral {
        return { 
            defname: 'increment',
            arg: { Integer: { ival: num } }
        }
    }

// ====================================================
// Keywords
// ====================================================
IdentifierStart = [a-zA-Z_]
IdentifierChar = [a-zA-Z0-9_]

Keyword
  = CREATE / SEQUENCE

CREATE            = _ 'CREATE'i            !IdentifierChar _ { return 'CREATE' }
SEQUENCE          = _ 'SEQUENCE'i         !IdentifierChar _ { return 'SEQUENCE' }
INCREMENT         = _ 'INCREMENT'i         !IdentifierChar _ { return 'INCREMENT' }
BY                = _ 'BY'i                !IdentifierChar _ { return 'BY' }
NO                = _ 'NO'i                !IdentifierChar _ { return 'NO' }
CYCLE             = _ 'CYCLE'i             !IdentifierChar _ { return 'CYCLE' }
START             = _ 'START'i             !IdentifierChar _ { return 'START' }
WITH              = _ 'WITH'i              !IdentifierChar _ { return 'WITH' }
MAXVALUE          = _ 'MAXVALUE'i          !IdentifierChar _ { return 'MAXVALUE' }
MINVALUE          = _ 'MINVALUE'i          !IdentifierChar _ { return 'MINVALUE' }
CACHE             = _ 'CACHE'i             !IdentifierChar _ { return 'CACHE' }
OWNED             = _ 'OWNED'i             !IdentifierChar _ { return 'OWNED' }
NONE              = _ 'NONE'i              !IdentifierChar _ { return 'NONE' }

// ====================================================
// Util
// ====================================================
_ "whitespace" = Whitespace* { return null }
Whitespace = [ \t\r\n]

// TODO: Let this return identifier() nodes
Identifier
  = QuotedIdentifier
  / NonQuotedIdentifier

QuotedIdentifier
  = _ '`' chars:[^`]+ '`' _ { return chars.join('') }

NonQuotedIdentifier
  = _ !Keyword first:IdentifierStart rest:IdentifierChar* _ { return [first, ...rest].join('') }

NumberLiteral
  = digits:[0-9]+ { return parseInt(digits.join(''), 10) }


// ====================================================
// Tokens
// ====================================================
SEMICOLON  = _ ';' _    { return ';' }