import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "../components/toast";
import { UserContext } from "../provider/user_provider";
import { ScreenLoader } from "../components/screen_loader";

export const Login = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastVisiblity, setToastVisiblity] = useState(false);
  const navigate = useNavigate();

  const { basicAuth, isLoggedIn, latestErrorMessage, loading } =
    useContext(UserContext);

  const handleLogin = async () => {
    if (email.trim().length == 0 || password.trim().length == 0) return;

    await basicAuth(email, password);

    if (!isLoggedIn) {
      setToastVisiblity(true);
    }
  };

  if (loading) return <ScreenLoader />;

  if (isLoggedIn) navigate("/chat");

  return (
    <>
      {toastVisiblity && (
        <Toast
          setToastVisiblity={setToastVisiblity}
          message={latestErrorMessage}
          success={false}
        />
      )}

      <div class="bg-gray-50">
        <main class="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-10 py-12 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h1>
            <p class="mt-2 text-center text-sm text-gray-600">
              Or
              <Link
                to="/signup"
                class="font-medium text-indigo-600 border-b border-indigo-600"
              >
                {" "}
                register your FREE account{" "}
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
            <div class="flex justify-between text-sm">
              <div class="flex items-center space-x-2">
                <input
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  type="checkbox"
                  name="remember"
                  id="remember"
                />
                <label for="remember">Remember me</label>
              </div>
              <div>
                <a class="text-indigo-600 cursor-pointer">
                  Forgot your Password?
                </a>
              </div>
            </div>
            <div>
              <button
                class="w-full bg-indigo-600 text-white rounded-md p-2 hover:opacity-95 hover:shadow-lg"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
            <div class="relative pb-2">
              <div class="absolute top-0 left-0 w-full border-b"></div>
              <div class="absolute -top-3 left-0 w-full text-center">
                <span class="bg-white px-3 text-sm">or continue via</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 text-xl">
              <div class="border-2 rounded-md p-3 text-center cursor-pointer hover:border-gray-600">
                <i class="fab fa-twitter"></i>
              </div>
              <div class="border-2 rounded-md p-3 text-center cursor-pointer hover:border-gray-600">
                <i class="fab fa-facebook"></i>
              </div>
              <div class="border-2 rounded-md p-3 text-center cursor-pointer hover:border-gray-600">
                <i class="fab fa-linkedin"></i>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
