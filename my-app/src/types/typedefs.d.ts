import React from "react";

declare global {

declare namespace ProfilePage {
	declare interface UserInfo {
		name: string
		bday: string
		city: string
		avatarUrl: string
		achievements: AcievementProp[]
		reviews: Review[]
	}

	declare interface Review {
		title: string
		rating: number
	}

	declare interface ProfilePageProps {
		user: UserInfo
	}

	declare interface AvatarProps {
		url: string
	}

	declare interface BoxProps {
		children: React.ReactNode | React.ReactNode[]
		title: string
		className?: string
	}

	declare interface AcievementProp {
		text: string
		description: string
		iconType: string
	}
}

declare namespace UtilityTypes {
	declare interface TimesUtilityFunction {
		<T>(n: number, fn: (i: number) => T): T[];
	}

	declare type AsyncResourceState<T> =
		{status: 'loading'}
		| {status: 'error', error: Error}
		| {status: 'success', value: T}

	declare type UseResource = (fn: () => Promise<any>) => AsyncResourceState<any>
}

declare namespace AuthContext {
	declare interface AuthState {
		user: any;
		signin: (firstName: string, lastName: string) => Promise<any>;
		signout: () => Promise<any>;
	}
}

}
