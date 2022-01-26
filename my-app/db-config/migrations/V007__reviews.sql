create table api."reviews" (
	"id" int generated always as identity primary key,
	"fromUserId" int not null references "users",
	"toUserId" int not null references "users",
	"category" text not null,
	"rating" smallint not null,
	"createdAt" timestamptz not null default now(),

	constraint reviews_star_rating_value check ("rating" >= 1 and "rating" <= 5),
	constraint reviews_not_for_user_themselves check ("fromUserId" <> "toUserId")
);

create view api."averageRatings" as
	select
		"toUserId" as "userId",
		"category",
		avg("rating")::float as "averageRating"
	from
		api."reviews"
	group by
		"toUserId", "category";
