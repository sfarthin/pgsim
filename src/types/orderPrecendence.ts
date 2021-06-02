// See https://www.postgresql.org/docs/7.2/sql-precedence.html
// decreasing order

import { RawValue } from "./rawExpr";

// ::	left	PostgreSQL-style typecast
// [ ]	left	array element selection
// .	left	table/column name separator
// -	right	unary minus
// ^	left	exponentiation
// * / %	left	multiplication, division, modulo
// + -	left	addition, subtraction
// IS	 	test for TRUE, FALSE, UNKNOWN, NULL
// ISNULL	 	test for NULL
// NOTNULL	 	test for NOT NULL
// (any other)	left	all other native and user-defined operators
// IN	 	set membership
// BETWEEN	 	containment
// OVERLAPS	 	time interval overlap
// LIKE ILIKE	 	string pattern matching
// < >	 	less than, greater than
// =	right	equality, assignment
// NOT	right	logical negation
// AND	left	logical conjunction
// OR	left	logical disjunction
// const precendence = [
//     ['TypeCast', 'left']
// ] as const

// export default function adjustPrecedence(node: RawValue): RawValue {

// }
