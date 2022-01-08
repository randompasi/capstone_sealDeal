import React, { ComponentType, ReactNode } from "react";

declare global {

declare namespace ProfilePage {
	declare interface FollowerInfo {
		id: number
		userId: number
		followedUserId: number
	}
	declare interface UserInfo {
		id: number
		name: string
		bday: string
		city: string
		avatarUrl: string
		achievements: AcievementProp[]
		reviews: Review[]
		followers: FollowerInfo[]
		premium: boolean
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

	declare interface SettingsProps {
		setBackgroundImage: Function
		setProfileImage: Function
		gridStateProps: EditableGrid.GridStateProps
		dashboardComponents: EditableGrid.EditableGridProps["components"]
		control: any
		user: any
	}

	declare interface UserProfileInfoProps {
		user: any
		gridStateProps: EditableGrid.GridStateProps
	}

	declare interface GridComponentsModalProps {
		openState: {isOpen: boolean, toggle: ()=> void};
		dashboardComponents: EditableGrid.EditableGridProps["components"];
		gridStateProps: EditableGrid.GridStateProps
	}
	declare interface GridComponentsModalCardProps {
		children: ReactNode;
	}

}

declare namespace UtilityTypes {
	declare interface TimesUtilityFunction {
		<T>(n: number, fn: (i: number) => T): T[];
	}

	declare type IdentityFunction = <T>(value: T) => T

	declare type AsyncResourceState<T> =
		{status: 'loading'}
		| {status: 'error', error: Error}
		| {status: 'success', value: T}

	declare type UseResource = (fn: () => Promise<any>, dependencies?: any[]) => AsyncResourceState<any>
}

declare namespace AuthContext {
	declare interface AuthState {
		user: any;
		signin: (firstName: string, lastName: string) => Promise<any>;
		signout: () => Promise<any>;
	}
}

declare namespace EditableGrid {

	declare type GridIdentifier =
		"BasicInfo"
		| "Achievements"
		| "EnvironmentalSavings"

	declare interface GridRow {
		a: null | GridIdentifier;
		b: null | GridIdentifier;
	}
	declare type GridModel = GridRow[]

	declare interface EditableGridItemProps {
		item: EditableGrid.GridIdentifier;
		gridProps: EditableGridProps;
		dragging: null | string;
		setDragging: (direction: string) => any;
		index: number;
		resize: (border: GridResizeDirection, dragAmount: number, item: GridIdentifier) => any;
	}

	declare type GridResizeDirection = "top" | "right" | "bottom" | "left";

	declare interface GridStateProps {
		gridState: GridModel;
		setGridState: (newState: GridModel) => any;
	}

	declare interface EditableGridProps extends ProfilePage.ProfilePageProps {
		components: Record<GridIdentifier, ComponentType<ProfilePageProps>>;
		gridStateProps: GridStateProps;
	}

}

}
