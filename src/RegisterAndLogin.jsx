import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { FaUserAlt, FaLock } from "react-icons/fa";

export default function RegisterAndLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("Register");
  const { setUserName: setLoggedInUserName, setId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "Register" ? "register" : "login";

    try {
      const { data } = await axios.post(url, { userName, password });
      setLoggedInUserName(userName);
      setId(data.id);
    } catch (error) {
      console.error("Registration/Login error:", error);
    }
  };

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {isLoginOrRegister === "Register"
            ? "Create an Account"
            : "Login to Your Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center border border-gray-300 rounded-md p-3 bg-gray-100">
              <FaUserAlt className="text-gray-500 mr-3" />
              <input
                value={userName}
                onChange={(ev) => setUserName(ev.target.value)}
                type="text"
                placeholder="Username"
                className="block w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border border-gray-300 rounded-md p-3 bg-gray-100">
              <FaLock className="text-gray-500 mr-3" />
              <input
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                type="password"
                placeholder="Password"
                className="block w-full bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full transition duration-300">
            {isLoginOrRegister === "Register" ? "Register" : "Login"}
          </button>
          <div className="text-center mt-6">
            {isLoginOrRegister === "Register" ? (
              <p className="text-sm">
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => setIsLoginOrRegister("Login")}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p className="text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLoginOrRegister("Register")}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  Create one here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
