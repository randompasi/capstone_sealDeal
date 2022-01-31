drop table if exists api.offers;

create type offer_status as enum ('accepted', 'pending', 'rejected');

create table api.offers (
  id int generated always as identity primary key,
  "toUserId" int not null references api.users (id),
  "fromUserId" int not null references api.users (id),
	"productName" text not null,
	"productPrice" integer not null,
  "status" offer_status not null default 'pending',
	"createdAt" timestamptz not null default now()
);