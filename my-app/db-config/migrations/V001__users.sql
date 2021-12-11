drop table if exists api.users;

-- Notify Postgrest of changed schema every time a table is added
-- https://postgrest.org/en/latest/schema_cache.html#automatic-schema-cache-reloading
create or replace function public.pgrst_watch() returns event_trigger
  language plpgsql
  as $$
begin
  notify pgrst, 'reload schema';
end;
$$;
create event trigger pgrst_watch
  on ddl_command_end
  execute procedure public.pgrst_watch();

create table api.users (
  id int generated always as identity primary key,
	"createdAt" timestamptz not null default now(),
	"firstName" text not null,
	"lastName" text not null,
	"avatarBase64" text null,
	"backgroundBase64" text null,
	"city" text null,
	"birthday" date null,

	unique("firstName", "lastName")
);
