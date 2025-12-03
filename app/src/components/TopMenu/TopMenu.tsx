import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './TopMenu.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSearchQuery } from '@/store/slices/uiSlice';
import { getWsBaseUrl } from '@/utils/api';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const wsUrl = getWsBaseUrl();

const TopMenu: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const [now, setNow] = useState<Date | null>(null);
  const [sessions, setSessions] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((s: RootState) => s.ui.searchQuery);
  const { t } = useTranslation('common');
  const router = useRouter();
  const [lang, setLang] = useState<string>((router.locale as string) || 'en');

  useEffect(() => {
    setNow(new Date());
    const intervalId = setInterval(() => setNow(new Date()), 1000);

    const socket: Socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('sessions', (payload: { sessions?: number }) => {
      if (payload && typeof payload.sessions === 'number') {
        setSessions(payload.sessions);
      }
    });

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang');
      if (saved && saved !== lang) setLang(saved);
    }
  }, [lang]);

  const onChangeLang = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setLang(next);
    if (typeof window !== 'undefined') localStorage.setItem('lang', next);
    await router.push(router.asPath, router.asPath, { locale: next });
  };

  return (
    <div className={styles.topMenu}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          aria-label={t('common.openMenu')}
          onClick={() => onMenuClick && onMenuClick()}
        >
          ☰
        </button>
        <span className={styles.appName}>{t('appName')}</span>
      </div>
      <input
        type="text"
        className={styles.search}
        placeholder={t('topMenu.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
          if (e.key === 'Escape') {
            dispatch(setSearchQuery(''));
          }
        }}
      />
      <div className={styles.right}>
        <div className={styles.center} suppressHydrationWarning>
          {now ? now.toLocaleString() : ''}
        </div>
        <span className={styles.sessions}>
          {t('topMenu.sessions')}: <strong>{sessions}</strong>
        </span>
        <select aria-label="Language selector" value={lang} onChange={onChangeLang}>
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="uk">UK</option>
        </select>
      </div>
    </div>
  );
};

export default TopMenu;
