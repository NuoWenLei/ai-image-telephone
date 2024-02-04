"use client";

import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { useContext, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { onLogin } from "@/utilities/firebase/firebaseFunctions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getFirestoreDoc } from "@/utilities/firebase/firebaseReadFunctions";
import { Game } from "@/utilities/types";

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
        {/* <div className="w-2/3 flex flex-col gap-6">
          <button className={"w-full h-1/3 text-2xl " + classes} disabled={loading} onClick={() => checkLogin("/create")}>
            <span className="mx-auto">CREATE GAME</span>
          </button>
          <div className="w-full h-1/3 flex flex-row gap-6">
            <input type="text" placeholder="JOIN GAME" onChange={(e) => setGameIdInput(e.target.value)}
            className={"w-3/4 h-full rounded-lg text-2xl bg-black rounded-lg ring-[8px] ring-white outline-none px-2"}/>
            <button className={"w-1/4 h-full text-6xl " + classes} disabled={loading} onClick={checkJoin}>
              <ChevronRightIcon fontSize="inherit" className="mx-auto"/>
            </button>
          </div>
          <button className={"w-full h-1/3 text-2xl " + classes} disabled={loading} onClick={() => checkLogin("/games")}>
            <span className="mx-auto">FIND GAMES</span>
          </button>
        </div> */}
      </div>
      <button
        className={"w-1/3 h-1/4 my-14" + classes3}
        onClick={() => checkLogin("/fup")}
        disabled={loading}
      >
        <span className="mx-auto">TRY TO F*CK IT UP</span>
      </button>
    </main>
  );
}
