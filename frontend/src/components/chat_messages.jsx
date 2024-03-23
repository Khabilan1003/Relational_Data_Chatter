import { useContext } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { UserContext } from "../provider/user_provider";

export const ChatMessages = ({ chats }) => {
  return (
    <div className="flex-1 w-full max-w-screen-lg mx-auto mb-2 overflow-y-scroll">
      <div className="px-4">
        {chats.map((chat) => (
          <>
            <ChatBubble name={"You"} message={chat["question"]} />
            <ChatBubble
              name={"Bot"}
              message={chat["chat_id"] != -1 ? chat["response"] : ""}
            />
          </>
        ))}
      </div>
    </div>
  );
};

const ChatBubble = ({ name, message }) => {
  const { user } = useContext(UserContext);

  const ThreeDotLoader = () => {
    return (
      <div class="flex space-x-2 justify-center items-center">
        <div class="h-4 w-4 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="h-4 w-4 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="h-4 w-4 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex items-start gap-2.5 my-4 ${
          name == "You" && "justify-end"
        }`}
      >
        {/* Bot Icon */}
        {name == "Bot" && <RiRobot2Fill className="h-8 w-8" />}

        {/* Chat message */}
        <div className="flex flex-col w-3/4 leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl ">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-base font-semibold text-gray-900">
              {name}
            </span>
            <span className="text-sm font-normal text-gray-500"></span>
          </div>
          <p className="text-sm font-normal py-2 text-gray-900">
            {message.length == 0 ? <ThreeDotLoader /> : message}
          </p>
        </div>

        {/* User Icon */}
        {name == "You" && (
          <div className="w-10 h-10 bg-gray-100 rounded-full inline-flex items-center justify-center">
            <span className="font-medium text-gray-600 group-hover:text-gray-700">
              {String(user["email"])
                .split("@")[0]
                .toUpperCase()
                .substring(0, 1)}
            </span>
          </div>
        )}
      </div>
    </>
  );
};
