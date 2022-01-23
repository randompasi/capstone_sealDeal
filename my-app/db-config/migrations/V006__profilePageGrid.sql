create table api."profileGrids" (
  id int generated always as identity primary key,
	"createdAt" timestamptz not null default now(),
	"rows" jsonb
);

alter table api.users add column "profileGridId"
	int null references api."profileGrids" on delete cascade;
