"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { generateImage, submitGuess } from "@/utilities/gameFunctions";
import { GameAndId, GuessAndId } from "@/utilities/types";
import {
  getImageURL,
  getUserGuess,
} from "@/utilities/firebase/firebaseReadFunctions";
import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { useRouter } from "next/navigation";
import {
  DESCRIPTION_MAX_LEN,
  DESCRIPTION_MIN_LEN,
} from "@/utilities/constants";

interface GameClientProp {
  game: GameAndId;
  prevGuess: GuessAndId;
}

export default function GameClient({ game, prevGuess }: GameClientProp) {
  const [img, setImg] = useState<string | null>(null);
  const [inputState, setInputState] = useState<string>("");
  const [guessed, setGuessed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authState.user == null) {
      toast.info("Please sign in first!");
      router.replace("/");
    } else {
      const userEmail = authState.user.email;
      (async () => {
        let pathToGet = prevGuess.guess.imagePath;
        if (game.game.users.includes(userEmail)) {
          // User already guessed in this game
          const userGuess = await getUserGuess(game.id, userEmail);
          if (userGuess) {
            pathToGet = userGuess.guess.imagePath;
            setGuessed(true);
          }
        }
        const imageUrl = await getImageURL(pathToGet);
        if (imageUrl) {
          setImg(imageUrl);
        } else {
          toast.error(
            "Error loading previous image, please refresh and try again"
          );
        }
      })();
    }
  }, [authState.user, prevGuess.guess]);

  async function onGenerate() {
    setLoading(true);
    const inputDescription = inputState.trim();
    if (inputDescription.length == 0) {
      toast.error("Input cannot be empty");
      setLoading(false);
      return;
    }

    const validDescription =
      inputDescription.length >= DESCRIPTION_MIN_LEN &&
      inputDescription.length <= DESCRIPTION_MAX_LEN;

    if (!validDescription) {
      toast.error(
        `Input length must be <${DESCRIPTION_MIN_LEN} and >${DESCRIPTION_MAX_LEN}`
      );
      setLoading(false);
      return;
    }

    const base64Image = await generateImage(
      inputState,
      "",
      prevGuess.guess.seed
    );

    if (base64Image) {
      const guessSubmissionStatus = await submitGuess(
        game.id,
        authState.user!.email,
        base64Image,
        inputState,
        prevGuess
      );
      if (guessSubmissionStatus) {
        setGuessed(true);
        setImg(base64Image);
        toast.success("Your guess has been submitted!");
      } else {
        toast.error("Error with Guess Submission");
      }
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Error with Image Generation");
    }
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      )}
      <main className="flex h-full w-full flex-col items-center justify-between pb-4">
        {img ? (
          <img
            className="h-96 w-96 xl:h-[30rem] xl:w-[30rem]"
            src={img}
            alt="generated image"
          />
        ) : (
          <div className="h-96 w-96 text-center flex flex-col justify-center">
            <p>Loading...</p>
          </div>
        )}
        {!guessed || game.game.allowReplay ? (
          <>
            <div className="flex flex-col w-1/2 bg-black ring-[6px] ring-white rounded-lg outline-none p-2 mt-3">
              <textarea
                value={inputState}
                disabled={loading}
                onChange={(e) => setInputState(e.target.value)}
                className={
                  "w-full h-[8vh] text-sm bg-black bg-transparent outline-none resize-none p-2 duration-150 text-white "
                }
                placeholder="Describe this image..."
              ></textarea>
              <div className="flex flex-row w-full h-[2vh] text-xs justify-between">
                <p>{`Length must be >${DESCRIPTION_MIN_LEN} and <${DESCRIPTION_MAX_LEN} characters`}</p>
                <p>Num characters: {inputState.length}</p>
              </div>
            </div>
            <button
              disabled={loading}
              className="py-2 px-4 text-black bg-white rounded-md mt-3 outline-none focus-none"
              onClick={onGenerate}
            >
              Generate
            </button>
          </>
        ) : (
          <div className="h-full text-center text-lg">Your guess</div>
        )}
      </main>
    </>
  );
}
