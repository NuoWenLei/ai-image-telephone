import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

export default function swipes(urls: string[]) {
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
        className="h-5/6 w-3/4 bg-[#b5c2bc] [&_.swiper-pagination-bullet-active]:bg-[#333827] [&_.swiper-button-prev]:text-[#333827] [&_.swiper-button-next]:text-[#333827]"
      >
        {urls.map((item) => (
          <SwiperSlide key={item}>
            <div className="flex flex-row h-full place-items-center px-12">
              <img src={item} alt="Image 1" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
