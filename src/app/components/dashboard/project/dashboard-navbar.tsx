import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { db } from "@/app/firebase/firebaseClient";
import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "../../../../../redux/store";
import {
  addUserListener,
  removeUserListener,
  selectUser,
} from "../../../../../redux/slices/userSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faBook,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/pro-regular-svg-icons";

const DashboardNavbar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const resourceRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<() => void>(null);
  // State to manage the visibility of the account dropdown
  const [isAccountDropdownVisible, setIsAccountDropdownVisible] =
    useState(false);

  // Function to show the dropdown
  const showDropdown = () => setIsAccountDropdownVisible(true);

  // Function to hide the dropdown
  const hideDropdown = () => setIsAccountDropdownVisible(false);

  useEffect(() => {
    if (user) {
      dispatch(addUserListener(db, user.uid, listenerRef));

      // Clean up the listener when the component is unmounted or the user logs out
      return () => {
        dispatch(removeUserListener(listenerRef));
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        resourceRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !resourceRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="sticky top-0 w-full flex items-center justify-between py-3 px-8 bg-[#222831] text-sm text-white"
      style={{
        zIndex: 100,
      }}
    >
      <div className="flex items-center space-x-8">
        <motion.div
          className="flex items-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
        >
          <Link
            href="/"
            className="flex justify-center items-center"
            style={{ marginRight: "30%" }}
          >
            <Image
              src="/flexibel-logo.svg"
              alt="My SVG"
              width={20}
              height={20}
              className="mr-2"
            />
            <Image
              src="/flexibel-text.svg"
              alt="My SVG"
              width={130}
              height={150}
              className="mt-2"
            />
          </Link>
        </motion.div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="py-1 px-2 rounded text-white flex items-center bg-[#222831] hover:bg-[#4B5C78] transition duration-100">
          <Link href="https://docs.flexibel.ai">
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Docs
          </Link>
        </button>
        <button className="py-1 px-2 rounded text-white flex items-center bg-[#222831] hover:bg-[#4B5C78] transition duration-100">
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
          Help
        </button>
        <div
          onMouseEnter={showDropdown}
          onMouseLeave={hideDropdown}
          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white"
        >
          {user?.displayName?.charAt(0)}
        </div>
        {isAccountDropdownVisible && (
          <div
            className="absolute right-0 top-11 w-48 bg-[#222831] border border-[#393E46] rounded-lg shadow-xl"
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
          >
            <Link
              href="/account"
              className="flex space-x-3 p-3 border border-[#393E46] hover:border-[#00ADB5] cursor-pointer rounded-t-lg"
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-600" />
              <div>
                <div className="font-medium">Account</div>
                <div className="text-sm text-gray-600">
                  View plan, usage, invites
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-3 p-3 border border-[#393E46] hover:border-[#00ADB5] cursor-pointer rounded-b-lg">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-600" />
              <div className="font-medium">Logout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;
