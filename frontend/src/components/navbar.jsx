import { useState, useEffect, useContext } from "react";
import { UserContext } from "../provider/user_provider";
import { ProfileDropdown } from "./profile_dropdown";
import { Toast } from "./toast";
import { ChatItem } from "./chat_item";
import { IoIosCreate } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const SideMenu = ({ isMenuOpen, setIsMenuOpen, setToast }) => {
  const { accessToken } = useContext(UserContext);
  const navigate = useNavigate();

  // Chat State and Loading Chat History
  const [chats, setChats] = useState([]);

  useEffect(() => {
    try {
      const loadChats = async () => {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/chats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setChats(result.data);
      };
      loadChats();
    } catch (exception) {
      setToast({
        visibility: true,
        isSuccess: false,
        errorMessage: exception.response.data.detail,
      });
    }
  }, []);

  function deleteChat(id) {
    setChats((chats) => chats.filter((chat) => chat.id != id));
  }

  return (
    <div className="sticky top-0 left-0 z-50">
      <div
        className={`${
          !isMenuOpen ? "-translate-x-full" : ""
        } fixed top-0 left-0 z-40 h-screen transition-transform bg-white w-72 md:translate-x-0 md:static border-2 border-gray-200`}
      >
        <div className="h-full overflow-y-scroll">
          {/* Create New Chat Button */}
          <div className="w-full ">
            <div
              className=" text-gray-900 px-2 flex items-center rounded-lg hover:bg-gray-100 my-3 ms-2 mb-2 cursor-pointer "
              onClick={() => navigate("/chat")}
            >
              <span className="flex-1 ms-1 text-lg whitespace-nowrap p-2 font-bold">
                New Chat
              </span>
              <IoIosCreate size={20} className="h-5 w-5 m-2" />
            </div>
          </div>

          <ul className="space-y-2 mt-4 font-medium">
            {/* Top Banners */}
            {chats.map((chat) => (
              <ChatItem
                chat={chat}
                setIsMenuOpen={setIsMenuOpen}
                deleteChat={deleteChat}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`${
          isMenuOpen
            ? "fixed z-30 left-0 top-0 bg-gray-400 h-screen w-screen bg-opacity-20"
            : ""
        } md:hidden`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
    </div>
  );
};

export const Navbar = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Error Toast State Management
  const [toast, setToast] = useState({
    visibility: false,
    isSuccess: false,
    errorMessage: "",
  });

  const setToastVisiblity = (visibility) => {
    setToast((prevState) => ({
      ...prevState,
      visibility: visibility,
    }));
  };

  return (
    <>
      {toast.visibility && (
        <Toast
          setToastVisiblity={setToastVisiblity}
          success={toast.isSuccess}
          message={toast.errorMessage}
        />
      )}

      <div className="h-screen flex items-start justify-start">
        {/* Drawer Code */}
        <SideMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setToast={setToast}
        />

        <div className="flex sticky h-full w-full items-start justify-start flex-col">
          {/* Navigation Bar Code */}
          <nav className="bg-white w-full border-b-2 border-gray-200 shadow">
            <div className="flex flex-wrap items-center justify-between md:justify-end mx-auto p-4">
              {/* Menu Button */}
              <button
                className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={() => setIsMenuOpen(true)}
              >
                <GiHamburgerMenu className="h-5 w-5" />
              </button>

              <ProfileDropdown />
            </div>
          </nav>

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
};
