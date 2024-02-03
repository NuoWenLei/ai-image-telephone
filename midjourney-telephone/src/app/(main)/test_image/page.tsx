"use client";

import {
  DESCRIPTION_MAX_LEN,
  DESCRIPTION_MIN_LEN,
} from "@/utilities/constants";
import { generateImage, submitGuess } from "@/utilities/gameFunctions";
import { bs64image } from "@/utilities/imageConst";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputState, setInputState] = useState<string>("");
  const [img, setImg] = useState<string | null>(null);

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

    const base64Image = await generateImage(inputState, bs64image, 42);

    if (base64Image) {
      setImg(base64Image);
    } else {
      toast.error("Error with Image Generation");
    }

    // if (base64Image) {
    // const guessSubmissionStatus = await submitGuess(game.id, authState.user!.email, base64Image, inputState, prevGuess);
    // if (guessSubmissionStatus) {
    // 	setGuessed(true);
    // 	setImg(base64Image);
    // 	toast.success("Your guess has been submitted!");
    // } else {
    // 	toast.error("Error with Guess Submission")
    // }
    // setLoading(false);
    // } else {
    // setLoading(false);
    // toast.error("Error with Image Generation");
    // }
  }
  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <input
        value={inputState}
        onChange={(e) => setInputState(e.target.value)}
        className="bg-black text-white border border-white"
      />
      <button
        type="button"
        onClick={onGenerate}
        className="border border-white w-min rounded rounded-lg"
      >
        Generate
      </button>
      {img ? (
        <img
          className="h-96 w-96 xl:h-[30rem] xl:w-[30rem]"
          src={img}
          alt="generated image"
        />
      ) : (
        <div>No image, Loading is {loading}</div>
      )}
    </div>
  );
}
