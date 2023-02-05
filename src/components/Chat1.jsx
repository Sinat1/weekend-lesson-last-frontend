import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = {
  current: io("https://weekend-lesson-last.onrender.com"),
};

export const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState();
  const [name, setName] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    return () => {
      socket.current.off("disconnect", name);
    };
  }, []);

  useEffect(() => {
    socket.current.on("Changed online", (data) => {
      setOnlineUsers(data);
    });
    socket.current.on("Update message list", (res) => {
      setMessagesList([...messagesList, res]);
    });
  }, [messagesList, onlineUsers]);

  const handleNameClick = (e) => {
    e.preventDefault();

    socket.current.emit("Add new user", name);
    socket.current.on("Changed online", (data) => {
      setOnlineUsers(data);
    });
    socket.current.on("fetch messages", (messages) => {
      setMessagesList(messages);
    });
  };

  const handleTextClick = (e) => {
    e.preventDefault();

    socket.current.emit("New Message", {
      name,
      text,
    });
    socket.current.on("Update message list", (res) => {
      setMessagesList([...messagesList, res]);
    });
  };
  return (
    <div>
      <p>Users online: {onlineUsers}</p>
      <form action="">
        <label>
          {" "}
          Enter your name
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
          />
        </label>
        <button type="submit" onClick={handleNameClick}>
          Submit
        </button>
      </form>
      <ul>
        {messagesList.map((item) => (
          <li key={item._id}>
            <span>{item.name}</span>:<span>{item.text}</span>
          </li>
        ))}
      </ul>
      <form action="">
        <label>
          {" "}
          Enter your message
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value);
            }}
          />
        </label>
        <button type="submit" onClick={handleTextClick}>
          Submit
        </button>
      </form>
    </div>
  );
};
