import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Select from "react-select";

import { useSelector } from "react-redux";
import { selectProjectId } from "../../../../../../redux/slices/projectSlice";

import { db } from "@/app/firebase/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faExternalLinkAlt,
  faChevronLeft,
  faThumbsUp,
  faThumbsDown,
  faPlus,
} from "@fortawesome/pro-solid-svg-icons";
import { faUser } from "@fortawesome/pro-regular-svg-icons";

import { faBookmark as farBookmark } from "@fortawesome/pro-regular-svg-icons";

import { ingestImprovedAnswer } from "@/app/utils/ingestImprovedAnswer";

import Sidebar from "../sidebar";
import DashboardNavbar from "../dashboard-navbar";
import TopBar from "./top-bar";
import LoadingAnimation from "../../loading-animation/loading-animation";

const timeOptions = [
  { value: "Today", label: "Today" },
  { value: "Last Week", label: "Last Week" },
  { value: "Last Month", label: "Last Month" },
  { value: "Last Year", label: "Last Year" },
  { value: "All Time", label: "All Time" },
];

const messageOptions = [
  { value: "All", label: "All" },
  { value: "Unread", label: "Unread" },
  { value: "Saved", label: "Saved" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minWidth: 100,
    backgroundColor: "#222831",
    color: "white",
    borderColor: "#4B5C78", // border
    boxShadow: "none", // Remove box shadow on focus
    "&:hover": {
      borderColor: "#4B5C78", // border on hover
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#2c2c2c",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#444" : "#2c2c2c",
    color: "white",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#4B5C78", // chevron
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "#4B5C78", // separator line, if visible
  }),
};

