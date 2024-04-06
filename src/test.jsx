import { useRef, useEffect, useContext, useState } from "react";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";
import { uniqBy } from 'lodash';
import axios from "axios";

export default function Chat() {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedPerson, setSelectedPerson] = useState(null);
    const { userName, id } = useContext(UserContext)
    const [newMessageText, setNewMessageText] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const connectToWs = () => {
        const ws = new WebSocket('ws://chat-app-backend-mlbxcre6k-avishek3223s-projects.vercel.app');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => connectToWs());
    };

    useEffect(() => {
        connectToWs();
    }, []);

    const showOnlinePeople = (peopleArray) => {
        const people = {};
        peopleArray.forEach(({ userId, userName }) => {
            people[userId] = userName;
        });
        setOnlinePeople(people);
    };

    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        } else if ('text' in messageData) {
            console.log(messageData)
            setReceivedMessages(prevMessages => [...prevMessages, messageData]);
        }
    }

    const handleMsgSend = (e) => {
        e.preventDefault();
    
        const messageToSend = {
            recipient: selectedPerson,
            text: newMessageText
        };
    
        ws.send(JSON.stringify(messageToSend), () => {
            const newMessage = {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),
            };
    
            setNewMessageText('');
            setReceivedMessages(prevMessages => ([...prevMessages, newMessage]));
        });
    };

    // Scroll to bottom of the message container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [receivedMessages]);

    useEffect(() => {
        axios.get('/messages/' + selectedPerson).then(res => {
            setReceivedMessages(res.data)
        })
    }, [selectedPerson])

    const excludingOurId = { ...onlinePeople };
    delete excludingOurId[id];
    const messagesWithoutDup = uniqBy(receivedMessages, '_id')


    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4">
                    <div className="font-bold text-[#236862] flex gap-2 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                        </svg>
                        MernChat
                    </div>
                    {Object.keys(excludingOurId).map(userId => (
                        <div
                            onClick={() => setSelectedPerson(userId)}
                            className={"border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer" + (selectedPerson === userId ? " bg-[#e9fffd]" : "")} key={userId}>
                            <Avatar userName={onlinePeople[userId]} userId={userId} />
                            <span className="text-gray-800 font-[500]">{onlinePeople[userId]}</span>
                        </div>
                    ))}
                </div>
                {selectedPerson ? (
                    <div className=" bg-[#e9fffd] w-3/4 p-2 flex flex-col overflow-y-auto hide-scrollbar pb-[2rem]" style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
                        <div className="flex-grow">
                            {messagesWithoutDup.map((message, index) => (
                                <div key={index} className="flex justify-start mb-2">
                                    <span
                                        className={
                                            "text-black p-[6px] mb-3 px-4 max-w-[55%] " +
                                            (message.sender === id ?
                                                "ml-auto bg-[#236862] text-white rounded-tl-[12px] rounded-b-[12px] " :
                                                "bg-[#ffffff] rounded-tr-[12px] rounded-b-[12px] ")
                                        }
                                        style={{ boxShadow: '0 0px 18px rgba(0, 0, 0, 0.2)' }}
                                    >
                                        {message.text}
                                    </span>
                                    <span className="text-gray-400 text-xs mt-1">
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef}></div>
                        </div>
                        <form className="flex w-[74vw] gap-2 fixed bottom-0" onSubmit={handleMsgSend}>
                            <input
                                value={newMessageText}
                                onChange={ev => setNewMessageText(ev.target.value)}
                                type="text"
                                placeholder='Type your message here'
                                className="bg-white flex-grow border p-2 rounded-[8px]"
                            />
                            <button type="submit" className="bg-[#236862] p-2 rounded-[8px] text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-3/4 bg-[#e9fffd] p-4">
                        <span className="text-gray-400 text-[2rem] font-bold mt-[-3px]">&larr;</span>
                        <span className="text-gray-400 font-[600] ml-2">Select a person to chat</span>
                    </div>
                )}
            </div>
        </>
    )

}
