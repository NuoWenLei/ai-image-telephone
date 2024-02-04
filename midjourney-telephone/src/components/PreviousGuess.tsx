"use client";

import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { Dialog, Transition } from "@headlessui/react";
import {
  getAllUserGuesses,
  getImageURL,
  slideshow,
} from "@/utilities/firebase/firebaseReadFunctions";
import { Guess, GuessAndId } from "@/utilities/types";
import { useRouter } from "next/navigation";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

export default function PreviousGuess() {
  const authState = useContext(AuthContext);
  const router = useRouter();
  const [prevGuesses, setPrevGuesses] = useState<GuessAndId[]>([]);
  const [prevImageUrls, setPrevImageUrls] = useState<(string | null)[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [guessSwiper, setGuessSwiper] = useState<string>("");

  function openSwiperModal(guessId: string) {
    setGuessSwiper(guessId);
    setOpenModal(true);
  }

  useEffect(() => {
    if (!authState.user && !authState.authLoading) {
      toast.info("Not logged in, redirecting...");
      router.replace("/");
    }
    (async () => {
      if (!authState.user?.email) {
        return;
      }
      const userGuesses: GuessAndId[] = await getAllUserGuesses(
        authState.user?.email
      );
      setPrevGuesses(userGuesses);
      const urls = await Promise.all(
        userGuesses.map((guess) => getImageURL(guess.guess.imagePath))
      );
      setPrevImageUrls(urls);
    })();
  }, [authState, router]);

  return (
    <div className="w-screen h-screen flex flex-col justify-start py-20 text-white items-center gap-6">
      {prevGuesses.map((gai: GuessAndId, index: number) => (
        <button
          type="button"
          onClick={() => openSwiperModal(gai.id)}
          key={index}
          className="rounded-lg w-3/4 border-white border-2 flex flex-row items-center p-4 gap-4 hover:bg-white hover:text-black duration-300"
        >
          <div className="h-20 w-20 overflow-hidden rounded-lg">
            <img src={prevImageUrls[index] ?? "none"} alt={"Image " + index} />
          </div>
          {gai.guess.description}
        </button>
      ))}
      <SwiperDialog
        guessId={guessSwiper}
        isOpen={openModal}
        setIsOpen={setOpenModal}
      />
    </div>
  );
}

function SwiperDialog({
  guessId,
  isOpen,
  setIsOpen,
}: {
  guessId: string;
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [slideshowResults, setSlideshowResults] = useState<string[]>([]);
  const [slideshowPrompts, setSlideshowPrompts] = useState<string[]>([]);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    setLoading(true);
    (async () => {
      const imageSlideshow = await slideshow(guessId);
      const imageUrlPromises = imageSlideshow[0].map(
        async (imagePath: string) => await getImageURL(imagePath)
      );
      const imagePromptPromises = imageSlideshow[1];
      setSlideshowPrompts(imagePromptPromises);
      const imageUrls = (await Promise.all(imageUrlPromises)).filter(
        (url: string | null) => url
      ) as string[];
      setSlideshowResults(imageUrls);
      setLoading(false);
    })();
  }, [guessId]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-3/4 h-2/3 flex flex-col transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                  {!loading ? (
                    <Swipes
                      prompts={slideshowPrompts}
                      urls={slideshowResults}
                    />
                  ) : (
                    <div className="text-white">Loading...</div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function Swipes({ urls, prompts }: { urls: string[]; prompts: string[] }) {
  const [imageClicked, setImageClicked] = useState<boolean>(false);
  function onClick() {
    setImageClicked(!imageClicked);
  }
  return (
    <div className="w-full flex flex-col justify-center">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={false}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="h-96 w-3/4 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-button-prev]:text-white [&_.swiper-button-next]:text-white"
      >
        {urls.map((item, index) => (
          <SwiperSlide key={item}>
            <div
              className="h-full w-full flex flex-row justify-center item-center rounded-lg overflow-hidden"
              key={index}
            >
              <button
                className="border-white-100 flex flex-col items-center"
                onClick={onClick}
              >
                <p
                  className={
                    "text-white text-xl " + (!imageClicked && "opacity-0")
                  }
                >
                  {prompts[index]}
                </p>
                <img
                  src={item}
                  alt={"Image " + index}
                  className="rounded-lg overflow-hidden hover:opacity-60 hover:brightness-110 transition h-full"
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