const Insight = () => {
  const projectId = useSelector(selectProjectId);
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [messageFilter, setMessageFilter] = useState("All messages");
  const [loading, setLoading] = useState<any>(true);
  const [conversations, setConversations] = useState<any>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("");

  const handleSelectMessage = (message: any, index: number) => {
    if (message.role !== "user") {
      setSelectedMessage(message);
      if (message?.improvedAnswer) {
        console.log("selectedMessage.improvedAnswer: ", message.improvedAnswer);
        setAnswer(message.improvedAnswer.answer);
      } else {
        setAnswer("");
      }
      const currentQuestion = selectedConversation.messages[index - 1].content;
      if (message?.improvedAnswer) {
        setQuestion(message.improvedAnswer.question);
      } else {
        setQuestion(currentQuestion);
      }
    }
  };

  const handleCreateImprovedAnswer = async () => {
    try {
      if (question && answer) {
        // Call your utility function
        await ingestImprovedAnswer(
          projectId,
          selectedConversation.id,
          selectedMessage.messageId,
          question,
          answer
        );
        console.log("Improved answer created successfully");
        // Optionally reset the form fields
        setQuestion("");
        setAnswer("");
      } else {
        console.log("Question and answer are required");
      }
    } catch (error) {
      console.error("Failed to create improved answer", error);
    }
  };

  const filterConversationsByMessageFilter = (
    conversations: any,
    messageFilter: any
  ) => {
    console.log("conversations: ", conversations);
    console.log("messageFilter: ", messageFilter);
    return conversations.filter((conversation: any) => {
      switch (messageFilter) {
        case "Unread":
          // If the 'read' field is not present or is false, it is considered unread
          return conversation.read === undefined || conversation.read === false;
        case "Saved":
          // Only include conversations that have 'saved' field set to true
          return conversation.saved === true;
        default:
          // If filter is 'All', no filtering is applied
          return true;
      }
    });
  };

  const filterConversationsByTime = (
    conversations: any,
    timeFilter: string
  ) => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    let filteredConversations: any = [];

    conversations.forEach((conversation: any) => {
      let filteredMessages = conversation.messages.filter((message: any) => {
        let messageDate = new Date(message.timestamp);
        switch (timeFilter) {
          case "Today":
            return messageDate >= startOfDay;
          case "Last Week":
            let oneWeekAgo = new Date(now.getTime() - 7 * oneDay);
            return messageDate >= oneWeekAgo;
          case "Last Month":
            let oneMonthAgo = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return messageDate >= oneMonthAgo;
          case "Last Year":
            let oneYearAgo = new Date(
              now.getFullYear() - 1,
              now.getMonth(),
              now.getDate()
            );
            return messageDate >= oneYearAgo;
          case "All Time":
          default:
            return true; // no filtering needed for 'All Time'
        }
      });

      if (filteredMessages.length > 0) {
        // Instead of pushing just the messages, push the whole conversation object
        // with a new `messages` array that contains only the filtered messages
        filteredConversations.push({
          ...conversation,
          messages: filteredMessages,
        });
      }
    });

    return filteredConversations;
  };

  const fetchConversations = async () => {
    try {
      const conversationsRef = collection(db, "conversations");
      const q = query(conversationsRef, where("projectId", "==", projectId));
      const querySnapshot = await getDocs(q);
      const fetchedConversations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("fetchedConversations: ", fetchedConversations);

      // Rest of the logic needs to work with the new structure of fetchedConversations
      const timeFilteredConversations = filterConversationsByTime(
        fetchedConversations, // Pass only messages to filter by time
        timeFilter
      );
      const messageFilteredConversations = filterConversationsByMessageFilter(
        timeFilteredConversations,
        messageFilter
      );

      setConversations(messageFilteredConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchConversations();
    }
  }, [projectId, timeFilter, messageFilter]);

  const handleMessageFilterChange = (selectedOption: any) => {
    const newMessageFilter = selectedOption?.value || "All";
    setMessageFilter(newMessageFilter);
  };

  // Update your time filter state whenever a new option is selected
  const handleTimeFilterChange = (selectedOption: any) => {
    const newTimeFilter = selectedOption?.value || "All Time";
    setTimeFilter(newTimeFilter);
  };

  // useEffect hook to simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const selectConversation = async (index: number) => {
    const selected = conversations[index];
    setSelectedConversation(selected);
    const conversationRef = doc(db, "conversations", selected.id);

    // Only set read to true if it is currently undefined or false
    if (!selected.read) {
      await updateDoc(conversationRef, {
        read: true,
      }).catch((error: any) => {
        console.error("Error updating document:", error);
      });
    }
  };

  const saveConversation = async () => {
    try {
      const conversationRef = doc(
        db,
        "conversations",
        selectedConversation?.id || ""
      );
      await updateDoc(conversationRef, {
        saved: selectedConversation?.saved ? false : true,
      });

      // Update the saved field in the selected conversation
      setSelectedConversation({
        ...selectedConversation,
        saved: selectedConversation?.saved ? false : true,
      });
      // Update the conversations state
      setConversations(
        conversations.map((conversation: any) => {
          if (conversation.id === selectedConversation?.id) {
            return {
              ...conversation,
              saved: selectedConversation?.saved ? false : true,
            };
          }
          return conversation;
        })
      );
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  // Helper function to check if a string is a valid URL
  const isValidHttpUrl = (string: string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  // Helper function to extract the desired part of the URL and remove after the "." if it exists
  const displayFromUrl = (url: string) => {
    const paths = url.split("/");
    // Check if the second last segment (after the domain) and the last segment is present
    if (paths.length >= 3) {
      const lastSegment = paths[paths.length - 1];
      // Find the index of the last "."
      const lastDotIndex = lastSegment.lastIndexOf(".");
      // If a dot is found, return the path up to the dot. Otherwise, return the whole segment.
      const segmentWithoutExtension =
        lastDotIndex !== -1
          ? lastSegment.substring(0, lastDotIndex)
          : lastSegment;
      return "/" + paths[paths.length - 2] + "/" + segmentWithoutExtension;
    } else {
      // If not enough path segments, return the original URL
      return url;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#222831] flex text-white">
      <Sidebar />
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="flex h-full w-full">
          <div className="w-full">
            <DashboardNavbar />
            <TopBar />
            <div className="flex h-[70vh] mx-10 border border-[#393E46] rounded shadow-lg">
              <div className="w-1/5 h-full flex flex-col border-r border-[#393E46]">
                {/* Dropdown Filters */}
                <div className="w-full h-14 space-x-2 border-b border-[#393E46]">
                  <div className="h-full flex justify-center items-center pl-2 space-x-4">
                    <Select
                      styles={customStyles}
                      options={timeOptions}
                      defaultValue={timeOptions[4]} // Defaults to 'All Time'
                      onChange={handleTimeFilterChange}
                      isSearchable={false}
                    />
                    <Select
                      styles={customStyles}
                      options={messageOptions}
                      defaultValue={messageOptions[0]} // Defaults to 'All messages'
                      onChange={handleMessageFilterChange}
                      isSearchable={false}
                    />
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                  {conversations.map((conversation: any, index: number) => {
                    // Check if messages array exists and has at least one message
                    const firstMessage = conversation?.messages?.[0];

                    return (
                      <div
                        key={conversation.id} // Unique key for each child
                        className={`cursor-pointer p-4 m-2 rounded border border-transparent hover:bg-[#4B5C78] duration-100 ${
                          conversation.id === selectedConversation?.id
                            ? "bg-[#4B5C78] text-white"
                            : "text-gray-400"
                        }`}
                        onClick={() => selectConversation(index)}
                      >
                        <div className="font-bold">
                          {firstMessage ? firstMessage.content : "No messages"}
                        </div>
                        <div className="text-sm">
                          {firstMessage
                            ? new Date(firstMessage.timestamp).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-2/5 h-full flex flex-col">
                <div className="w-full flex justify-between items-center px-2 h-14 text-white border-b border-[#393E46]">
                  <span className="text-sm text-gray-400">
                    Messages: {selectedConversation?.messages?.length}
                  </span>
                  <div
                    onClick={saveConversation}
                    className="cursor-pointer hover:bg-[#4B5C78] duration-100 rounded py-1 px-2 flex items-center"
                  >
                    {selectedConversation?.saved ? (
                      <FontAwesomeIcon icon={faBookmark} className="mr-2" /> // solid bookmark when saved
                    ) : (
                      <FontAwesomeIcon icon={farBookmark} className="mr-2" /> // regular bookmark when not saved
                    )}
                    <span>
                      {selectedConversation?.saved ? "Saved" : "Save"}
                    </span>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  {selectedConversation?.messages?.map(
                    (message: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 flex flex-col justify-start items-start ${
                          message.role === "user"
                            ? ""
                            : "hover:bg-[#4B5C78] cursor-pointer duration-100"
                        } ${
                          message.messageId === selectedMessage?.messageId &&
                          "bg-[#4B5C78]"
                        }`}
                        onClick={() => handleSelectMessage(message, index)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          {/* Apply flex-shrink-0 here */}
                          {message.role === "user" ? (
                            <FontAwesomeIcon
                              icon={faUser}
                              className="w-5 h-5" // Ensuring the icon size is fixed
                            />
                          ) : (
                            <Image
                              src="/flexibel-robot.svg"
                              alt="My SVG"
                              width={30}
                              height={35}
                              className="mb-2"
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          {message.content}
                          {message.role === "response" && (
                            <>
                              {message.likeStatus && (
                                <>
                                  <hr className="my-2 border-none" />
                                  {message.likeStatus === "like" ? (
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                  ) : (
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              {selectedMessage ? (
                <div className="w-2/5 h-full flex flex-col border-l border-[#393E46]">
                  <div className="h-14 flex items-center border-b border-[#393E46]">
                    <span className="ml-2 text-gray-400">Sources</span>
                  </div>
                  <div className="flex-grow overflow-y-auto mx-2">
                    {/* Display sources of the selected message */}
                    {selectedMessage?.sources?.map(
                      (source: any, sourceIndex: number) => (
                        <div
                          key={sourceIndex}
                          onClick={() => {
                            if (source === selectedSource) {
                              setSelectedSource("");
                            } else {
                              setSelectedSource(source);
                            }
                          }}
                          className={`cursor-pointer p-2 flex items-center justify-between text-gray-400 hover:bg-[#4B5C78] ${
                            selectedSource === source &&
                            "bg-[#4B5C78] text-white"
                          }`}
                        >
                          <a
                            onClick={(e) => e.stopPropagation()}
                            href={isValidHttpUrl(source) ? source : null}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit flex items-center"
                          >
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              size="sm"
                              className="mr-2"
                            />
                            <div>{displayFromUrl(source)}</div>
                          </a>
                          <FontAwesomeIcon
                            icon={faChevronLeft}
                            className={`mx-2 duration-100 ${
                              selectedSource === source && "-rotate-90"
                            }`}
                          />
                        </div>
                      )
                    )}
                    <div className="mt-20 mx-2">
                      <div className="space-y-1 text-gray-400 flex flex-col">
                        <span>
                          {selectedMessage?.improvedAnswer
                            ? "Update the improved answer"
                            : "Create an improved Answer"}
                        </span>
                        <span className="text-sm">
                          The chatbot will use it to better answer similar
                          questions in the future
                        </span>
                      </div>
                      <div className="flex flex-col mt-8">
                        <span className="text-gray-400">Question</span>
                      </div>
                      <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="outline-none text-sm w-full mt-1 p-2 bg-[#222831] border border-[#393E46] focus:border-[#4B5C78] rounded"
                        placeholder="Type question here..."
                      />
                    </div>
                    <div className="mt-4 mx-2">
                      <div className="flex flex-col">
                        <span className="text-gray-400">Improved answer</span>
                        <span className="text-xs text-gray-400">
                          This will improve answers to similar questions in the
                          future
                        </span>
                      </div>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="outline-none text-sm w-full h-28 mt-1 p-2 bg-[#222831] border border-[#393E46] focus:border-[#4B5C78] rounded"
                        placeholder="Type the improved answer here..."
                      />
                    </div>
                    <button
                      onClick={handleCreateImprovedAnswer}
                      className="w-fit px-2 py-1 text-sm rounded hover:bg-[#4B5C78] text-gray-400 hover:text-white duration-100"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      {selectedMessage?.improvedAnswer
                        ? "Update improved answer"
                        : "Create improved Answer"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-2/5 h-full border-l border-[#393E46] flex justify-center items-center">
                  Select a message to view sources
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insight;
