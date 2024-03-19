import styles from "./RoomTitle.module.scss";

export function RoomTitle({ children }: { children: string }) {
  return <h2 className={styles.roomTitle}>{children}</h2>;
}
