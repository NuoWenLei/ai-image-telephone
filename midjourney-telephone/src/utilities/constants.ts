import { AuthState, AuthUser, DiffusionSettings } from "./types";

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
export const DESCRIPTION_MIN_LEN: number = 10;

export const SURVIVAL_DIFFUSION_SETTINGS: DiffusionSettings = {
  model: "stable-diffusion-v1-5",
  negative_prompt: "Disfigured, cartoon, blurry",
  strength: 0.95,
  steps: 6,
};

export const CREATIVE_DIFFUSION_SETTINGS: DiffusionSettings = {
  model: "stable-diffusion-v1-5",
  negative_prompt: "Disfigured, cartoon, blurry",
  strength: 0.99,
  steps: 6,
};

export const F_IT_UP_DIFFUSION_SETTINGS: DiffusionSettings = {
  model: "stable-diffusion-v1-5",
  negative_prompt: "Disfigured, cartoon, blurry",
  strength: 0.99,
  steps: 6,
};
