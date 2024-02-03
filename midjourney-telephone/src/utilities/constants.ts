import { AuthState, AuthUser } from "./types";

export const initialAuthState: AuthState = {
  authLoading: false,
  user: null,
  login: async () => "foo",
  logout: async () => {},
};

export const initialUser: AuthUser = {
  email: "",
  guesses: [],
  games: [],
};

export const GAME_NAME_MAX_LEN: number = 30;
export const DESCRIPTION_MAX_LEN: number = 500;
export const DESCRIPTION_MIN_LEN: number = 150;
