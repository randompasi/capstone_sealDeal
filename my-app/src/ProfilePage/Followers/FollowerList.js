import Modal from "react-modal";
import {useAuth} from "../../auth/authContext";
import {useResource, useToggle} from "../../utils/hooks";
import * as api from "../../api/api";
import {useState} from "react";
import {head} from "lodash";
import Avatar from "../Avatar";
import {defaultAvatarImage} from "../helpers";

function FollowersList({user: {id}}) {
	const followersFullInfo = useResource(async () => {
		const following = await api.get("following", {
			followedUserId: api.matchers.eq(id),
			select: "user:users!userId(id,firstName,lastName,avatarBase64)",
		});
		return following.map((_) => _.user);
	});
	if (followersFullInfo.status !== "success") {
		return null;
	}
	if (!followersFullInfo.value.length) {
		return <span>No followers yet</span>;
	}
	return (
		<ul className="w-8/12 p-5">
			{followersFullInfo.value.map((follower) => (
				<li key={follower.id} className="flex justify-center">
					<Avatar url={follower.avatarBase64 ?? defaultAvatarImage} />
					<div className="text-xl align-middle flex-none">
						{follower.firstName} {follower.lastName}
					</div>
				</li>
			))}
		</ul>
	);
}

/**
 * @param {{user: ProfilePage.UserInfo, toggleState: any}} props
 */
function FollowersListDialog({user, toggleState}) {
	return (
		<Modal ariaHideApp={false} onRequestClose={toggleState.toggle} isOpen={toggleState.isOpen}>
			{toggleState.isOpen && <FollowersList user={user} />}
		</Modal>
	);
}

/**
 * @param {{user: ProfilePage.UserInfo, onFollow: Function, onUnfollow: Function}} props
 */
function FollowButton({user, onFollow, onUnfollow}) {
	const {user: loggedInUser} = useAuth();
	const loggedInUserId = loggedInUser?.id;
	const isViewingOwnProfile = user.id === loggedInUserId;

	// If the logged in user is already following this user, this will be that "following" entity.
	// If not, it's undefined.
	const [currentFollowing, setFollowingState] = useState(
		isViewingOwnProfile
			? undefined
			: user.followers.find((follower) => follower.userId === loggedInUserId)
	);

	// We are viewing our own page, don't show follow-buttons
	if (isViewingOwnProfile) {
		return null;
	}

	if (currentFollowing) {
		const unfollow = async () => {
			await api.remove("following", currentFollowing.id);
			setFollowingState(undefined);
			onUnfollow();
		};
		return (
			<a
				href="#"
				className="cursor-pointer text-sm flex flex-nowrap items-center"
				onClick={unfollow}
			>
				<span className="ml-1">Unfollow</span>
			</a>
		);
	} else {
		const follow = async () => {
			const newFollowing = await api
				.post("following", {
					userId: loggedInUser.id,
					followedUserId: user.id,
				})
				.then(head);
			setFollowingState(newFollowing);
			onFollow();
		};
		return (
			<a href="#" className="cursor-pointer text-sm flex flex-nowrap items-center" onClick={follow}>
				<span className="ml-1">Follow</span>
			</a>
		);
	}
}

/**
 * @param {{user: ProfilePage.UserInfo}} props
 */
export default function FollowerList({user}) {
	const toggleState = useToggle();
	const [addToCounter, setAddToCounter] = useState(0);

	return (
		<div className="h-100 mt-3 flex w-full justify-around items-center">
			<span onClick={toggleState.toggle} className="cursor-pointer">
				{(user.followers?.length || 0) + addToCounter} followers
			</span>
			<FollowButton
				user={user}
				onFollow={() => setAddToCounter(addToCounter + 1)}
				onUnfollow={() => setAddToCounter(addToCounter - 1)}
			/>
			<FollowersListDialog user={user} toggleState={toggleState} />
		</div>
	);
}
