import { Flex, Segmented, message } from "antd";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { AllEntitiesLace } from "../laces/AllEntitiesLace";
import { AllLightsLace } from "../laces/AllLightsLace";
import { HassIcon } from "../modules/Hass/HassIcon";
import styles from "./Home.module.scss";

const laces = ["all", "lamps"] as const;
type Laces = typeof laces;
type Lace = Laces[number];

export function Home() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [page, setPage] = useLocalStorage<Lace>("ehs-last-lace", "all");

  const pageToComponentsMap: { [key in Lace]: ReactNode } = {
    all: <AllEntitiesLace />,
    lamps: <AllLightsLace />,
  };

  return (
    <Flex vertical style={{ width: "100%" }}>
      {contextHolder}
      <Segmented
        className={styles.bar}
        value={page}
        // style={{ marginBottom: 8, position: "sticky", top: "0", zIndex: 100 }}
        onChange={(value) => setPage(value as Lace)}
        options={[
          {
            value: "all",
            icon: <HassIcon iconName="mdi:all-inclusive" />,
          },
          {
            value: "lamps",
            icon: <HassIcon iconName="mdi:lamps" />,
          },
          {
            value: "thermometer",
            icon: <HassIcon iconName="mdi:thermometer" />,
          },
          {
            value: "electricity",
            icon: <HassIcon iconName="mdi:lightning-bolt" />,
          },
        ]}
      />

      {pageToComponentsMap[page]}
    </Flex>
  );
}
