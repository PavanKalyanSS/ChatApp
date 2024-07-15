import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from '../components/Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import {v4 as uuidv4} from "uuid";


export default function ChatContainer({ currentChat, currentUser , socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage , setArrivalMessage] = useState(null)
    const scrollRef = useRef()

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentChat) {
            const fetchData = async () => {
                try {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id,
                    });
                    setMessages(response.data);
                    scrollToBottom();
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchData();
        }
    }, [currentChat, currentUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMsg = async (msg) => {
        try {
            await axios.post(sendMessageRoute, {
                from: currentUser._id,
                to: currentChat._id,
                message: msg,
            });
            socket.current.emit("send-msg" , {
                to : currentChat._id,
                from : currentUser._id,
                messages : msg,
            })
            const msgs = [...messages];
            msgs.push({fromSelf : true , message : msg});
            setMessages(msgs);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(()=>{
        if(socket.current){
            socket.current.on("msg-recieve" , (msg)=> {
                setArrivalMessage({fromSelf : false , message :msg})
            })
        }
    },[])

    useEffect(()=>{
       arrivalMessage && setMessages((prev)=> [...prev , arrivalMessage])
    },[arrivalMessage])

    useEffect(()=> {
        scrollRef.current?.scrollIntoView({behaviour : "smooth"})
    },[messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {currentChat && (
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img
                                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar"
                                />
                            </div>
                            <div className="username">
                                <h3>{currentChat && currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout />
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={uuidv4()} ref={scrollRef} className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                                <div className="content">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <ChatInput handleSendMsg={handleSendMsg} className="chat-input" />
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    padding-top: 1rem;

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            .avatar {
                img {
                    height: 3rem;
                }
            }

            .username {
                h3 {
                    color: white;
                }
            }
        }
    }

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
        max-height: calc(100vh - 200px);
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        .message {
            display: flex;
            align-items: center;

            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
            }
        }

        .sended {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }

        .received {
            .content {
                background-color: #9900ff20;
            }
        }
    }
`;
