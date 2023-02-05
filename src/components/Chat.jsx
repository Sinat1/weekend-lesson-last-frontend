import io from "socket.io-client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

const socket = { current: io("http://localhost:3001/") };

export const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    socket.current.on("changeOnline", (usersNumber) => {
      console.log(usersNumber);
      setOnlineUsers(usersNumber);
    });
    return () => {
      socket.current.off("disconnect", currentUser);
    };
  }, []);

  useEffect(() => {
    socket.current.on("showMessage", (data) => {
      setMessageList([...messageList, data]);
    });
    socket.current.on("changeOnline", (data) => {
      setOnlineUsers(data);
    });
  }, [messageList]);

  const handleClick = (event) => {
    event.preventDefault();
    socket.current.emit("addUser", { name: currentUser, id: nanoid() });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    socket.current.emit("newMessage", { name: currentUser, text: message });
    setMessageList([...messageList, { name: currentUser, text: message }]);
  };

  return (
    <>
      <h1>Hello in the best chat ever!</h1>
      <p>Users online: {onlineUsers}</p>
      <p>Current user: {currentUser}</p>
      <form>
        <label>
          Enter your name
          <input
            type="text"
            value={currentUser}
            onChange={(event) => setCurrentUser(event.currentTarget.value)}
          />
        </label>
        <button onClick={handleClick}>Submit</button>
      </form>
      <form>
        <label>
          Enter your message
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
        </label>
        <button onClick={handleSendMessage}>Submit</button>
      </form>

      <ul>
        {messageList.map((item, idx) => (
          <li key={idx}>
            <span>{item.name}</span>: <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
