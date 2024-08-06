// backend/src/interfaces/dtos/UserDTO.ts

export interface ProfileDTO {
  name: string;
  // username: string;
  email: string;
  role?: string;
  phone?: string;
  profilePicture?: string;
}

export interface EditProfileDTO {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  // password?: string;
}


export interface UserDTO {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  blocked: boolean;
  profilePicture?: string;
}