create schema api;
set search_path=api;

create role api_anon nologin;

grant usage on schema api to api_anon;

alter default privileges
in schema api
grant select, insert, update, delete on tables to api_anon;

create table api.users (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamptz not null default now(),
	first_name text not null,
	last_name text not null
);
