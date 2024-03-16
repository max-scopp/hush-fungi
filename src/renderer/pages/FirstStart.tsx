import { Button, Card, Flex, Input, Result, Steps } from "antd";
import { useState } from "react";
import { channels } from "../../shared/channels";
import { EmojiIcon } from "../components/EmojiIcon";

const steps = [
  {
    title: "Preface",
    content: (
      <>
        <p>
          Before we begin setup, a small overview of what and how we use certain
          things within this app. Please note, that this app will be added to a
          trusted source within HASS.
        </p>
        <ul>
          <li>
            eHASS is using the
            <a href="https://developers.home-assistant.io/docs/api/websocket/">
              WebSocket API
            </a>
          </li>
          <li>My Home Assistant</li>
        </ul>
        <Button
          onClick={() => {
            window.electron.ipcRenderer.sendMessage(
              channels.START_MY_HASS_SETUP,
            );
          }}
        >
          Configure My Home Assistant
        </Button>
      </>
    ),
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];

export function FirstStart() {
  const [showIntro, setShowIntro] = useState(true);
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  if (showIntro) {
    return (
      <Result
        status="info"
        icon={<EmojiIcon emoticon="🤗" />}
        title="Welcome to eHASS!"
        subTitle="We need to connect to your Home Assistant instance. I will guide you through this process. "
        extra={[
          <Input placeholder="Example" />,
          <Button
            type="primary"
            key="console"
            onClick={() => setShowIntro(false)}
          >
            Let's get going!
          </Button>,
        ]}
      >
        asdas
      </Result>
    );
  }

  return (
    <Flex
      vertical
      gap={20}
      style={{ placeSelf: "stretch", paddingTop: "15px" }}
    >
      <Steps
        current={current}
        items={items}
        labelPlacement="vertical"
        // type="inline"
        responsive={false}
        direction="horizontal"
      />
      <Flex
        vertical
        style={{ height: "100%", placeItems: "center", placeContent: "center" }}
      >
        <Card bordered={false} style={{ maxWidth: "380px", width: "100%" }}>
          {steps[current].content}
        </Card>
      </Flex>
    </Flex>
  );
}
