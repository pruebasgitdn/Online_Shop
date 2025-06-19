import React, { useEffect, useState } from "react";
import { getData } from "../lib";
import { config } from "../../config";
import { CategoryProps } from "../../type";
import useEmblaCarousel from "embla-carousel-react";

const BannerCategory = () => {
  const [categoriesFetch, setCategoriesFetch] = useState<CategoryProps[]>([]);

  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (!embla) return;

    let animationFrame: number;
    const scroll = () => {
      embla.scrollNext();
      animationFrame = requestAnimationFrame(() => setTimeout(scroll, 4000));
    };

    scroll();
    return () => cancelAnimationFrame(animationFrame);
  }, [embla]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `${config.baseUrl}/api/categories/all_categories`;
        const response = await getData(endpoint);
        if (response.status === 200) {
          setCategoriesFetch(response.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="hover:cursor-grab overflow-hidden w-full  rrounded-md shadow-2xs py-2 px-4 mx-auto"
      ref={emblaRef}
    >
      <div className="flex space-x-2 ">
        {categoriesFetch.concat(categoriesFetch).map((item, idx) => (
          <div
            key={idx}
            className="min-w-max px-4 py-2 bg-gray-200 text-sm font-bold
            inline-flex items-center space-x-3 rounded-sm
            "
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={item.image}
              srcSet={item.image}
              alt="category"
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerCategory;
