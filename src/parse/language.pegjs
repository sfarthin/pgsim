{
    function combineComments(...c) {
        return c.filter(Boolean).join('\n').replace(/\n\n/gi, '\n')
    }
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
  = c:CreateSeqStmt {
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

// VariableSetValue = SingleQuotedStringLiteral
// / seq:([^;]+) {
//     return seq.join('');
// }

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
    tblName:Identifier
    c3:DIRECT_COMMENT? // <-- This expression is used when there is inline comment on the same line after tablename
    defElems:SequenceDefElemList?
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
            options: defElems || [],
            comment: combineComments(c1, c2, tblName.comment, c3, c4)
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
    c1:START WITH num:NumberLiteral c2:DIRECT_COMMENTS {
        return { 
            defname: 'start',
            defaction: 0,
            arg: { Integer: { ival: num.value } },
            location: location(),
            comment: combineComments(c1, num.comment, c2)
        }
    } /
    c1:INCREMENT c2:BY num:NumberLiteral c3:DIRECT_COMMENTS {
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
INCREMENT         = _ c:DIRECT_COMMENTS 'INCREMENT'i         !IdentifierChar _ { return c }
MAXVALUE          = _ c:DIRECT_COMMENTS 'MAXVALUE'i          !IdentifierChar _ { return c }
MINVALUE          = _ c:DIRECT_COMMENTS 'MINVALUE'i          !IdentifierChar _ { return c }
NO                = _ c:DIRECT_COMMENTS 'NO'i                !IdentifierChar _ { return c }
NONE              = _ c:DIRECT_COMMENTS 'NONE'i              !IdentifierChar _ { return c }
OWNED             = _ c:DIRECT_COMMENTS 'OWNED'i             !IdentifierChar _ { return c }
SET               = _ c:DIRECT_COMMENTS 'SET'i               !IdentifierChar _ { return c }
SEQUENCE          = _ c:DIRECT_COMMENTS 'SEQUENCE'i          !IdentifierChar _ { return c }
START             = _ c:DIRECT_COMMENTS 'START'i             !IdentifierChar _ { return c }
PUBLIC            = _ c:DIRECT_COMMENTS 'PUBLIC'i            !IdentifierChar _ { return c }
TYPE              = _ c:DIRECT_COMMENTS 'TYPE'i              !IdentifierChar _ { return c }
WITH              = _ c:DIRECT_COMMENTS 'WITH'i              !IdentifierChar _ { return c }

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