import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./TopMenu.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchQuery } from "../../store/slices/uiSlice";
import { getWsBaseUrl } from "../../utils/api";

// Centralized WebSocket base URL resolution (aligns with REST)
const wsUrl = getWsBaseUrl();

const TopMenu: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [sessions, setSessions] = useState(0);
  const dispatch = useDispatch();
  const searchQuery = useSelector((s: RootState) => s.ui.searchQuery);

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

  // NOTE: We intentionally avoid local state/debounce to make the search
  // reflect immediately and prevent any race with Redux.

  return (
    <div className={styles.topMenu}>
      <div className={styles.left}>Orders / Products App</div>
      <div className={styles.center}>{now.toLocaleString()}</div>
      <div className={styles.right}>
        <input
          type="text"
          className={styles.search}
          placeholder="Search orders and products..."
          value={searchQuery}
          onChange={(e) => (dispatch as any)(setSearchQuery(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Already synced onChange; optionally prevent form submits
              e.preventDefault();
            }
            if (e.key === "Escape") {
              // Clear both the global query and the input UI so they don't get out of sync
              (dispatch as any)(setSearchQuery(""));
            }
          }}
        />
        <span className={styles.sessions}>
          Active: <strong>{sessions}</strong>
        </span>
      </div>
    </div>
  );
};

export default TopMenu;
