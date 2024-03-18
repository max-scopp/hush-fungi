import { Flex, Segmented, message } from "antd";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { AllEntitiesLace } from "../laces/AllEntitiesLace";
import { AllLampEntitiesLace } from "../laces/AllLampEntitiesLace";

const laces = ["all", "lamps"] as const;
type Laces = typeof laces;
type Lace = Laces[number];

export function Home() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [page, setPage] = useLocalStorage<Lace>("ehs-last-lace", "all");

  const pageToComponentsMap: { [key in Lace]: ReactNode } = {
    all: <AllEntitiesLace />,
    lamps: <AllLampEntitiesLace />,
  };

  return (
    <Flex vertical style={{ width: "100%" }}>
      {contextHolder}
      <Segmented
        value={page}
        // style={{ marginBottom: 8, position: "sticky", top: "0", zIndex: 100 }}
        onChange={(value) => setPage(value as Lace)}
        options={[...laces]}
      />

      {pageToComponentsMap[page]}
    </Flex>
  );
}
