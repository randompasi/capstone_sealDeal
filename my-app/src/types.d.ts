import React from "react";

export interface UserInfo {
	name: string
	avatarUrl: string
}

export interface ProfilePageProps {
	user: UserInfo
}

export interface AvatarProps {
	url: string
}

export interface BoxProps {
	children: React.ReactNode | React.ReactNode[]
	className?: string
}
