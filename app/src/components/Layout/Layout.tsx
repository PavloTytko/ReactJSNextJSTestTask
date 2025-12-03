import React, { useState } from 'react';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import TopMenu from '../TopMenu/TopMenu';
import styles from './Layout.module.scss';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className={styles.root}>
      <TopMenu onMenuClick={() => setNavOpen(true)} />
      <div className={styles.main}>
        <NavigationMenu open={navOpen} onClose={() => setNavOpen(false)} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
