import { Flex, Segmented, Space, message } from "antd";
import { ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { AllEntitiesLace } from "../laces/AllEntitiesLace";
import { AllLampEntitiesLace } from "../laces/AllLampEntitiesLace";
import { useHass } from "../modules/Hass/useHass";

const laces = ["all", "lamps"] as const;
type Laces = typeof laces;
type Lace = Laces[number];

export function Home() {
  const navigate = useNavigate();
  const { connection, hassUrl } = useHass();
  const [messageApi, contextHolder] = message.useMessage();

  const [page, setPage] = useLocalStorage<Lace>("ehs-last-lace", "all");

  const doPing = useCallback(async () => {
    try {
      await connection.ping();
      messageApi.success(
        <>
          Successfully pinged: <br />
          <small>
            <code>{hassUrl}</code>
          </small>
        </>,
      );
    } catch (err) {
      messageApi.error("Ping worked");
    }
  }, []);

  if (!connection) {
    navigate("/first-start");
  }

  const pageToComponentsMap: { [key in Lace]: ReactNode } = {
    all: <AllEntitiesLace />,
    lamps: <AllLampEntitiesLace />,
  };

  return (
    <Flex vertical style={{ width: "100%" }}>
      {contextHolder}
      <Space
        style={{
          position: "fixed",
          color: "GrayText",
          bottom: "15px",
          right: "15px",
          opacity: "0.5",
          fontSize: "12px",
        }}
      >
        <span onClick={doPing}>HASS {connection.haVersion}</span>
      </Space>
      <Segmented
        value={page}
        style={{ marginBottom: 8, position: "sticky", top: "0", zIndex: 100 }}
        onChange={(value) => setPage(value as Lace)}
        options={[...laces]}
      />

      {pageToComponentsMap[page]}
    </Flex>
  );
}
