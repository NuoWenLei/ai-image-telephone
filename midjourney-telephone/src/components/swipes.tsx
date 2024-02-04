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
        className="rounded-lg overflow-hidden h-5/6 w-3/4 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-button-prev]:text-white [&_.swiper-button-next]:text-white"
      >
        {urls.map((item) => (
          <SwiperSlide key={item}>
            <div className="flex flex-row justify-center m-12 rounded-lg overflow-hidden">
              <img
                src={item}
                alt="Image 1"
                className="rounded-lg overflow-hidden"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
