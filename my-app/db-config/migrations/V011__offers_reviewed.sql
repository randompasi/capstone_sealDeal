alter table api.offers 
  add column "toReview" boolean not null default false,
  add column "fromReview" boolean not null default false