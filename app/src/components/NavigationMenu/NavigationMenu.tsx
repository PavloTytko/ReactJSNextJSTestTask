import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./NavigationMenu.module.scss";

const NavigationMenu: React.FC = () => {
  const router = useRouter();
  const nav = [
    { href: "/orders", label: "Orders" },
    { href: "/products", label: "Products" },
    { href: "/groups", label: "Groups" },
  ];
  return (
    <nav className={styles.nav}>
      <h3>App</h3>
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
  );
};
export default NavigationMenu;
