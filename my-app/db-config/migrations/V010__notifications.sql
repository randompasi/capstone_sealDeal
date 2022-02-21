create table api."notifications" (
  id int generated always as identity primary key,
	"userId" integer not null references "users" on delete cascade,
	"title" text not null,
	"type" text not null,
	"data" jsonb null,
	"createdAt" timestamptz not null default now(),
	"seenAt" timestamptz null
);

create index "notifications_userId_createdAt" on "notifications" ("userId", "createdAt");

create table api."congratulations" (
  id int generated always as identity primary key,
  "toUserId" int not null references api.users (id),
  "fromUserId" int not null references api.users (id),
	"createdAt" timestamptz not null default now(),
	"text" text not null,
	"reaction" text not null
);

-- Create notification for accepted offers
create or replace function api.notify_order_accepted() returns trigger as $$
declare
begin
	if (old.status = 'pending' and new.status = 'accepted') then
			insert into api."notifications" ("userId", "title", "type", "data")
			values (
				new."fromUserId",
				'Offer accepted!',
				'offer_accepted',
				jsonb_build_object('offerId', new.id)
			);

			insert into api."notifications" ("userId", "title", "type", "data")
			select
				followers."userId",
				seller."firstName" || ' ' || seller."lastName" || ' sealed a deal!' as "title",
				'made_deal' as "type",
				jsonb_build_object('offerId', new.id, 'sellerId', seller.id) as "data"
			from
				api."following" as followers,
				(select * from api."users" where "id" = new."toUserId") as seller
			where
				followers."userId" != new."fromUserId"
				and followers."followedUserId" = new."toUserId";
		end if;
		return null;
end;
$$ language plpgsql;

create trigger order_accepted_notification after update on api.offers
for each row execute procedure api.notify_order_accepted();


-- Create notification for received congrats from friends
create or replace function api.notify_congratulations() returns trigger as $$
declare
begin
		insert into api."notifications" ("userId", "title", "type", "data")
		values (
			new."toUserId",
			new."text",
			'congrats',
			jsonb_build_object('congratulationsId', new.id, 'reaction', new."reaction")
		);
		return null;
end;
$$ language plpgsql;

create trigger congratulations_notification after insert on api.congratulations
for each row execute procedure api.notify_congratulations();
