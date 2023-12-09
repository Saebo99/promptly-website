import React from "react";
import Image from "next/image";

const ConnectData = () => {
  return (
    <section className="bg-[#222831] text-white py-20 px-8 h-screen flex items-center justify-around">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold mb-4">Seamless Data Integration</h2>
        <p className="mb-6">
          Connect to any data source effortlessly. Integrate with websites,
          files, FAQs, and even videos to provide comprehensive support through
          our AI chatbot.
        </p>
        <button className="text-white font-bold py-2 px-4 rounded hover:bg-[#4B5C78] duration-100">
          Learn More
        </button>
      </div>
      <div>
        <Image
          src="/data-connection-showcase.png"
          alt="Data Connection Showcase"
          width={500}
          height={200}
        />
      </div>
    </section>
  );
};

export default ConnectData;
