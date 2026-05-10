import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Gallery" },
    { href: "/exhibition", label: "Exhibitions" },
    { href: "/about", label: "About" },
  ];
  return (
    <div className={styles.navBar}>
      {links.map((link) => (
        <div key={link.href} className={styles.navElement}>
          {pathname === link.href ? (
            <div className={styles.dot} />
          ) : (
            <div className={styles.dot_invisible} />
          )}

          <span>
            <Link href={link.href} scroll={false}>
              {link.label}
            </Link>
          </span>
        </div>
      ))}
      <div className={styles.contact}>
        <span>Instagram</span>

        <span>chloejetaime@gmail.com</span>
      </div>
    </div>
  );
}
