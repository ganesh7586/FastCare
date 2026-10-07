import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const Chat = () => {
    const { token, backendUrl, userData } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!token) {
            toast.warn('Please login to access messages');
            navigate('/login');
        }
    }, [token, navigate]);

    // Setup Socket.IO connection
    useEffect(() => {
        if (!userData?._id) return;

        socketRef.current = io(backendUrl, {
            query: { userId: userData._id }
        });

        socketRef.current.on('receive_message', (newMsg) => {
            setMessages((prev) => {
                if (selectedChat && newMsg.conversationId === selectedChat._id) {
                    return [...prev, newMsg];
                }
                return prev;
            });
            fetchConversations();
        });

        socketRef.current.on('new_message_notification', () => {
            fetchConversations();
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [userData?._id, selectedChat]);

    // Fetch user conversations
    const fetchConversations = async () => {
        if (!token) return;
        try {
            setLoadingConversations(true);
            const { data } = await axios.get(`${backendUrl}/api/chat/user/conversations`, {
                headers: { token }
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
        if (token) {
            fetchConversations();
        }
    }, [token]);

    // Handle initial conversation passed from Appointment page
    useEffect(() => {
        if (location.state?.selectedConv) {
            handleSelectChat(location.state.selectedConv);
        }
    }, [location.state]);

    // Select a doctor conversation
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

    // Send a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !selectedChat) return;

        const messageText = inputMessage.trim();
        setInputMessage('');

        try {
            const payload = {
                conversationId: selectedChat._id,
                receiverId: selectedChat.docId?._id,
                text: messageText
            };

            const { data } = await axios.post(`${backendUrl}/api/chat/send`, payload, {
                headers: { token }
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
        <div className='my-8 max-w-6xl mx-auto h-[80vh] bg-white border border-gray-200 rounded-xl shadow-sm flex overflow-hidden'>
            {/* Left Column: Doctor Chats List */}
            <div className='w-full sm:w-2/5 md:w-1/3 border-r border-gray-200 flex flex-col'>
                <div className='p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between'>
                    <h2 className='font-semibold text-gray-800 text-lg'>Doctors</h2>
                    <span className='text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium'>
                        {conversations.length} Active
                    </span>
                </div>

                <div className='flex-1 overflow-y-auto divide-y divide-gray-100'>
                    {loadingConversations && (
                        <p className='text-sm text-gray-400 p-4 text-center'>Loading doctors...</p>
                    )}

                    {!loadingConversations && conversations.length === 0 && (
                        <div className='p-6 text-center text-gray-400 text-sm'>
                            No chats yet. Visit a doctor&apos;s profile and click &quot;Message Doctor&quot; to begin!
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
                                    src={conv.docId?.image || 'https://via.placeholder.com/150'}
                                    alt={conv.docId?.name}
                                    className='w-12 h-12 rounded-full object-cover border border-gray-200'
                                />
                                <div className='flex-1 min-w-0'>
                                    <div className='flex justify-between items-center mb-1'>
                                        <h3 className='font-medium text-gray-800 truncate text-sm'>
                                            {conv.docId?.name || 'Doctor'}
                                        </h3>
                                        {conv.lastMessageAt && (
                                            <span className='text-[11px] text-gray-400'>
                                                {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-xs text-primary truncate font-medium'>
                                        {conv.docId?.speciality}
                                    </p>
                                    <p className='text-xs text-gray-500 truncate mt-0.5'>
                                        {conv.lastMessage || 'Click to open chat'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div className='hidden sm:flex sm:flex-1 flex-col bg-slate-50/40'>
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className='p-4 border-b border-gray-200 bg-white flex items-center gap-3'>
                            <img
                                src={selectedChat.docId?.image || 'https://via.placeholder.com/150'}
                                alt={selectedChat.docId?.name}
                                className='w-10 h-10 rounded-full object-cover border'
                            />
                            <div>
                                <h3 className='font-medium text-gray-800 text-sm'>
                                    {selectedChat.docId?.name}
                                </h3>
                                <p className='text-xs text-primary font-medium'>
                                    {selectedChat.docId?.speciality}
                                </p>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]'>
                            {loadingMessages ? (
                                <p className='text-center text-gray-400 text-sm py-4'>Loading history...</p>
                            ) : messages.length === 0 ? (
                                <div className='h-full flex items-center justify-center text-gray-400 text-sm'>
                                    No messages yet. Send a message to start your consultation!
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isFromUser = msg.senderType === 'user';
                                    return (
                                        <div
                                            key={msg._id || index}
                                            className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                    isFromUser
                                                        ? 'bg-primary text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                }`}
                                            >
                                                <p className='break-words'>{msg.text}</p>
                                                <span
                                                    className={`block text-[10px] mt-1 text-right ${
                                                        isFromUser ? 'text-indigo-100' : 'text-gray-400'
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

                        {/* Input Box */}
                        <form onSubmit={handleSendMessage} className='p-3 bg-white border-t border-gray-200 flex gap-2 items-center'>
                            <input
                                type='text'
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder='Type your message or ask a question...'
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
                            🩺
                        </div>
                        <p className='text-base font-medium text-gray-600'>Select a Doctor</p>
                        <p className='text-xs mt-1 text-gray-400'>Select a doctor from the list to view or continue your conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
