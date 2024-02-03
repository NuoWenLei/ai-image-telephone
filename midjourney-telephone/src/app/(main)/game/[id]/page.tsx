"use client";

import GameClient from "@/components/GameClient";
import { getGameAndActiveThreads } from "@/utilities/firebase/firebaseReadFunctions";
import { GameAndId, GuessAndId } from "@/utilities/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page({ params }: { params: { id: string } }) {

	const [pageState, setPageState] = useState<"Load" | "Game">("Load");
	const [gameGuessAndId, setGameGuessAndId] = useState<GuessAndId | null>(null);
	const [gameData, setGameData] = useState<GameAndId | null>(null);

	const router = useRouter();

	useEffect(() => {
		if (!params.id) {
			toast.info("Please login first!");
			router.replace("/");
			return;
		}
		(async () => {
			const gameId = params.id;
  
			let game = await getGameAndActiveThreads(gameId);
		
			if (game == null) {
				toast.info("Game not found!");
				router.push("/");
				return;
			}
		
			const gameAndThreads = game!;
		
			const threadIndex = Math.floor(Math.random() * gameAndThreads.threads.length);
		
			const guessStart = gameAndThreads.threads[threadIndex];
		
			const gameAndId: GameAndId = {
			game: gameAndThreads.game,
			id: gameId
			}

			setGameGuessAndId(guessStart);
			setGameData(gameAndId);
			setPageState("Game");
		})()
	}, [params.id])
  
	return <>
		{(pageState == "Load") && <div>Loading...</div>}
		{(pageState == "Game") && <GameClient game={gameData!} prevGuess={gameGuessAndId!} />}
	</>
  }