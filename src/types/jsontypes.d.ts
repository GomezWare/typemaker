export interface ContactAddress3 { street: string; city: string; postalCode: number; }

export interface FriendsContact2 { email: string; phone?: null; address: ContactAddress3; }

export interface FriendsFriends1 { name: string; age: number; contact: FriendsContact2; }

export interface Address0 { city: string; postalCode?: null; }

export interface Demo { name: string; age: number; isActive: boolean; friends: FriendsFriends1[]; address: Address0; }

export interface Demo2 { name: string; age: number; isActive: boolean; friends: FriendsFriends1[]; address: Address0; }

