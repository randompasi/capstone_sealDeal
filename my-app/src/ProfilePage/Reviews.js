import Box from "../Box";
import {times} from "../common/utils";
import starSrc from "../assets/star.png";
import "./Reviews.css";

/**
 * @param {{item: ProfilePage.Review}} props
 */
function Review({item}) {
	const ratingIndex = item.rating - 1;
	const stars = times(5, (i) => (
		<div
			className="flex-auto"
			style={{
				/* Can't get the arbitrary width values working in tailwind syntax :( */
				maxWidth: "50px",
			}}
			key={i}
		>
			<img
				src={starSrc}
				alt="Star"
				className={ratingIndex < i ? "opacity-0" : "reviews-star-colorize"}
			/>
		</div>
	));
	return (
		<div className="flex flex-col gap-1">
			<div className="text-sm font-semibold">{item.title}</div>
			<div className="flex flex-nowrap w-full gap-2">{stars}</div>
		</div>
	);
}

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Reviews({user}) {
	return (
		<Box title="Reviews">
			<div className="flex flex-col gap-4">
				{user.reviews.map((review) => (
					<Review item={review} key={review.title} />
				))}
			</div>
		</Box>
	);
}
