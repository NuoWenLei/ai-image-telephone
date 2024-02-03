"use client";

import GameClient from "@/components/GameClient";
import InitGameClient from "@/components/InitGameClient";
import { getGameAndActiveThreads } from "@/utilities/firebase/firebaseReadFunctions";
import { GameAndId, GuessAndId } from "@/utilities/types";
import { useEffect, useState } from "react";

export default function Daily() {

  const [pageState, setPageState] = useState<"Load" | "Init" | "Daily">("Load");
  const [gameGuessAndId, setGameGuessAndId] = useState<GuessAndId | null>(null);
  const [dailyGameAndId, setDailyGameAndId] = useState<GameAndId | null>(null);

  useEffect(() => {
      (async () => {
        const d = new Date();
        const dateString = d.toISOString().split("T")[0];
        const gameId = `daily_${dateString}`;

        let dailyGame = await getGameAndActiveThreads(gameId);

        if (dailyGame == null) {
          setPageState("Init");
          return;
        }

        const gameAndThreads = dailyGame!;

        const threadIndex = Math.floor(Math.random() * gameAndThreads.threads.length);

        const guessStart = gameAndThreads.threads[threadIndex];

        const gameAndId: GameAndId = {
          game: gameAndThreads.game,
          id: gameId
        }

        setGameGuessAndId(guessStart);
        setDailyGameAndId(gameAndId);
        setPageState("Daily");
      })()
  }, [])

  return <>
    {(pageState == "Load") && <div>Loading...</div>}
    {(pageState == "Daily") && <GameClient game={dailyGameAndId!} prevGuess={gameGuessAndId!} />}
    {(pageState == "Init") && <InitGameClient />}
  </>
}
