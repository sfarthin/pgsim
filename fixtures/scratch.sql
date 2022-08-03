COPY x (a, b, c, d, e) from 'foobar';

-- TODO, automatically
COPY x (a, b, c, d, e) from stdin;
9999	\N	\\N	\NN	\N
10000	21	31	41	51
\.

    -- COPY x (b, d) from stdin;
    -- 1	test_1
    -- \.

    -- COPY x (b, d) from stdin;
    -- 2	test_2
    -- 3	test_3
    -- 4	test_4
    -- 5	test_5
    -- \.