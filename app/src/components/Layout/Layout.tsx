import React from "react";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import TopMenu from "../TopMenu/TopMenu";
import styles from "./Layout.module.scss";

const Layout: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <div className={styles.root}>
            <NavigationMenu/>
            <div className={styles.main}>
                <TopMenu/>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default Layout;
