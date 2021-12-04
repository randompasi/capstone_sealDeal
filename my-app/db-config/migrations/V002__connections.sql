
create table api."following" (
	id int generated always as identity primary key,
	"userId" int not null references users,
	"followedUserId" int not null references users,

	unique ("userId", "followedUserId")
);
