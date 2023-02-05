import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = {
  current: io("http://localhost:3001/"),
};

export const Chat = () => {
  const [onlineUsers, setOnlineUsers] = useState();
  useEffect(() => {
    socket.current.on("Changed online", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  return (
    <div>
      <p>Users online: {onlineUsers}</p>
    </div>
  );
};
