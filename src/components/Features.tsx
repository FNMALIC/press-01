import React from "react";
// orange  FCC062, FBB03B
// blue 2A2D9D, 21237B
type Props = {
  id: number;
  title: string;
  description: string;
  flex?: boolean;
  bgColor?: string;
  Color?: string;
};

const Features = () => {
  const Card = (props: Props) => {
    return (
      <div
        className={`${
          props.flex ? "flex-1" : "lg:flex-[none] flex-1"
        } p-8 pb-16 font-semibold rounded-xl shadow-md w-fit ${
          props.bgColor ? props.bgColor : "bg-[#fdfdfd]"
        } ${props.bgColor === "bg-[#21237B]" && "text-white"} `}
      >
        <h3
          className={`${
            props.Color ? props.Color : "text-[#2A2D9D]"
          } text-3xl mb-3`}
        >
          {props.title}
        </h3>
        <p className="max-w-md text-lg">{props.description}</p>
      </div>
    );
  };

  const Data: Props[] = [
    {
      id: 1,
      title: "Seamless Money Transfers",
      description:
        "Global transfers with reduced fees and faster processing times.",
    },
    {
      id: 2,
      title: "Virtual Card Services",
      description:
        "Free virtual cards for secure online transactions, loaded via mobile money or crypto.",
    },
    {
      id: 3,
      title: "Secure & User-Friendly",
      description:
        "Robust encryption and intuitive interface to protect your funds and data.",
    },
    {
      id: 4,
      title: "Crypto-to-Fiat Exchange",
      description:
        "Convert cryptocurrencies like USDT, BTC, and Ethereum into XAF with real-time rates.",
    },
  ];

  return (
    <div className="py-16">
      <h2 className="text-center text-4xl font-semibold">
          The Ubuntu <span className="text-[#FCC062]">Touch  </span>
      </h2>

      <p className="text-center font-semibold mb-8 mt-4">
          Fun Features That Unite Us
      </p>

      <div className="flex gap-3 md:flex-row flex-col items-center">
        <Card {...Data[0]} flex bgColor="bg-[#21237B]" Color="text-[#FCC062]" />

        <Card {...Data[1]} />
      </div>

      <div className="flex gap-3 mt-3 md:flex-row flex-col-reverse items-center">
        <Card {...Data[2]} Color="text-[#FCC062]" />

        <Card {...Data[3]} flex bgColor="bg-[#FBB03B]" />
      </div>
    </div>
  );
};

export default Features;
