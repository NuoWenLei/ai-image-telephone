"use client";

import {
  DESCRIPTION_MAX_LEN,
  DESCRIPTION_MIN_LEN,
  GAME_NAME_MAX_LEN,
} from "@/utilities/constants";
import { Game, GameType } from "@/utilities/types";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import { getFirestoreDoc } from "@/utilities/firebase/firebaseReadFunctions";
import { createNewGame } from "@/utilities/gameFunctions";
import { useRouter } from "next/navigation";

export default function GameCreateClient({
  userEmail,
}: {
  userEmail: string | null;
}) {
  const [gameName, setGameName] = useState<string>("");
  const [gameType, setGameType] = useState<GameType>("Public");
  const [allowReplay, setAllowReplay] = useState<boolean>(false);
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [emailInvites, setEmailInvites] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (userEmail == null) {
      toast.info("Please login first!");
      router.replace("/");
      return;
    }
  }, [userEmail, router]);

  function updateGameName(s: string) {
    setGameName(
      s
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, GAME_NAME_MAX_LEN)
    );
  }

  function updateInitialDescription(s: string) {
    setInitialDescription(s.trimStart().substring(0, DESCRIPTION_MAX_LEN));
  }

  function validateEmail(email: string) {
    return email.includes("@");
  }

  async function onSubmit() {
    setLoading(true);
    // - submission process
    // 		- profanity check game name and id
    const trimmedGameName = gameName.trim();

    if (
      trimmedGameName.length == 0 ||
      trimmedGameName.length > GAME_NAME_MAX_LEN
    ) {
      toast.error(
        `Game name must be between 1 to ${GAME_NAME_MAX_LEN} characters long`
      );
      setLoading(false);
      return;
    }

    const gameInstance = await getFirestoreDoc("Games", trimmedGameName);
    if (gameInstance.exists()) {
      toast.error("Game name already exists");
      setLoading(false);
      return;
    }

    const trimmedInitialDescription = initialDescription.trim();

    const invalidDescription =
      trimmedInitialDescription.length > DESCRIPTION_MAX_LEN ||
      trimmedInitialDescription.length < DESCRIPTION_MIN_LEN;
    if (initialDescription.length > 0 && invalidDescription) {
      toast.error("Description does not fulfill length constraints");
      setLoading(false);
      return;
    }
    let emails = undefined;
    if (gameType == "Private") {
      emails = emailInvites
        .split(",")
        .map((email: string) => email.trim())
        .filter((email: string) => validateEmail(email));
      if (emails.length == 0) {
        toast.error("Must have at least one valid email invite");
        setLoading(false);
        return;
      }
      emails.push(userEmail!);
    }

    const useRandomImage = trimmedInitialDescription.length == 0;

    const res = await createNewGame(
      trimmedGameName,
      userEmail!,
      gameType,
      useRandomImage,
      emails,
      useRandomImage ? undefined : trimmedInitialDescription,
      allowReplay
    );

    if (res == null) {
      toast.error("Error while creating game, please try again later");
      setLoading(false);
      return;
    }

    toast.success("Game created!");
    router.push(`/game/${trimmedGameName}`);
  }

  const classes = ` mx-auto outline-none rounded-lg ring-[8px] ring-white 
  		text-center flex flex-col justify-center hover:bg-white hover:text-black duration-150 `;

  return (
    <main className="flex h-[90vh] w-screen flex-col justify-center pb-4 text-white font-bold text-4xl">
      <div className="mx-auto mb-4">Create New Game</div>
      <div className="w-[40%] h-[70vh] flex flex-col gap-8 mx-auto px-4 py-2 overflow-y-auto">
        <div>
          <input
            type="text"
            placeholder="GAME NAME"
            value={gameName}
            disabled={loading}
            onChange={(e) => updateGameName(e.target.value)}
            className={
              "w-full h-[12vh] rounded-lg text-4xl bg-black rounded-lg ring-[8px] ring-white outline-none px-4"
            }
          />
        </div>
        <div>
          <div className="w-full h-[8vh] flex flex-row gap-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => setGameType("Public")}
              className={
                "w-1/2 h-full " +
                classes +
                (gameType == "Public" ? " bg-white text-black " : "")
              }
            >
              <span className="mx-auto">PUBLIC</span>
            </button>
            <button
              type="button"
              onClick={() => setGameType("Private")}
              disabled={loading}
              className={
                "w-1/2 h-full " +
                classes +
                (gameType == "Private" ? " bg-white text-black " : "")
              }
            >
              <span className="mx-auto">PRIVATE</span>
            </button>
          </div>
        </div>
        <div className={gameType == "Public" ? " hidden " : ""}>
          <textarea
            value={emailInvites}
            disabled={loading}
            onChange={(e) => setEmailInvites(e.target.value)}
            className={
              "w-full h-[24vh] text-sm bg-black ring-[6px] ring-white rounded-lg outline-none resize-none p-2 duration-150 " +
              (gameType == "Public" ? " hidden " : "")
            }
            placeholder="Emails to invite (separate by commas)"
          ></textarea>
        </div>
        <div>
          <div
            className="w-full h-[6vh] flex flex-row cursor-pointer gap-6"
            onClick={() => (loading ? null : setAllowReplay(!allowReplay))}
          >
            <div
              className={`w-[7vh] h-full text-4xl mx-auto outline-none rounded-lg ring-[8px] ring-white 
						text-center flex flex-col justify-center `}
            >
              {allowReplay && (
                <CheckIcon fontSize="inherit" className="mx-auto" />
              )}
            </div>
            <div
              className={
                "outline-none w-full h-full text-center flex flex-col justify-center select-none"
              }
            >
              ALLOW REPLAY
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col w-full bg-black ring-[6px] ring-white rounded-lg outline-none p-2 ">
            <textarea
              value={initialDescription}
              disabled={loading}
              onChange={(e) => updateInitialDescription(e.target.value)}
              className={
                "w-full h-[24vh] text-sm bg-black bg-transparent outline-none resize-none p-2 duration-150 "
              }
              placeholder="(Optional) Initial image description..."
            ></textarea>
            <div className="flex flex-row w-full h-[2vh] text-xs justify-between">
              <p>{`Length must be >${DESCRIPTION_MIN_LEN} and <${DESCRIPTION_MAX_LEN} characters`}</p>
              <p>Num characters: {initialDescription.length}</p>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className={
              "w-full h-[8vh] bg-white text-black rounded-lg ring-[6px] ring-white outline-none"
            }
          >
            CREATE
          </button>
        </div>
      </div>
    </main>
  );
}
