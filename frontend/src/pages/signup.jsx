import { useState, useContext } from "react";
import { Toast } from "../components/toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../provider/user_provider";

export const Signup = () => {
  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  if (isLoggedIn) navigate("/chat");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastVisiblity, setToastVisiblity] = useState(false);
  const [isToastSuccess, setIsToastSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (password.length < 8) {
        setIsToastSuccess(false);
        setToastVisiblity(true);
        setErrorMessage("Password size should be greater than 7 character");
      } else if (password !== confirmPassword) {
        setIsToastSuccess(false);
        setToastVisiblity(true);
        setErrorMessage("Password and Confirm Password are not same");
      } else {
        await axios.post("http://localhost:8001/users", {
          email: email,
          password: password,
        });
        setIsToastSuccess(true);
        setToastVisiblity(true);
        setErrorMessage("Account created successfully");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (exception) {
      setIsToastSuccess(false);
      setToastVisiblity(true);
      setErrorMessage(exception.response.data.detail);
    }
    setLoading(false);
  };

  return (
    <>
      {toastVisiblity && (
        <Toast
          setToastVisiblity={setToastVisiblity}
          message={errorMessage}
          success={isToastSuccess}
        />
      )}

      <div class="bg-gray-50">
        <main class="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-10 py-12 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create new account
            </h1>
            <p class="mt-2 text-center text-sm text-gray-600">
              Or
              <Link
                to="/login"
                class="font-medium text-indigo-600 border-b border-indigo-600"
              >
                {" "}
                already have an account{" "}
              </Link>
            </p>
          </div>
          <div class="max-w-md w-full mx-auto bg-white shadow rounded-lg p-7 space-y-6">
            <div class="flex flex-col">
              <label class="text-sm font-bold text-gray-600 mb-1" for="email">
                Email Address
              </label>
              <input
                class="border rounded-md bg-white px-3 py-2"
                type="text"
                name="email"
                id="email"
                placeholder="Enter your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div class="flex flex-col">
              <label
                class="text-sm font-bold text-gray-600 mb-1"
                for="password"
              >
                Password
              </label>
              <input
                class="border rounded-md bg-white px-3 py-2"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div class="flex flex-col">
              <label
                class="text-sm font-bold text-gray-600 mb-1"
                for="confirm_password"
              >
                Confirm Password
              </label>
              <input
                class="border rounded-md bg-white px-3 py-2"
                type="password"
                name="confirm_password"
                id="confirm_password"
                placeholder="Re-enter your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                class="w-full bg-indigo-600 text-white rounded-md p-2 hover:opacity-95 hover:shadow-lg"
                onClick={loading ? null : handleSignup}
              >
                {loading ? (
                  <span>
                    <svg
                      aria-hidden="true"
                      role="status"
                      class="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    loading...
                  </span>
                ) : (
                  <span>Sign up</span>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
