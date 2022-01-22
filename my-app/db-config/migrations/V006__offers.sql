drop table if exists api.offers;

create table api.offers (
  id int generated always as identity primary key,
    "toUserId" int references api.users (id),
    "fromUserId" int references api.users (id),
	"productName" text not null,
	"productPrice" int not null,
	"createdAt" timestamptz not null default now()
);