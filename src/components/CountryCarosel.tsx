import React from "react";
import Cam from "../images/Cameroon.png";
import Nig from "../images/Nigeria.png";
import Chi from "../images/China.png";
import Bur from "../images/BurkinaFaso.png";
import Usa from "../images/Usa.png";
import Fra from "../images/France.png";
import Uk from "../images/England.png";
import Gha from "../images/Ghana.png";
import Ivo from "../images/IvoryCoast.png";
import Ben from "../images/Benin.png";
import Image, { StaticImageData } from "next/image";

// orange  FCC062, FBB03B
// blue 2A2D9D, 21237B
type Props = {
  id: number;
  image: StaticImageData;
  text: string;
};

const CountryCarosel = () => {
  const CountryComp = (props: Props) => {
    return (
      <div className="flex items-center gap-x-1">
        <Image
          src={props.image}
          alt="country logo"
          width={25}
          height={25}
          className="object-contain"
        />
        <p>{props.text}</p>
      </div>
    );
  };
  const CountiesData: Props[] = [
    {
      id: 1,
      image: Cam,
      text: "Cameroon",
    },
    {
      id: 2,
      image: Nig,
      text: "Nigeria",
    },
    {
      id: 3,
      image: Chi,
      text: "China",
    },
    {
      id: 4,
      image: Bur,
      text: "Burkina Faso",
    },
    {
      id: 5,
      image: Usa,
      text: "USA",
    },
    {
      id: 6,
      image: Fra,
      text: "France",
    },
    {
      id: 7,
      image: Uk,
      text: "United Kingdom",
    },
    {
      id: 8,
      image: Gha,
      text: "Ghana",
    },
    {
      id: 9,
      image: Ivo,
      text: "Ivory Coast",
    },
    {
      id: 10,
      image: Ben,
      text: "Benin",
    },
  ];
  return (
    <div>
      <p className="text-center text-4xl">
        Transfers possible in <span className="text-[#FCC062]">10+ </span>
        Countries
      </p>

      <div className="overflow-hidden w-full mt-20 relative">
        <div className="absolute top-0 bottom-0 aspect-square z-20 myshad"></div>
        <div className="absolute top-0 bottom-0 right-0 aspect-square z-20 myshad"></div>

        <div className="marquee gap-x-6 text-xs">
          {CountiesData.map((country) => (
            <CountryComp key={country.id} {...country} />
          ))}
          {CountiesData.map((country) => (
            <CountryComp key={country.id} {...country} />
          ))}
          {CountiesData.map((country) => (
            <CountryComp key={country.id} {...country} />
          ))}
          {CountiesData.map((country) => (
            <CountryComp key={country.id} {...country} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryCarosel;
