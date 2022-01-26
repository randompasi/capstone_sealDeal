import Box from "../Box";
import {combineClassnames, times} from "../common/utils";
import "./Reviews.css";
import {useResource} from "../utils/hooks";
import {get, matchers, post} from "../api/api";
import {TiStarFullOutline as FullStarIcon, TiStarHalfOutline as HalfStarIcon} from "react-icons/ti";
import {useCallback, useState} from "react";
import {useAuth} from "../auth/authContext";
import {groupBy, mapValues, meanBy} from "lodash";

const starColors = {
	5: "#FE9996", // red
	4: "#96fea4", // green
	3: "#96cffe", // blue
	2: "#feeb96", // yellow
	1: "#c5c5c5", // gray
};

/**
 * @param {{item: ProfilePage.Review, onReviewGiven?: (rating: number) => any}} props
 */
function Review({item, onReviewGiven}) {
	const [ratingFromHover, setRatingFromHover] = useState(null);
	const starRating = ratingFromHover || item.rating;
	const starIconsCount = Math.ceil(starRating);
	const canEdit = !!onReviewGiven;
	const isHoveringSomeStar = !!ratingFromHover;

	const stars = times(5, (i) => {
		const value = i + 1;
		const isHalfStar = value > starRating && starIconsCount - starRating > 0.5;
		const isOver = value > starIconsCount;
		const StarIcon = isHalfStar ? HalfStarIcon : FullStarIcon;
		const extraStarClassName = isOver && (isHoveringSomeStar ? "opacity-10" : "opacity-0");

		const onHover = useCallback(() => setRatingFromHover(value), [value, setRatingFromHover]);

		return (
			<div style={{marginLeft: -10}} onMouseOver={canEdit ? onHover : undefined} key={i}>
				<i
					style={{
						color: starColors[value],
						transition: `opacity ${value * 50}ms`,
					}}
					className={combineClassnames(extraStarClassName, canEdit && "cursor-pointer")}
				>
					<StarIcon fontSize={70} />
				</i>
			</div>
		);
	});

	const mouseOut = useCallback(() => setRatingFromHover(null), [setRatingFromHover]);
	const onClick = () => {
		if (ratingFromHover && onReviewGiven) {
			onReviewGiven(ratingFromHover);
		}
	};

	return (
		<div
			className="flex flex-col gap-1"
			onMouseOut={canEdit ? mouseOut : undefined}
			onClick={canEdit ? onClick : undefined}
		>
			<div className="text-sm font-semibold">{item.title}</div>
			<div className="flex flex-nowrap w-full gap-2">{stars}</div>
		</div>
	);
}

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Reviews({user}) {
	const reviewsResource = useResource(async () => {
		const averages = await get("averageRatings", {
			userId: matchers.eq(user.id),
		});
		return averages;
	});
	const [addedReviews, setAddedReviews] = useState([]);
	const loggedInUser = useAuth().user;

	const addReview = (newReview) => {
		setAddedReviews([...addedReviews, newReview]);
		post("reviews", {
			...newReview,
			toUserId: user.id,
			fromUserId: loggedInUser.id,
		});
	};
	const allRatings = (reviewsResource.status === "success" ? reviewsResource.value : []).concat(
		addedReviews.map((_) => ({category: _.category, averageRating: _.rating}))
	);

	const grouped = mapValues(
		groupBy(allRatings, (_) => _.category),
		(_) => meanBy(_, (_) => _.averageRating)
	);
	const ratings = {
		"Item condition": 1,
		Delivery: 1,
		Friendliness: 1,
		...grouped,
	};
	const canGiveReview = !!loggedInUser && loggedInUser.id !== user.id;

	return (
		<Box title="Reviews">
			<div className="flex flex-col gap-4">
				{Object.entries(ratings).map(([title, rating]) => (
					<Review
						item={{title, rating}}
						key={title}
						onReviewGiven={
							canGiveReview ? (rating) => addReview({rating, category: title}) : undefined
						}
					/>
				))}
			</div>
		</Box>
	);
}
