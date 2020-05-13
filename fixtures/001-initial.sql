SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE TYPE enum_master_accounts_status AS ENUM (
    'ok',
    'mfa',
    'waiting',
    'waiting-historical',
    'error'
);


CREATE TABLE accounts (
    id integer NOT NULL,
    plaid_id character varying(255) NOT NULL,
    plaid_item character varying(255),
    plaid_user character varying(255),
    type character varying(255),
    institution_type character varying(255),
    name character varying(255),
    number character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    master_account_id integer,
    user_id integer,
    available_balance integer,
    current_balance integer,
    credit_limit integer,
    subtype character varying(255)
);

CREATE SEQUENCE accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE accounts_id_seq OWNED BY accounts.id;


CREATE TABLE institutions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    plaid_type character varying(255) NOT NULL,
    logo text,
    light_color character varying(255),
    primary_color character varying(255),
    dark_color character varying(255),
    darker_color character varying(255),
    name_break integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE institutions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE institutions_id_seq OWNED BY institutions.id;


CREATE TABLE master_accounts (
    id integer NOT NULL,
    access_token character varying(255) NOT NULL,
    status enum_master_accounts_status,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer,
    institution_type character varying(255),
    resolve character varying(255)
);

CREATE SEQUENCE master_accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE master_accounts_id_seq OWNED BY master_accounts.id;


CREATE TABLE service_transaction_names (
    id integer NOT NULL,
    transaction_name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer
);

CREATE SEQUENCE service_transaction_names_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE service_transaction_names_id_seq OWNED BY service_transaction_names.id;


CREATE TABLE subscriptions (
    id integer NOT NULL,
    total_amount integer,
    start_date date,
    end_date date,
    custom_name character varying(255),
    transaction_name character varying(255),
    transaction_count integer,
    frequency integer,
    last_transaction_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    service_id integer,
    user_id integer,
    hidden boolean,
    service_type character varying(255)
);


CREATE VIEW missing_services AS
 SELECT subscriptions.transaction_name
   FROM subscriptions
  WHERE (NOT ((subscriptions.transaction_name)::text IN ( SELECT service_transaction_names.transaction_name
           FROM service_transaction_names)));


