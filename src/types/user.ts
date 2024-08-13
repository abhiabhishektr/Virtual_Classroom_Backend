// src/types/user.ts
export interface User {
    id: string ;
    name: string;
    // Add any other properties your user object has
}


export interface adminUsers {
    id: string ;
    blocked: boolean;
    email: string;
    isAdmin: boolean;
    name: string;
    profilePicture: string;
    // Add any other properties your user object has
}