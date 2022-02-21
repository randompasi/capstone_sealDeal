insert into api.offers ("toUserId", "fromUserId", "productName", "productPrice", "status", "createdAt")
values
	(2, 3, 'Muumimuki', 15, 'accepted', '2022-02-01'),
	(2, 3, 'Tuoli', 20, 'accepted', '2022-02-09'),
	(2, 4, 'Kengät', 12, 'accepted', '2022-02-10'),
	(2, 1, 'Televisio', 80, 'accepted', '2022-02-15'),
	(2, 5, 'Polkupyörä', 150, 'accepted', '2022-02-16'),
	(2, 3, 'Jakkara', 20, 'accepted', '2022-02-17'),
	(2, 3, 'Muumimuki', 10, 'accepted', '2022-02-21'),
	(2, 3, 'Lasi, Iittala', 15, 'pending', '2022-02-22');

update api.users
set "premium" = true
where id = 2;

-- View that summarizes a user's recent offer history
create or replace view api."offersStats" as
select
   week,
   "toUserId",
   "status",
   count(*) as "totalOffers",
   sum("productPrice") as "totalPrice"
 from (
   select *, to_char("createdAt", 'YYYY-WW') as week from api.offers
 ) sub
 where week >= to_char(now() - interval '4 weeks', 'YYYY-WW')
 group by "week", "toUserId", "status"
 order by 1, 2, 3;
