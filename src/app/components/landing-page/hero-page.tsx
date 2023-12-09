import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlexibelAdapt } from "flexibel";
import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../redux/slices/projectSlice";
import { getAPIKeys } from "@/app/utils/getAPIKeys";

const HeroPage = () => {
  const projectId = useSelector(selectProjectId);
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const fetchAPIKeys = async () => {
      const keys = await getAPIKeys(projectId);
      setApiKey(keys[0].decryptedKey);
    };

    if (projectId) {
      fetchAPIKeys();
    }
  }, [projectId]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center space-x-10 pb-52 px-8"
      style={{ background: "linear-gradient(to bottom, #4B5C78, #222831)" }}
    >
      {/*<Image
        src="/flexibel-logo.svg"
        alt="My SVG"
        width={175}
        height={200}
        className="mb-10 ml-10"
      />*/}
      <Image src="/flexibel-text.svg" alt="My SVG" width={900} height={200} />
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-lg text-gray-400">
          Seamlessly integrate AI-powered chatbots to engage with your audience
          and improve customer service.
        </p>
        <div className="flex space-x-10">
          <button className="bg-white font-bold py-4 px-6 rounded">
            Try now for free
          </button>
          <Link
            href="https://docs.flexibel.ai"
            target="_blank"
            className="flex justify-center items-center bg-transparent text-white font-semibold py-2 px-4 border border-[#757575] hover:border-white duration-200 rounded"
          >
            View documentation
          </Link>
        </div>
      </div>
      <div className="mt-20">
        <FlexibelAdapt
          apiKey={apiKey}
          welcomeMessage="Hei, hvordan kan jeg være til hjelp?"
          chatStyle={{
            backgroundColor: "#222831",
            color: "white",
          }}
          inputFieldStyle={{
            backgroundColor: "#222831",
            border: "none",
            color: "white",
          }}
          chatButtonStyle={{
            backgroundColor: "#222831",
            color: "white",
          }}
          askButtonStyle={{
            backgroundColor: "#222831",
            color: "white",
          }}
        />
      </div>
    </div>
  );
};

export default HeroPage;
