"use client";

import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { useContext, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { onLogin } from "@/utilities/firebase/firebaseFunctions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getFirestoreDoc } from "@/utilities/firebase/firebaseReadFunctions";
import { Game } from "@/utilities/types";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [gameIdInput, setGameIdInput] = useState<string>("");

  const authState = useContext(AuthContext);
  const router = useRouter();

  const classes1 = ` mx-auto outline-none rounded-lg ring-[8px] ring-white bg-gradient-to-r from-fuchsia-500
  text-center flex flex-col justify-center hover:bg-white hover:text-black duration-150 `;

  const classes2 = ` mx-auto outline-none rounded-lg ring-[8px] ring-white bg-gradient-to-r from-transparent to-indigo-500
  text-center flex flex-col justify-center hover:bg-white hover:text-black duration-150 `;

  const classes3 = ` mx-auto outline-none rounded-lg ring-[8px] ring-white bg-gradient-to-t from-transparent to-amber-500
  text-center flex flex-col justify-center hover:bg-white hover:text-black duration-150 `;

  async function checkJoin() {
    setLoading(true);

    if (gameIdInput.length == 0) {
      toast.info("Game id cannot be empty!");
      setLoading(false);
      return;
    }

    if (authState.user == null) {
      const status = await onLogin(authState);
      if (!status) {
        toast.error("Error during Sign-in");
        setLoading(false);
        return;
      }
    }

    const gameRes = await getFirestoreDoc("Games", gameIdInput);
    if (!gameRes.exists()) {
      toast.info("Game does not exist!");
      setLoading(false);
      return;
    }

    const gameData = gameRes.data() as Game;

    if (gameData.gameType == "Closed") {
      toast.info("Game has been closed!");
      setLoading(false);
      return;
    }

    if (authState.user == null) {
      toast.info("Please login first!");
      setLoading(false);
      return;
    }

    if (gameData.gameType == "Private") {
      const validEntry = gameData.invitedUsers?.includes(authState.user.email);
      if (!validEntry) {
        toast.info("You were not invited into this game!");
        setLoading(false);
        return;
      }
      toast.info("Joining...");
      router.push(`/game/${gameIdInput}`);
      return;
    } else if (gameData.gameType == "Public") {
      toast.info("Joining...");
      router.push(`/game/${gameIdInput}`);
      return;
    }
    toast.error("Unknown error, please try again");
    setLoading(false);
    return;
  }

  async function checkLogin(path: string) {
    setLoading(true);
    if (authState.user == null) {
      const status = await onLogin(authState);
      if (!status) {
        toast.error("Error during Sign-in");
        setLoading(false);
        return;
      }
    }
    router.push(path);
    setLoading(false);
  }

  return (
    <main className="flex h-[90vh] w-screen flex-col justify-center pb-4 text-white font-bold text-4xl">
      <div className="w-1/3 h-1/3 flex flex-row mx-auto gap-14">
        <button
          className={"w-2/3 h-full " + classes2}
          onClick={() => checkLogin("/creative")}
          disabled={loading}
        >
          <span className="mx-auto">CREATIVE</span>
        </button>
        <button
          className={"w-2/3 h-full " + classes1}
          onClick={() => checkLogin("/survival")}
          disabled={loading}
        >
          <span className="mx-auto">SURVIVAL</span>
        </button>
      </div>
      <button
        className={"w-1/3 h-1/4 mt-14 mb-6 " + classes3}
        onClick={() => checkLogin("/f_up")}
        disabled={loading}
      >
        <span className="mx-auto">TRY TO F*CK IT UP</span>
      </button>
      <div className="flex flex-row w-1/3 justify-end mx-auto">
        <button
          type="button"
          onClick={() => checkLogin("/previous")}
          className="text-gray-300 hover:text-white duration-300 text-sm font-light underline underline-offset-2"
        >
          See your previous guesses
        </button>
      </div>
    </main>
  );
}
