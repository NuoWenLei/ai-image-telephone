"use client";

import GameCreateClient from "@/components/GameCreateClient";
import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { AuthState } from "@/utilities/types";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function Create() {
	// TODO
	// - initial check if user is logged in
	// - field must contain
	// 		- game name/id (could use super-profanity profanity checker, allow auto generation) (length < 50 characters)
	// 		- optional initial description (length minimum 150 characters, maximum 500 characters)
	// 		- game type: Public | Private
	// 			- if private, input comma-separated list of emails (check each email contains @)
	// 		- re-play option: allow same user to contribute more than once.
	// - submission process
	// 		- profanity check game name and id
	// 		- ensure game name/id is unique and within constraint
	// 		- description length within constraint
	// 		- if game is private,
	// 			- add user's own email to invited list
	// 			- make sure there is at least one other email
	// 		- add game id into user "games" field

	const authState: AuthState = useContext(AuthContext);

	// const router = useRouter();

	// if (authState.user == null) {
	// 	toast.info("Please login first!");
	// 	router.push("/");
	// 	return;
	// }

	return (
		<GameCreateClient userEmail={((authState.user == null) ? null : authState.user.email)}/>
	)
}