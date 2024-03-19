import styles from "./RoomTitle.module.scss";

export function RoomTitle({ children }: { children: string }) {
  return <h3 className={styles.roomTitle}>{children}</h3>;
}
