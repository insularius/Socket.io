"use client";
import React, { useEffect, useState } from "react";
import style from "../components/chat.module.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import ImageIcon from "@mui/icons-material/Image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import FaceIcon from "@mui/icons-material/Face";
interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  return (
    <div className={style.container}>
      <div className={style.chatWindow}>
        <div className={style.chatHeader}>
          <div className={style.chatHeader__iconContainer}>
            <FaceIcon className={style.chatHeader__icon} />
          </div>
          <div
            className={`${style.chatHeader__iconGroup} ${style.chatHeader__iconGroup__right}`}
          >
            <PhoneIcon className={style.chatHeader__icon} />
            <VideocamIcon className={style.chatHeader__icon} />
          </div>
        </div>

        <div className={style.chat__messages}>
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <div
                className={style.userName}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user}
              </div>
              <div
                className={style.userMessage}
                style={{
                  textAlign: user == username ? "right" : "left",
                  margin: "0px 10px",
                }}
              >
                {msg}
              </div>
            </div>
          ))}
        </div>

        <div className={style.inputContainer}>
          <form className={style.form} onSubmit={(e) => sendData(e)}>
            <CameraAltIcon style={{ marginLeft: "5px" }} />
            <input
              className={style.chat_input}
              type="text"
              value={currentMsg}
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            {currentMsg !== "" ? (
              <button className={style.chat_button}>Send</button>
            ) : (
              <div style={{ marginLeft: "30px" }}>
                <KeyboardVoiceIcon />
                <ImageIcon />
                <AddCircleOutlineIcon style={{ marginRight: "5px" }} />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
