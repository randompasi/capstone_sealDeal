import Box from "../Box";
import {combineClassnames, times} from "../common/utils";
import "./Reviews.css";
import {useResource} from "../utils/hooks";
import {get, matchers, post} from "../api/api";
import {TiStarFullOutline as FullStarIcon, TiStarHalfOutline as HalfStarIcon} from "react-icons/ti";
import {useCallback, useEffect, useState} from "react";
import {useAuth} from "../auth/authContext";
import {groupBy, mapValues, meanBy} from "lodash";
import * as colors from "../common/colors";

const starColors = {
	5: colors.RED,
	4: colors.GREEN,
	3: colors.BLUE,
	2: colors.YELLOW,
	1: colors.GRAY,
};

/**
 * @param {{item: ProfilePage.Review, onReviewGiven?: (rating: number) => any}} props
 */
function Review({item, onReviewGiven}) {
	const [ratingFromHover, setRatingFromHover] = useState(null);

	// This flag is active for a second after the user has given a new review.
	const [justGaveReview, setJustGaveReview] = useState(false);
	useEffect(() => {
		if (justGaveReview) {
			const token = setTimeout(() => {
				setJustGaveReview(false);
			}, 1000);
			return () => {
				clearTimeout(token);
			};
		}
	}, [justGaveReview]);

	const starRating = ratingFromHover || item.rating;
	const starIconsCount = Math.ceil(starRating);
	const color = starColors[starIconsCount];
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
						color,
						// Little glow effect when saving new reviews
						filter: justGaveReview ? `drop-shadow(0 0 5px ${color})` : undefined,
						transition: `all ${value * 50}ms`,
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
		setRatingFromHover(null);
		setJustGaveReview(true);
	};

	return (
		<div
			className="flex flex-col gap-1"
			onMouseOut={canEdit ? mouseOut : undefined}
			// pointerUp works with finger dragging better than onClick
			onPointerUp={canEdit ? onClick : undefined}
		>
			<div className="text-sm font-semibold">{item.title}</div>
			<div className="flex flex-nowrap w-full gap-2">{stars}</div>
		</div>
	);
}

const calculateAverageRatings = (reviews) => {
	return mapValues(
		groupBy(reviews, (_) => _.category),
		(_) => meanBy(_, (_) => _.averageRating)
	);
};

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
		setAddedReviews([
			...addedReviews,
			{category: newReview.category, averageRating: newReview.rating},
		]);
		post("reviews", {
			...newReview,
			toUserId: user.id,
			fromUserId: loggedInUser.id,
		});
	};

	// Combined previously fetched averages and the averages of newly added items
	const allRatings = (reviewsResource.status === "success" ? reviewsResource.value : []).concat(
		Object.entries(calculateAverageRatings(addedReviews)).map(([category, averageRating]) => ({
			category,
			averageRating,
		}))
	);

	const ratings = {
		"Item condition": 3,
		Delivery: 3,
		Friendliness: 3,
		...calculateAverageRatings(allRatings),
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
