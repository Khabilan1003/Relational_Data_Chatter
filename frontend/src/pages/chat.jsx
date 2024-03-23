import { useContext, useState, useEffect, useCallback } from "react";
import { CreateNewChat } from "../components/create_new_chat";
import { UserContext } from "../provider/user_provider";
import { Navbar } from "../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenLoader } from "../components/screen_loader";
import axios from "axios";
import { Toast } from "../components/toast";
import { ChatInputField } from "../components/chat_input_field";
import { ChatMessages } from "../components/chat_messages";
import debounce from "debounce";

export const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false); // Used when loading response for the question
  const [toast, setToast] = useState({
    visibility: false,
    message: "",
  });

  const setToastVisiblity = (flag) => {
    setToast((prev) => ({
      ...prev,
      visibility: flag,
    }));
  };

  const { id } = useParams();
  const { loading, isLoggedIn, accessToken } = useContext(UserContext);

  const navigate = useNavigate();
  useEffect(() => {
    setToast({
      visibility: false,
      message: "",
    });
    const loadChatMessages = async () => {
      try {
        if (id == null) return;

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/chat-messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setChatMessages(response.data);
        console.log(response.data);
      } catch (exception) {
        setToast({
          visibility: true,
          message: exception.response.data.detail,
        });
        console.log(`Exception : ${exception.response.data.detail}`);
      }
    };
    loadChatMessages();
  }, [id]);

  const makeResponse = useCallback(
    debounce(async (question) => {
      if (question === "") return;

      setLoadingAnswer(true);
      try {
        // Add question to chatMessages
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { chat_id: -1, question },
        ]);

        // Make API call
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/chat-messages/${id}`,
          { question },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Update chatMessages with response
        setChatMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove last message
          response.data, // Add response
        ]);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data.detail : error.message
        );
      }
      setLoadingAnswer(false);
    }, 300),
    []
  );

  if (loading) return <ScreenLoader />;

  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  return (
    <>
      {toast.visibility && (
        <Toast
          setToastVisiblity={setToastVisiblity}
          message={toast.message}
          success={false}
        />
      )}

      <Navbar>
        {(id == null || toast.message != "") && <CreateNewChat />}
        {id != null && toast.message == "" && (
          <>
            {/* Chat Messages Will be displayed here */}
            <ChatMessages chats={chatMessages} />

            {/* Input Field */}
            <ChatInputField
              disable={false}
              makeResponse={makeResponse}
              loadingAnswer={loadingAnswer}
            />
          </>
        )}
      </Navbar>
    </>
  );
};
