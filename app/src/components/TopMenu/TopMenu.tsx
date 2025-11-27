import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./TopMenu.module.scss";

/**
 * Correct WebSocket URL handling:
 * - Browser: NEXT_PUBLIC_WS_URL_BROWSER or localhost:4000
 * - Docker SSR/server: NEXT_PUBLIC_WS_URL or api:4000
 */
const wsUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_WS_URL_BROWSER || "http://localhost:4000"
    : process.env.NEXT_PUBLIC_WS_URL || "http://api:4000";

const TopMenu: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);

    const socket: Socket = io(wsUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("sessions", (payload: any) => {
      if (payload && typeof payload.sessions === "number") {
        setSessions(payload.sessions);
      }
    });

    return () => {
      clearInterval(t);
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.topMenu}>
      <div className={styles.left}>Orders / Products App</div>
      <div className={styles.center}>{now.toLocaleString()}</div>
      <div className={styles.right}>
        Active sessions: <strong>{sessions}</strong>
      </div>
    </div>
  );
};

export default TopMenu;
