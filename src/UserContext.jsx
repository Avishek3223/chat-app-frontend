import { createContext, useEffect, useState } from 'react';
import axios from "axios";

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
    const [userName, setUserName] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        axios.get('/profile').then(response => {
            const data = response.data;
            console.log(data.userName)
            setUserName(data.userName);
            setId(data.userId)
        })
    }, [])
    console.log(userName)
    return (
        <UserContext.Provider value={{ userName, setUserName, id, setId }}>
            {children}
        </UserContext.Provider>
    )
}