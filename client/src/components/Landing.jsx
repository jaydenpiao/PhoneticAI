import React from "react";
import { FaPhoneAlt, FaBuilding, FaRobot, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      name: "AI-Powered Agents",
      icon: <FaRobot className="w-5 h-5" />,
    },
    {
      name: "Seamless CRM Integration",
      icon: <FaBuilding className="w-5 h-5" />,
    },
    {
      name: "Reliable Call Handling",
      icon: <FaPhoneAlt className="w-5 h-5" />,
    },
  ];

  return (
    <section>
      <div className="w-screen h-screen mx-auto px-4 py-28 gap-12 text-gray-600 bg-blue-50 md:px-16 xl:flex">
        <div className="space-y-5 lg:mt-28 max-w-2xl mx-auto text-center xl:text-left">
          <div className="flex flex-wrap items-center justify-center gap-6 xl:justify-start">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-2 text-gray-500 text-sm"
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
          <h1 className="text-4xl text-gray-900 font-extrabold mx-auto md:text-5xl">
            Empower Your Business with AI-Driven Phone Agents
          </h1>
          <p className="max-w-xl mx-auto xl:mx-0">
            Transform the way you handle customer interactions. Whether you’re a
            small business or a large enterprise, our AI-powered agents provide
            seamless call handling, CRM integration, and unmatched reliability
            for your users and clients.
          </p>
          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 xl:justify-start">
            <Link
              to="/agents"
              className="flex items-center justify-center gap-x-2 py-2 px-4 text-white font-medium bg-blue-800 duration-150 hover:bg-blue-700 rounded-lg md:inline-flex"
            >
              Browse Agents
              <FaArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        {/* <div className="flex-1 max-w-xl mx-auto mt-14 pb-16 xl:mt-24">
          <div className="relative">
            <img src={HomeImage} className="rounded-lg" alt="" />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Landing;
