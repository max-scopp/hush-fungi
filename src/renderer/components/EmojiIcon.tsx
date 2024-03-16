import styles from "./EmojiIcon.module.scss";

type EmojiIconProps = {
  emoticon: string;
};

export function EmojiIcon({ emoticon }: EmojiIconProps) {
  return <span className={styles.emoticon}>{emoticon}</span>;
}