CREATE TABLE password_reset_tokens (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE password_reset_tokens_id_seq OWNED BY password_reset_tokens.id;


CREATE TABLE plaid_categories (
    id integer NOT NULL,
    plaid_category_id character varying(255),
    toplevel character varying(255),
    category character varying(255),
    subcategory character varying(255),
    service_type character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE plaid_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE plaid_categories_id_seq OWNED BY plaid_categories.id;


CREATE TABLE services (
    id integer NOT NULL,
    name character varying(255),
    type character varying(255),
    logo character varying(255),
    website character varying(255),
    contact_url character varying(255),
    cancel_url character varying(255),
    phone_number character varying(255),
    description character varying(255),
    frequency integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    support_email character varying(255),
    cancel_instructions text
);

CREATE SEQUENCE services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE services_id_seq OWNED BY services.id;


CREATE TABLE sessions (
    sid character varying(255) NOT NULL,
    expires timestamp with time zone,
    data text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


CREATE TABLE subscription_transactions (
    transaction_name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    subscription_id integer NOT NULL,
    transaction_id integer NOT NULL,
    user_id integer
);


CREATE TABLE transactions (
    id integer NOT NULL,
    plaid_id character varying(255) NOT NULL,
    plaid_account character varying(255),
    amount integer,
    date date,
    name character varying(255),
    pending boolean,
    meta jsonb,
    score jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    account_id integer,
    master_account_id integer,
    user_id integer,
    plaid_category_id character varying(255),
    transaction_normalizer_id integer,
    normalized_name character varying(255)
);

CREATE SEQUENCE transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE transactions_id_seq OWNED BY transactions.id;


CREATE TABLE users (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    admin boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE users_id_seq OWNED BY users.id;


CREATE VIEW subscription_report AS
 SELECT users.id,
    users.name,
    ( SELECT count(*) AS count
           FROM subscriptions
          WHERE (subscriptions.user_id = users.id)) AS subscription_count,
    ( SELECT count(*) AS count
           FROM master_accounts
          WHERE (master_accounts.user_id = users.id)) AS account_count,
    ( SELECT count(*) AS count
           FROM transactions
          WHERE (transactions.user_id = users.id)) AS tx_count,
    ( SELECT min(transactions.date) AS count
           FROM transactions
          WHERE (transactions.user_id = users.id)) AS first,
    ( SELECT max(transactions.date) AS count
           FROM transactions
          WHERE (transactions.user_id = users.id)) AS last
   FROM users
  ORDER BY users.name;


CREATE SEQUENCE subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE subscriptions_id_seq OWNED BY subscriptions.id;


CREATE TABLE transaction_normalizers (
    id integer NOT NULL,
    matcher character varying(255),
    normalized_name character varying(255),
    priority integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE SEQUENCE transaction_normalizers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE transaction_normalizers_id_seq OWNED BY transaction_normalizers.id;


ALTER TABLE ONLY accounts ALTER COLUMN id SET DEFAULT nextval('accounts_id_seq'::regclass);

ALTER TABLE ONLY institutions ALTER COLUMN id SET DEFAULT nextval('institutions_id_seq'::regclass);

ALTER TABLE ONLY master_accounts ALTER COLUMN id SET DEFAULT nextval('master_accounts_id_seq'::regclass);

ALTER TABLE ONLY password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('password_reset_tokens_id_seq'::regclass);

ALTER TABLE ONLY plaid_categories ALTER COLUMN id SET DEFAULT nextval('plaid_categories_id_seq'::regclass);

ALTER TABLE ONLY service_transaction_names ALTER COLUMN id SET DEFAULT nextval('service_transaction_names_id_seq'::regclass);

ALTER TABLE ONLY services ALTER COLUMN id SET DEFAULT nextval('services_id_seq'::regclass);

ALTER TABLE ONLY subscriptions ALTER COLUMN id SET DEFAULT nextval('subscriptions_id_seq'::regclass);

ALTER TABLE ONLY transaction_normalizers ALTER COLUMN id SET DEFAULT nextval('transaction_normalizers_id_seq'::regclass);

ALTER TABLE ONLY transactions ALTER COLUMN id SET DEFAULT nextval('transactions_id_seq'::regclass);

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY institutions
    ADD CONSTRAINT institutions_plaid_type_key UNIQUE (plaid_type);

ALTER TABLE ONLY master_accounts
    ADD CONSTRAINT master_accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);

ALTER TABLE ONLY password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);

ALTER TABLE ONLY plaid_categories
    ADD CONSTRAINT plaid_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY service_transaction_names
    ADD CONSTRAINT service_transaction_names_pkey PRIMARY KEY (id);

ALTER TABLE ONLY services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);

ALTER TABLE ONLY subscription_transactions
    ADD CONSTRAINT subscription_transactions_pkey PRIMARY KEY (subscription_id, transaction_id);

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY transaction_normalizers
    ADD CONSTRAINT transaction_normalizers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


CREATE UNIQUE INDEX accounts_plaid_id ON accounts USING btree (plaid_id);

CREATE UNIQUE INDEX master_accounts_access_token ON master_accounts USING btree (access_token);

CREATE UNIQUE INDEX plaid_categories_plaid_category_id ON plaid_categories USING btree (plaid_category_id);

CREATE UNIQUE INDEX service_transaction_names_transaction_name ON service_transaction_names USING btree (transaction_name);

CREATE UNIQUE INDEX subscription_transactions_subscription_id_transaction_id ON subscription_transactions USING btree (subscription_id, transaction_id);

CREATE UNIQUE INDEX subscription_transactions_transaction_id ON subscription_transactions USING btree (transaction_id);

CREATE INDEX subscription_transactions_transaction_name ON subscription_transactions USING btree (transaction_name);

CREATE UNIQUE INDEX subscriptions_user_id_service_id ON subscriptions USING btree (user_id, service_id);

CREATE UNIQUE INDEX subscriptions_user_id_transaction_name ON subscriptions USING btree (user_id, transaction_name);

CREATE UNIQUE INDEX transactions_plaid_id ON transactions USING btree (plaid_id);

CREATE INDEX transactions_transaction_normalizer_id ON transactions USING btree (transaction_normalizer_id);

CREATE INDEX transactions_user_id ON transactions USING btree (user_id);

CREATE UNIQUE INDEX users_email_uniq ON users USING btree (email);


ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_master_account_id_fkey FOREIGN KEY (master_account_id) REFERENCES master_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY master_accounts
    ADD CONSTRAINT master_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY service_transaction_names
    ADD CONSTRAINT service_transaction_names_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY subscription_transactions
    ADD CONSTRAINT subscription_transactions_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY subscription_transactions
    ADD CONSTRAINT subscription_transactions_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY subscription_transactions
    ADD CONSTRAINT subscription_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_last_transaction_id_fkey FOREIGN KEY (last_transaction_id) REFERENCES transactions(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_master_account_id_fkey FOREIGN KEY (master_account_id) REFERENCES master_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_transaction_normalizer_id_fkey FOREIGN KEY (transaction_normalizer_id) REFERENCES transaction_normalizers(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;