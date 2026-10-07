import { useContext,useEffect,useState,useRef } from "react";
import {DoctorContext} from '../../context/DoctorContext';
import axios from'axios';
import {toast} from 'react-toastify';
import io from 'socket.io-client';

const DoctorChat = () =>{
    const {dToken , backendUrl , profileData , getProfileData} = useContext(DoctorContext);

    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(()=>{
         scrollToBottom();
    },[messages]);

    useEffect(() => {
        if (dToken && !profileData) {
            getProfileData();
        }
    }, [dToken, profileData]);

     useEffect(() => {
        if (!profileData?._id) return;
        socketRef.current = io(backendUrl, {
            query: { userId: profileData._id }
        });
        // Listen for incoming messages
        socketRef.current.on('receive_message', (newMsg) => {
            setMessages((prev) => {
                if (selectedChat && newMsg.conversationId === selectedChat._id) {
                    return [...prev, newMsg];
                }
                return prev;
            });
            fetchConversations();
        });
        // Refresh inbox list on notification
        socketRef.current.on('new_message_notification', () => {
            fetchConversations();
        });
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [profileData?._id, selectedChat]);

const fetchConversations = async () => {
        if (!dToken) return;
        try {
            setLoadingConversations(true);
            const { data } = await axios.get(`${backendUrl}/api/chat/doctor/conversations`, {
                headers: { dToken }
            });
            if (data.success) {
                setConversations(data.conversations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingConversations(false);
        }
};
useEffect(() => {
        if (dToken) {
            fetchConversations();
        }
    }, [dToken]);

    const handleSelectChat = async (conv) => {
        setSelectedChat(conv);
        if (socketRef.current) {
            socketRef.current.emit('join_room', conv._id);
        }
        try {
            setLoadingMessages(true);
            const { data } = await axios.get(`${backendUrl}/api/chat/message/${conv._id}`);
            if (data.success) {
                setMessages(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedChat) return;
        const messageText = inputMessage.trim();
        setInputMessage('');
        try {
            const payload = {
                conversationId: selectedChat._id,
                receiverId: selectedChat.userId?._id,
                text: messageText
            };
            const { data } = await axios.post(`${backendUrl}/api/chat/send`, payload, {
                headers: { dToken }
            });
            if (data.success) {
                setMessages((prev) => [...prev, data.message]);
                if (socketRef.current) {
                    socketRef.current.emit('send_message', data.message);
                }
                fetchConversations();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };   

 return (
        <div className='m-5 w-full max-w-6xl h-[85vh] bg-white border border-gray-200 rounded-xl shadow-sm flex overflow-hidden'>
            {/* Left Column: Patients List */}
            <div className='w-full sm:w-2/5 md:w-1/3 border-r border-gray-200 flex flex-col'>
                <div className='p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between'>
                    <h2 className='font-semibold text-gray-800 text-lg'>Patient Messages</h2>
                    <span className='text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium'>
                        {conversations.length} Active
                    </span>
                </div>
                <div className='flex-1 overflow-y-auto divide-y divide-gray-100'>
                    {loadingConversations && (
                        <p className='text-sm text-gray-400 p-4 text-center'>Loading chats...</p>
                    )}
                    {!loadingConversations && conversations.length === 0 && (
                        <div className='p-6 text-center text-gray-400 text-sm'>
                            No patient messages yet.
                        </div>
                    )}
                    {conversations.map((conv) => {
                        const isSelected = selectedChat?._id === conv._id;
                        return (
                            <div
                                key={conv._id}
                                onClick={() => handleSelectChat(conv)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-indigo-50/70 border-l-4 border-primary' : ''
                                }`}
                            >
                                <img
                                    src={conv.userId?.image || 'https://via.placeholder.com/150'}
                                    alt={conv.userId?.name}
                                    className='w-12 h-12 rounded-full object-cover border border-gray-200'
                                />
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-center mb-1'>
                                        <h3 className='font-medium text-gray-800 truncate text-sm'>
                                            {conv.userId?.name || 'Patient'}
                                        </h3>
                                        {conv.lastMessageAt && (
                                            <span className='text-[11px] text-gray-400'>
                                                {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-xs text-gray-500 truncate'>
                                        {conv.lastMessage || 'Click to view conversation'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Right Column: Chat Box */}
            <div className='hidden sm:flex sm:flex-1 flex-col bg-slate-50/40'>
                {selectedChat ? (
                    <>
                        <div className='p-4 border-b border-gray-200 bg-white flex items-center gap-3'>
                            <img
                                src={selectedChat.userId?.image || 'https://via.placeholder.com/150'}
                                alt={selectedChat.userId?.name}
                                className='w-10 h-10 rounded-full object-cover border'
                            />
                            <div>
                                <h3 className='font-medium text-gray-800 text-sm'>
                                    {selectedChat.userId?.name}
                                </h3>
                                <p className='text-xs text-gray-400'>
                                    {selectedChat.userId?.phone || selectedChat.userId?.email || 'Patient'}
                                </p>
                            </div>
                        </div>
                        {/* Messages Stream */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]'>
                            {loadingMessages ? (
                                <p className='text-center text-gray-400 text-sm py-4'>Loading history...</p>
                            ) : messages.length === 0 ? (
                                <div className='h-full flex items-center justify-center text-gray-400 text-sm'>
                                    No messages yet. Send a greeting to start the consultation!
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isFromDoctor = msg.senderType === 'doctor';
                                    return (
                                        <div
                                            key={msg._id || index}
                                            className={`flex ${isFromDoctor ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                    isFromDoctor
                                                        ? 'bg-primary text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                }`}
                                            >
                                                <p className='break-words'>{msg.text}</p>
                                                <span
                                                    className={`block text-[10px] mt-1 text-right ${
                                                        isFromDoctor ? 'text-indigo-100' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className='p-3 bg-white border-t border-gray-200 flex gap-2 items-center'>
                            <input
                                type='text'
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder='Type your message or medical advice...'
                                className='flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-primary'
                            />
                            <button
                                type='submit'
                                className='bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium transition cursor-pointer'
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className='flex-1 flex flex-col items-center justify-center text-gray-400 p-6'>
                        <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-2xl'>
                            💬
                        </div>
                        <p className='text-base font-medium text-gray-600'>No Conversation Selected</p>
                        <p className='text-xs mt-1 text-gray-400'>Select a patient from the left panel to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default DoctorChat;