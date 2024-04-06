import { useRef, useEffect, useContext, useState } from "react";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";
import { uniqBy } from 'lodash';
import axios from "axios";

export default function Chat() {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedPerson, setSelectedPerson] = useState(null);
    const { setUserName, id, setId } = useContext(UserContext)
    const [newMessageText, setNewMessageText] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);

    const connectToWs = () => {
        const ws = new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => connectToWs());
    };

    useEffect(() => {
        connectToWs()
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
    console.log(receivedMessages)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleMsgSend = (e) => {
        e.preventDefault();

        const messageToSend = {
            recipient: selectedPerson,
            text: newMessageText,
            file: selectedFile,
        };

        ws.send(JSON.stringify(messageToSend));

        const newMessage = {
            text: newMessageText,
            file: selectedFile,
            sender: id,
            recipient: selectedPerson,
            _id: Date.now(),
        };

        setNewMessageText('');
        setSelectedFile(null);
        setReceivedMessages(prevMessages => ([...prevMessages, newMessage]));
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/logout');
            setId(null);
            setUserName(null)
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
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

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            });
            setOfflinePeople(offlinePeople);
        });
    }, [onlinePeople]);

    const excludingOurId = { ...onlinePeople };
    delete excludingOurId[id];
    const messagesWithoutDup = uniqBy(receivedMessages, message => `${message.sender}_${message.recipient}_${message.text}_${message.createdAt}`);


    return (
        <>
            <div className="flex h-screen max600:flex-col-reverse">
                <div className={!selectedPerson ? "w-1/4 flex justify-between flex-col max600:w-full max600:h-full" : "w-1/4 flex justify-between flex-col max600:w-full max600:h-full max600:hidden"}>
                    <div>
                        <div className="font-bold text-[#236862] flex gap-2 p-4 max600:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                            </svg>
                            ChatterBox
                        </div>
                        {Object.keys(excludingOurId).map(userId => (
                            <div
                                onClick={() => setSelectedPerson(userId)}
                                className={"border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer" + (selectedPerson === userId ? " bg-[#e9fffd]" : "")} key={userId}>
                                <Avatar userName={onlinePeople[userId]} userId={userId} online={true} />
                                <span className="text-gray-800 font-[500] max600:text-[1.2rem]">{onlinePeople[userId]}</span>
                            </div>
                        ))}
                        {Object.keys(offlinePeople).map(userId => (
                            <div
                                onClick={() => setSelectedPerson(userId)}
                                className={"border-b border-gray-100 py-2 pl-4 flex items-center gap-2 cursor-pointer" + (selectedPerson === userId ? " bg-[#e9fffd]" : "")}
                                key={userId}>
                                <Avatar userName={offlinePeople[userId].userName} userId={userId} online={false} />
                                <span className="text-gray-800 font-[500] max600:text-[1.2rem]">{offlinePeople[userId].userName}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-left ml-1 px-2 py-1 mb-1 text-white rounded-[8px] bg-[#236862] w-[4rem]"
                    >
                        Logout
                    </button>
                </div>
                {selectedPerson ? (
                    <div className=" bg-[#e9fffd] w-3/4 p-2 flex flex-col overflow-y-auto hide-scrollbar pb-[2rem] max600:w-screen max600:h-full" style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
                        <div className="flex-grow">
                            {messagesWithoutDup.map(message => (
                                <div key={message._id} className="flex justify-start mb-2">
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
                                    {/* <span className="text-gray-400 text-xs mt-1">
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </span> */}
                                </div>
                            ))}
                            <div ref={messagesEndRef}></div>
                        </div>
                        <form className="flex w-[74vw] gap-2 fixed bottom-1 max600:w-[96vw]" onSubmit={handleMsgSend}>
                            <input
                                value={newMessageText}
                                onChange={ev => setNewMessageText(ev.target.value)}
                                type="text"
                                placeholder='Type your message here'
                                className="bg-white flex-grow border p-2 rounded-[8px]"
                            />
                            <label className="bg-[#efefef] p-2 rounded-[8px] text-white">
                                {/* Display File preview if available */}
                                {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="w-8 h-8 object-cover" />}
                                <input type="file" onChange={handleFileChange} className="hidden" accept="File/*" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <button type="submit" className="bg-[#236862] p-2 rounded-[8px] text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-3/4 bg-[#e9fffd] p-4 max600:w-full max600:h-[20rem] max600:bg-[#0f0f0f]">
                        <span className="text-gray-400 text-[2rem] font-bold mt-[-3px] max600:hidden">&larr;</span>
                        <span className="text-gray-400 font-[600] ml-2">Select a person to chat</span>
                    </div>
                )}
                <div className="min600:hidden">
                    {selectedPerson && (
                        <div className="flex items-center gap-2 border-2 border-b-[#6b6b6b]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-4" onClick={(e) => setSelectedPerson(null)}>
                                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                            </svg>
                            <div className="flex items-center gap-2 p-2">
                                {onlinePeople[selectedPerson] && (
                                    <Avatar userName={onlinePeople[selectedPerson]} userId={selectedPerson} online={true} />
                                )}
                                {offlinePeople[selectedPerson] && (
                                    <Avatar userName={offlinePeople[selectedPerson].userName} userId={selectedPerson} online={false} />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-gray-800 font-[500] max600:text-[1.2rem]">
                                        {onlinePeople[selectedPerson] || offlinePeople[selectedPerson]?.userName}
                                    </span>
                                    {onlinePeople[selectedPerson] && (
                                        <span className="text-[0.7rem] ml-1 font-[600] text-[#888888]">Active now</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    )

}
