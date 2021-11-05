import React from "react";

declare global {

declare namespace ProfilePage {
	declare interface UserInfo {
		name: string
		avatarUrl: string
	}

	declare interface ProfilePageProps {
		user: UserInfo
	}

	declare interface AvatarProps {
		url: string
	}

	declare interface BoxProps {
		children: React.ReactNode | React.ReactNode[]
		className?: string
	}
}

}
