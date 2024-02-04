"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { useState } from "react";

export default function Swipes({
  urls,
  prompts,
}: {
  urls: string[];
  prompts: string[];
}) {
  const [imageClicked, setImageClicked] = useState<boolean>(false);
  function onClick() {
    setImageClicked(!imageClicked);
  }
  return (
    <div className="h-[calc(100vh-5rem)] w-screen flex flex-col justify-center">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="rounded-lg overflow-hidden h-5/6 w-3/4 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-button-prev]:text-white [&_.swiper-button-next]:text-white"
      >
        {urls.map((item, index) => (
          <SwiperSlide key={item}>
            <div className="h-full w-full flex flex-row justify-center item-center rounded-lg overflow-hidden">
              {imageClicked ? (
                <button className="border-white-100" onClick={onClick}>
                  <p className="text-white text-xl">{prompts[index]}</p>
                </button>
              ) : (
                <button className="border-white-100" onClick={onClick}>
                  <img
                    src={item}
                    alt="Image 1"
                    className="rounded-lg overflow-hidden hover:opacity-60 hover:brightness-110 transition"
                  />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
