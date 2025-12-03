import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./NavigationMenu.module.scss";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

const NavigationMenu: React.FC<{ open?: boolean; onClose?: () => void }> = ({
  open,
  onClose,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const nav = [
    { href: "/orders", label: t("nav.orders") },
    { href: "/products", label: t("nav.products") },
    { href: "/groups", label: t("nav.groups") },
  ];
  return (
    <>
      <nav className={`${styles.nav} ${styles.desktop}`}>
        {nav.map((n) => (
          <Link
            className={`${styles.navItem} ${router.pathname.startsWith(n.href) ? styles.active : ""}`}
            key={n.href}
            href={n.href}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.backdrop} onClick={onClose} />
            <motion.nav
              className={`${styles.nav} ${styles.mobile}`}
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              {nav.map((n) => (
                <Link
                  className={`${styles.navItem} ${router.pathname.startsWith(n.href) ? styles.active : ""}`}
                  key={n.href}
                  href={n.href}
                  onClick={onClose}
                >
                  {n.label}
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default NavigationMenu;
