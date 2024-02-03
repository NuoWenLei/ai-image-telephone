export type Game = {
	gameName: string;
	gameCreator: string;
	users: string[];
	initialGuess: string;
	allGuesses: string[];
	activeGuessThreads: string[];
	gameType: GameType;
	invitedUsers?: string[];
	allowReplay: boolean;
}

export type GameType = "Public" | "Private" | "Closed";

export type Guess = {
	gameId: string;
	userId: string;
	imagePath: string;
	description: string;
	parentGuess: string;
	childGuesses: string[];
	seed: number;
}

export type GameAndActiveThreads = {
	game: Game;
	threads: GuessAndId[];
}

export type GuessAndId = {
	guess: Guess;
	id: string;
}

export type GameAndId = {
	game: Game;
	id: string;
}

export type AuthUser = {
	email: string;
	guesses: string[];
	games: string[];
}

export interface AuthState {
	authLoading: boolean;
	user: AuthUser | null;
	login: () => Promise<AuthUser | string | boolean>;
	logout: () => Promise<void>
}