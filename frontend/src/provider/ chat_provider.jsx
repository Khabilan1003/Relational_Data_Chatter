import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./user_provider";

export const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  //State Variables
  const [chatLoading, setChatLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [latestErrorMessage, setLatestErrorMessage] = useState(""); // Will contain the latest error message happened here

  //Access Token
  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    const loadChats = async () => {
      setChatLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/chats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setChats(response.data);
      } catch (exception) {
        setLatestErrorMessage(exception.response.data.detail);
      }
      setChatLoading(false);
    };

    loadChats();
  }, []);

  const addChat = (chat) => {
    setChats((chats) => ({ chat, ...chats }));
  };

  const deleteChat = (chat_id) => {
    setChats((chats) => chats.filter((chat) => chat.id != chat_id));
  };

  // Combine the state values and the methods inside a map
  const contextValue = {
    chatLoading,
    chats,
    latestErrorMessage,
    addChat,
    deleteChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
