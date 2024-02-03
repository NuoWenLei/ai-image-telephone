"use client";

import {
  DESCRIPTION_MAX_LEN,
  DESCRIPTION_MIN_LEN,
} from "@/utilities/constants";
import { generateImage, submitGuess } from "@/utilities/gameFunctions";
import { bs64image } from "@/utilities/imageConst";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Swiper from 'swiper';
import 'swiper/css';

export default function Page() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [inputState, setInputState] = useState<string>("");
//   const [img, setImg] = useState<string | null>(null);

//   async function onGenerate() {
//     setLoading(true);
//     const inputDescription = inputState.trim();
//     if (inputDescription.length == 0) {
//       toast.error("Input cannot be empty");
//       setLoading(false);
//       return;
//     }

//     const validDescription =
//       inputDescription.length >= DESCRIPTION_MIN_LEN &&
//       inputDescription.length <= DESCRIPTION_MAX_LEN;

//     if (!validDescription) {
//       toast.error(
//         `Input length must be <${DESCRIPTION_MIN_LEN} and >${DESCRIPTION_MAX_LEN}`
//       );
//       setLoading(false);
//       return;
//     }

//     const base64Image = await generateImage(inputState, bs64image, 42);

//     if (base64Image) {
//       setImg(base64Image);
//     } else {
//       toast.error("Error with Image Generation");
//     }

//     // if (base64Image) {
//     // const guessSubmissionStatus = await submitGuess(game.id, authState.user!.email, base64Image, inputState, prevGuess);
//     // if (guessSubmissionStatus) {
//     // 	setGuessed(true);
//     // 	setImg(base64Image);
//     // 	toast.success("Your guess has been submitted!");
//     // } else {
//     // 	toast.error("Error with Guess Submission")
//     // }
//     // setLoading(false);
//     // } else {
//     // setLoading(false);
//     // toast.error("Error with Image Generation");
//     // }
//   }
//   return (
//     <div className="flex flex-col h-full justify-center gap-4">
//       <input
//         value={inputState}
//         onChange={(e) => setInputState(e.target.value)}
//         className="bg-black text-white border border-white"
//       />
//       <button
//         type="button"
//         onClick={onGenerate}
//         className="border border-white w-min rounded rounded-lg"
//       >
//         Generate
//       </button>
//       {img ? (
//         <img
//           className="h-96 w-96 xl:h-[30rem] xl:w-[30rem]"
//           src={img}
//           alt="generated image"
//         />
//       ) : (
//         <div>No image, Loading is {loading}</div>
//       )}
//     </div>
//   );

  const imageUrls = [
    'https://thumbs.dreamstime.com/b/handsome-guy-being-bored-talking-stranger-random-staff-yawning-cover-opened-mouth-fist-squinting-tired-standing-fatigue-178777560.jpg',
    'https://c8.alamy.com/comp/P6YB2N/los-angeles-usa-june-29-unidentified-random-people-in-the-streets-of-downtown-of-los-angeles-ca-on-june-29-2018-P6YB2N.jpg'
  ];

  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'vertical',
    loop: true,
    
    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },
    
    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    
    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
  });
  

  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <div className="swiper">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <img src={imageUrls[0]} alt="Image 1" />
          </div>
          <div className="swiper-slide">
            <img src={imageUrls[1]} alt="Image 2" />
          </div>
          {/* <div className="swiper-slide">Slide 3</div> */}
        </div>
        <div className="swiper-pagination"></div>

        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>

        <div className="swiper-scrollbar"></div>
      </div>
    </div>
  );
}
