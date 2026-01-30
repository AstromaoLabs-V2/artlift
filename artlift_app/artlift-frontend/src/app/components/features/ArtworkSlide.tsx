"use client";

import { useState, useEffect, useRef } from "react";
import Splide, { Splide as SplideInstance, Options } from "@splidejs/splide";
import "@splidejs/splide/css";
import "../ui/slide.css";

const images = [
  "/img/couple-artwork.jpg",
  "/img/star-artwork.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
  "/img/search.png",
];

export function ArtworkSlide() {
  const [activeGroup, setActiveGroup] = useState<number>(0);
  const slideGroup = Math.ceil(images.length / 3);
  const mainSliderRef = useRef<SplideInstance | null>(null);
  const ThumbsSliderRef = useRef<SplideInstance | null>(null);

  useEffect(() => {
    const mainOptions: Options = {
      type: "fade",
      pagination: false,
      arrows: true,
      cover: true,
      perPage: 1,
      rewind: false,
    };

    const thumbsOptions: Options = {
      rewind: false,
      fixedWidth: 104,
      fixedHeight: 58,
      isNavigation: true,
      gap: 10,
      focus: "center",
      pagination: false,
      cover: true,
      dragMinThreshold: {
        mouse: 4,
        touch: 10,
      },
      breakpoints: {
        640: {
          fixedWidth: 66,
          fixedHeight: 38,
        },
      },
    };

    const mainSlider = new Splide("#main-slider", mainOptions);
    const thumbs = new Splide("#thumbnail-slider", thumbsOptions);

    mainSliderRef.current = mainSlider;
    ThumbsSliderRef.current = thumbs;

    mainSlider.sync(thumbs);
    //if picture moves
    const handleMove = (_: unknown, newIndex: number) => {
      const currentGroup = Math.floor(newIndex / 3);
      setActiveGroup(currentGroup);
    };

    //if main slider move, works function
    mainSlider.on("move", handleMove);
    mainSlider.mount();
    thumbs.mount();

    //initial setting
    handleMove(null, mainSlider.index);

    //destroy main slider. Initial setting
    return () => {
      mainSlider.destroy();
      thumbs.destroy();
    };
  }, []);

  // click dot and jump
  /*
    const handleIndicatorClick = (groupIndex: number) => {
    const targetIndex = groupIndex * 3;
    const main = mainSliderRef.current;
    if (main) {
      main.go(targetIndex);
    }

  };

  */

  return (
    <div className="max-w-3xl mx-auto">
      {/* --- main sliderー --- */}
      <div id="main-slider" className="splide m-4">
        <div className="splide__track">
          <ul className="splide__list">
            {images.map((src, index) => (
              <li key={index} className="splide__slide">
                <img
                  src={src}
                  alt={`slide-${index}`}
                  className="artwork-main-slider rounded-lg"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- dot indicatorー --- */}
      <div className="flex justify-center gap-3 mb-4">
        {Array.from({ length: slideGroup }).map((_, index) => (
          <button
            key={index}
            aria-label={`Group ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeGroup ? "bg-purple-500 scale-125" : "bg-gray-300"
            }`}
            /*onClick={() => handleIndicatorClick(i)}*/
          />
        ))}
      </div>

      {/* --- thumbnail sliderー --- */}
      <div id="thumbnail-slider" className="splide">
        <div className="splide__track">
          <ul className="splide__list">
            {images.map((src, index) => (
              <li key={index} className="splide__slide cursor-pointer">
                <img
                  src={src}
                  alt={`thumb-${index}`}
                  className="object-cover rounded-md w-[104px] h-[58px]"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}