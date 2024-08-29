import { authService } from "../../services/authService";

// backend/src/application/use-cases/authentication/logoutUser.ts


export const logoutUser = (user: any) => {
  authService.removeRefreshToken(user.id);
};
  //not usign 