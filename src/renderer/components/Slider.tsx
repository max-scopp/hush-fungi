import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import styles from "./Slider.module.scss";

export function Slider() {
  const [{ x, bg, scale }, api] = useSpring(() => ({
    x: 0,
    scale: 1,
  }));
  const bind = useDrag(({ active, movement: [x] }) =>
    api.start({
      x: active ? x : 0,
      scale: active ? 1.1 : 1,
      immediate: (name) => active && name === "x",
    }),
  );

  return (
    <animated.div
      className={styles.colorTempGradient}
      style={{ background: bg }}
    >
      <animated.div
        {...bind()}
        className={styles.sliderKnob}
        style={{ x, scale }}
      ></animated.div>
    </animated.div>
  );
}
