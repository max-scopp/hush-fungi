import { ReactNode } from "react";
import styles from "./InSafespace.module.scss";

export function InSafespace({ children }: { children: ReactNode }) {
  return <div className={styles.inSafespace}>{children}</div>;
}
