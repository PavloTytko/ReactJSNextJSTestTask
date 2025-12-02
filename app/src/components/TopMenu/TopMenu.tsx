import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./TopMenu.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchQuery } from "../../store/slices/uiSlice";
import { getWsBaseUrl } from "../../utils/api";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

// Centralized WebSocket base URL resolution (aligns with REST)
const wsUrl = getWsBaseUrl();

const TopMenu: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  // Avoid SSR/CSR mismatch by rendering time only after mount
  const [now, setNow] = useState<Date | null>(null);
  const [sessions, setSessions] = useState(0);
  const dispatch = useDispatch();
  const searchQuery = useSelector((s: RootState) => s.ui.searchQuery);
  const { t } = useTranslation("common");
  const router = useRouter();
  const [lang, setLang] = useState<string>((router.locale as string) || "en");

  useEffect(() => {
    // Initialize immediately after mount and then tick every second
    setNow(new Date());
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

  useEffect(() => {
    // restore persisted language preference on mount (CSR only)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      if (saved && saved !== lang) setLang(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeLang = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setLang(next);
    if (typeof window !== "undefined") localStorage.setItem("lang", next);
    await router.push(router.asPath, router.asPath, { locale: next });
  };

  // NOTE: We intentionally avoid local state/debounce to make the search
  // reflect immediately and prevent any race with Redux.

  return (
    <div className={styles.topMenu}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          aria-label={t("common.openMenu")}
          onClick={() => onMenuClick && onMenuClick()}
        >
          ☰
        </button>
        <span className={styles.appName}>{t("appName")}</span>
      </div>
      <input
        type="text"
        className={styles.search}
        placeholder={t("topMenu.searchPlaceholder")}
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
      <div className={styles.right}>
        <div className={styles.center} suppressHydrationWarning>
          {now ? now.toLocaleString() : ""}
        </div>
        <span className={styles.sessions}>
          {t("topMenu.sessions")}: <strong>{sessions}</strong>
        </span>
        <select
          aria-label="Language selector"
          value={lang}
          onChange={onChangeLang}
        >
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uk">UK</option>
        </select>
      </div>
    </div>
  );
};

export default TopMenu;
