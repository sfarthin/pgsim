-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
-- 8
-- 9
INSERT INTO sequelizemeta (name) VALUES (1);

INSERT INTO foo (foobar, pumpkin) VALUES (1, '1');

INSERT INTO foo (
	a,
	b,
	c,
	d,
	e,
	f,
	g,
	h,
	i,
	j,
	k,
	l,
	m,
	n,
	o,
	p,
	q,
	r,
	s,
	t,
	u,
	v,
	x,
	y,
	z
) VALUES (
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'x',
	'y',
	'z'
);

INSERT INTO foo (foobar, pumpkin) VALUES (1, '1') RETURNING id, foo.id;

INSERT INTO "SequelizeMeta" (name) VALUES ($1) RETURNING name;

INSERT INTO foo (
	foo,
	bar
) VALUES (
	'foo',
	(SELECT id FROM foobar WHERE foo = 'bar')
);