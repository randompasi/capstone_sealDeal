create schema api;
set search_path=api;

create role api_anon nologin;

grant usage on schema api to api_anon;

alter default privileges
in schema api
grant select, insert, update, delete on tables to api_anon;
