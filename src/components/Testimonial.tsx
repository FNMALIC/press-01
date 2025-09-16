"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Pro from "../images/pro.png";
type Props = {
  opps?: boolean;
};

const Testimonial = () => {
  const [width, setWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const TestimonialCard = () => {
    return (
      <div className="bg-gradient-to-r from-[#2A2D9D] to-[#FCC062] p-0.5 rounded-lg max-w-[350px] h-[150px] m-2">
        <div className="bg-white rounded-md p-5 h-full">
          <div className="flex items-center gap-3 lg:mb-2">
            <Image
              src={Pro}
              alt="User Image"
              width={30}
              height={30}
              className="rounded-full"
            />

            <div className="text-xs">
              <p>John Doe</p>
              <p>@john_doe</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    );
  };

  const TestimonialList = ({ opps = false }) => {
    if (!isClient) {
      return <div className="h-[300px] w-full">Loading testimonials...</div>;
    }

    return (
      <div
        className={`flex lg:flex-col lg:w-auto w-[max-content] justify-center items-center ${
          opps
            ? `${width <= 1024 ? "marquees" : "marqueeYs"} `
            : `${width <= 1024 ? "marquee " : "marqueeY"} `
        } `}
      >
        {TestimonialData.map((testimonial) => (
          <TestimonialCard key={testimonial.id} />
        ))}
        {TestimonialData.map((testimonial) => (
          <TestimonialCard key={`duplicate-${testimonial.id}`} />
        ))}
      </div>
    );
  };

  const TestimonialData = [
    {
      id: 1,
      name: "John Doe",
      review: "This service is amazing!",
    },
    {
      id: 2,
      name: "Jane Smith",
      review: "I love using this platform.",
    },
    {
      id: 3,
      name: "Bob Johnson",
      review: "Highly recommend to everyone.",
    },
    // {
    //   id: 4,
    //   name: "Alice Brown",
    //   review: "A fantastic experience overall.",
    // },
    // {
    //   id: 5,
    //   name: "Charlie Davis",
    //   review: "An excellent choice for anyone.",
    // },
  ];

  return (
    <div className="mb-36">
      <h2 className="text-center text-4xl font-semibold">
        We collected <span className="text-[#FCC062]">Reviews</span> from our
        Users
      </h2>

      <p className="text-center font-semibold mb-8 mt-4">
        A 4.8 rating according to trust pilot
      </p>

      <div className="flex lg:flex-row flex-col gap-x-4 p-2 max-w-[1200px] mx-auto h-[500px] overflow-clip relative w-full">
        <TestimonialList />
        <TestimonialList opps />
        <TestimonialList />

        <div className="absolute left-0 top-0 lg:bottom-auto bottom-0 lg:right-0 bg-red-600 z-20 myshad lg:p-3 rounded-b-full"></div>
        <div className="absolute lg:left-0 right-0 bottom-0 lg:top-auto top-0 lg:p-3 rounded-t-full z-20 myshad"></div>
      </div>
    </div>
  );
};

export default Testimonial;
