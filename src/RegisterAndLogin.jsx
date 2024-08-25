import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export default function RegisterAndLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("Register");
  const { setUserName: setLoggedInuserName, setId } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "Register" ? "register" : "login";

    try {
      const { data } = await axios.post(url, { userName, password });
      setLoggedInuserName(userName);
      setId(data.id);
    } catch (error) {
      // Handle registration error
      console.error("Registration error:", error);
      // Add logic to display an error message to the user
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex ">
      <form
        className=" bg-white w-full m-7 md:mx-12 lg:mx-20 xl:mx-24  flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col m-4 md:m-6 gap-2 xl:m-10">
          <div className="flex flex-col gap-2 xl:mx-4">
            <label
              htmlFor="your email"
              className="text-green-800 text-sm md:text-lg mt-2 xl:text-xl"
            >
              Your email
            </label>
            <input
              value={userName}
              onChange={(ev) => setUserName(ev.target.value)}
              type="email"
              placeholder="Username"
              className="w-full border-b border-gray-300 focus:outline-none  bg-transparent mb-4 text-sm md:text-lg xl:text-xl pb-1 md:pb-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2 xl:mx-4">
            <label
              htmlFor="password
            "
              className="text-green-800 text-sm md:text-lg xl:text-xl"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              type="password"
              placeholder="password"
              className="w-full border-b border-gray-300 focus:outline-none bg-transparent text-sm md:text-lg mb-10 xl:text-xl pb-1 md:pb-2"
              required
            />
          </div>
        </div>
        <div className="flex flex-col mt-20">
          <button className="bg-emerald-700 rounded-2xl p-3 text-white mx-4 md:mx-10 lg:mx-14 xl:mx-24 text-sm 2xl:mx-36 md:text-lg xl:text-xl">
            {isLoginOrRegister === "Register" ? "Register" : "Log in"}
          </button>
          <div className="text-center mt-2">
            {isLoginOrRegister === "Register" && (
              <div className="flex flex-col items-center gap-2 md:text-lg xl:text-xl">
                Already a member?
                <button
                  className="bg-emerald-700 rounded-lg p-2 text-white text-sm md:text-lg xl:text-xl"
                  onClick={() => setIsLoginOrRegister("Login")}
                >
                  Login here
                </button>
              </div>
            )}
            {isLoginOrRegister === "Login" && (
              <div className="flex flex-col items-center gap-2 md:text-lg xl:text-xl">
                Dont have a account?
                <button
                  className="bg-emerald-700 rounded-lg p-2 text-white text-sm md:text-lg xl:text-xl"
                  onClick={() => setIsLoginOrRegister("Register")}
                >
                  Create here
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
