import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "./UserContext";

export default function RegisterAndLogin() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Register')
    const { setUserName: setLoggedInuserName, setId } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLoginOrRegister === "Register" ? "register" : "login"

        try {
            const { data } = await axios.post(url, { userName, password });
            setLoggedInuserName(userName);
            setId(data.id);
        } catch (error) {
            // Handle registration error
            console.error('Registration error:', error);
            // Add logic to display an error message to the user
        }
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input
                    value={userName}
                    onChange={ev => setUserName(ev.target.value)}
                    type="text"
                    placeholder="userName"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <input
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password"
                    placeholder="password"
                    className="block w-full rounded-sm p-2 mb-2 border"
                />
                <button className="bg-blue-500 p-2 text-white block w-full rounded-sm">
                    {isLoginOrRegister === "Register" ? "Register" : "Login"}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === "Register" && (
                        <div>
                            Already a member? <button onClick={() => setIsLoginOrRegister('Login')}>Login here</button>
                        </div>
                    )}
                    {isLoginOrRegister === "Login" && (
                        <div>
                            Dont have a account? <button onClick={() => setIsLoginOrRegister('Register')}>Create here</button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
