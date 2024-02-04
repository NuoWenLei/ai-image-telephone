import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { useState } from "react";

export default function swipes(urls: string[], prompts: string[]) {
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
            <div className="flex flex-row justify-center m-12 rounded-lg overflow-hidden">
              <button className="border-white-100" onClick={onClick}>
                {imageClicked ? (
                  <p>{prompts[index]}</p>
                ) : (
                  <img
                    src={item}
                    alt="Image 1"
                    className="rounded-lg overflow-hidden hover:opacity-60 hover:brightness-110 transition"
                  />
                )}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
