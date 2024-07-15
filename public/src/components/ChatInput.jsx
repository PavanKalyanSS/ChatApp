import React, { useState } from 'react';
import styled from 'styled-components';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import Picker from 'emoji-picker-react';

export default function ChatInput({handleSendMsg}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState('');

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    // console.log("event: " , event);
    // console.log("emoji object" , emojiObject);
    const  emoji  = event.emoji;
    const newMessage = msg + emoji;
    setMsg(newMessage);
  };
  const sendChat = (event)=>{
        event.preventDefault()
        if(msg.length > 0){
            handleSendMsg(msg);
            setMsg("")
        }
  }
  return (
    <Container>
      <div className="emoji">
        <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
        {showEmojiPicker && (
          <EmojiPickerWrapper>
            <Picker onEmojiClick={handleEmojiClick} />
          </EmojiPickerWrapper>
        )}
      </div>
      <form className="input-container" onSubmit={(e)=>  sendChat(e)}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0.2rem;
  padding-bottom: 0.3rem;
   

  .emoji {
    position: relative;
    display: flex;
    align-items: center;
    color: #ffff00c8;
    cursor: pointer;

    svg {
      font-size: 1.5rem;
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9186f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9186f3;
      border: none;

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: calc(100% + 5px); /* Position above the emoji icon */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;
