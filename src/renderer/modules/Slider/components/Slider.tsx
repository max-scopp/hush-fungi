import Logger, { error, warn } from "electron-log";
import { HassServiceTarget } from "home-assistant-js-websocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import { ColorRGBA64, rgbToHSL } from "@microsoft/fast-colors";
import styles from "./Slider.module.scss";

const transition = 0.3;

type SliderType = "brightness" | "temperature" | "rgb" | "rgbw" | "rgbww";

function getInternalValue(type: SliderType, value: number | number[]): number {
  switch (type) {
    case "rgb":
    case "rgbw":
    case "rgbww": {
      if (typeof value === "number") {
        error(
          `getInternalValue() you must provide either color_rgb, color_rgbw or color_rgbw as value when using ${type}`,
        );
        return 0;
      }

      const [r = 0, g = 0, b = 0] = (value ?? []) as number[];
      const hsl = rgbToHSL(
        ColorRGBA64.fromObject({
          r,
          g,
          b,
        }),
      );

      return hsl.h;
    }
    case "brightness":
    case "temperature": {
      return value as number;
    }
    default:
      error(`getInternalValue() type "${type}" is not handled`);
  }
}

function getSupplementalValue(
  type: SliderType,
  value: number | number[],
): number {
  switch (type) {
    case "rgb":
    case "rgbw":
    case "rgbww": {
      const [r, g, b, w = 0, ww] = (value ?? []) as number[];
      return w;
    }
    case "brightness":
    case "temperature": {
      return null;
    }
    default:
      error(`getSupplementalValue() type "${type}" is not handled`);
  }
}

export function Slider({
  type,
  value,
  area_id,
  device_id,
  entity_id,
}: HassServiceTarget & {
  type: SliderType;
  value: number | number[];
}) {
  if (!area_id && !device_id && !entity_id) {
    Logger.error(
      "<Slider /> requires a target of either area_id, device_id or entity_id",
    );
  }

  if (type === "rgbww") {
    warn(`<Slider /> does not support rgbww yet.`);
  }

  const renderCycle = useRef(0);

  renderCycle.current++;

  const [userValue, setUserValue] = useState(false);

  const [internalValue, setInternalValue] = useState<number>(
    getInternalValue(type, value),
  );
  const [supplementalValue, setSupplementalValue] = useState<number>(
    getSupplementalValue(type, value),
  );

  const [debouncedValue] = useDebounceValue(internalValue, 120);
  const [supplementalDebouncedValue] = useDebounceValue(supplementalValue, 120);

  useEffect(() => {
    setUserValue(false);

    if (!(internalValue === 360 && value === 0)) {
      setInternalValue(getInternalValue(type, value));
    }

    setSupplementalValue(getSupplementalValue(type, value));
  }, [value]);

  useEffect(() => {
    if (!userValue) {
      return;
    }

    if (renderCycle.current < 2) {
      return;
    }

    const callService = (serviceData: object) =>
      window.hass.callService(
        "light",
        "turn_on",
        { transition, ...serviceData },
        {
          area_id,
          device_id,
          entity_id,
        },
      );

    switch (type) {
      case "rgb":
      case "rgbw":
      case "rgbww":
        debugger;
        return callService({
          hs_color: [debouncedValue, 100],
        });
      case "brightness":
        return callService({
          brightness: debouncedValue,
        });
      case "temperature":
        return callService({
          kelvin: debouncedValue,
        });
    }
  }, [debouncedValue]);

  const min = useMemo(() => {
    switch (type) {
      case "rgb":
      case "rgbw":
      case "rgbww":
        return 0;
      case "brightness":
        return 0;
      case "temperature":
        return 2000;
      default:
        return 0;
    }
  }, [type]);

  const max = useMemo(() => {
    switch (type) {
      case "rgb":
      case "rgbw":
      case "rgbww":
        return 360;
      case "brightness":
        return 255;
      case "temperature":
        return 6500;
      default:
        return 255;
    }
  }, [type]);

  return (
    <div
      className={[styles.slider, styles[`type:${type}`]].join(" ")}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={20}
        value={internalValue}
        onChange={(event) => {
          setUserValue(true);
          setInternalValue(event.currentTarget.valueAsNumber);
        }}
      />
    </div>
  );
  // const [{ x, bg, scale }, api] = useSpring(() => ({
  //   x: 0,
  //   scale: 1,
  // }));
  // const bind = useDrag(({ active, movement: [x] }) =>
  //   api.start({
  //     x: active ? x : 0,
  //     scale: active ? 1.1 : 1,
  //     immediate: (name) => active && name === "x",
  //   }),
  // );

  // return (
  //   <animated.div
  //     className={styles.colorTempGradient}
  //     style={{ background: bg }}
  //   >
  //     <animated.div
  //       {...bind()}
  //       className={styles.sliderKnob}
  //       style={{ x, scale }}
  //     ></animated.div>
  //   </animated.div>
  // );
}
