import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../provider/user_provider";

export const ChatItem = ({ chat, setIsMenuOpen, deleteChat }) => {
  //State Variables
  const [isOpen, setIsOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const dropdownRef = useRef(null);
  const { accessToken } = useContext(UserContext);

  //Navigation Hook
  const navigate = useNavigate();

  //Handlers
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // When the Chat
  const chatClickHandler = (id) => {
    if (typeof id == "number") {
      navigate(`/chat/${id}`);
      setIsMenuOpen(false);
    }
  };

  const chatDeleteHandler = async () => {
    setDeleteLoader(true);
    try {
      setIsOpen(false);
      await axios.delete(`${process.env.REACT_APP_API_URL}/chats/${chat.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      deleteChat(chat.id);
    } catch (exception) {
      console.log(exception.response.data.detail);
    }
    setDeleteLoader(false);
  };

  // UseEffect To Handle the click on other area other than the options
  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  });

  return (
    <li
      key={chat.id}
      className={`relative text-gray-900 px-2`}
      onClick={chatClickHandler}
      ref={dropdownRef}
    >
      {/* Chat List Item */}
      <div className="flex items-center rounded-lg hover:bg-gray-100">
        <span
          className="flex-1 ms-3 whitespace-nowrap cursor-pointer  p-2"
          onClick={() => {
            chatClickHandler(chat.id);
          }}
        >
          {chat.title}
        </span>
        {deleteLoader ? (
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          <IoMdMore
            size={20}
            className="hover:bg-gray-500 m-2 hover:text-white rounded-md cursor-pointer"
            onClick={() => toggleOpen()}
          />
        )}
      </div>

      {/* Dropdown for each chat */}
      <div
        id="dropdown"
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-0 right-0 mt-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-40`}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownDefaultButton"
        >
          <li className="flex items-center justify-start space-x-2 hover:bg-gray-100 cursor-pointer">
            <RiPencilFill className="ml-4" />
            <a className="block py-2 ">Rename</a>
          </li>
          <li
            className="flex items-center justify-start space-x-2 hover:bg-red-100 cursor-pointer"
            onClick={chatDeleteHandler}
          >
            <MdDelete className="ml-4 text-red-500" />
            <a className="block py-2 text-red-500">Delete</a>
          </li>
        </ul>
      </div>
    </li>
  );
};
