"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { createNewDailyGame } from '@/utilities/gameFunctions';

import { useRouter } from 'next/navigation';

export default function InitGameClient() {
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();

	async function generateNewDailyGame() {
		setLoading(true);
		const newGameRes = await createNewDailyGame();
		if (newGameRes == null) {
			toast.error("Game not created!");
		} else {
			toast.success("Game created!");
		}
		router.refresh();
	}

  return (
    <>
    <main className="flex h-full w-full flex-col items-center justify-between pb-4">
      <button
      disabled={loading}
      className="py-2 px-4 text-black bg-white rounded-md mt-3 outline-none focus-none" onClick={generateNewDailyGame}>
		Initiate Daily Game
		</button>
    </main>
    </>
  )
}
