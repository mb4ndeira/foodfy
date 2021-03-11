CREATE SCHEMA public;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.chefs (
    id integer NOT NULL,
    name text,
    created_at timestamp without time zone,
    file_id integer
);

CREATE SEQUENCE public.chefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.chefs_id_seq OWNED BY public.chefs.id;

CREATE TABLE public.files (
    id integer NOT NULL,
    name text,
    path text NOT NULL
);

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;

CREATE TABLE public.recipe_files (
    id integer NOT NULL,
    recipe_id integer,
    file_id integer
);

CREATE SEQUENCE public.recipe_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.recipe_files_id_seq OWNED BY public.recipe_files.id;

CREATE TABLE public.recipes (
    id integer NOT NULL,
    chef_id integer,
    user_id integer,
    title text,
    ingredients text,
    preparation text,
    information text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    reset_token text,
    reset_token_expires text,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.chefs ALTER COLUMN id SET DEFAULT nextval('public.chefs_id_seq'::regclass);

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);

ALTER TABLE ONLY public.recipe_files ALTER COLUMN id SET DEFAULT nextval('public.recipe_files_id_seq'::regclass);

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

CREATE TRIGGER trigger_set_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_chef_id_fkey FOREIGN KEY (chef_id) REFERENCES public.chefs(id);

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

