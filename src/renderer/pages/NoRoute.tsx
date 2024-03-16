import { CaretLeftFilled, HomeFilled } from "@ant-design/icons";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

export function NoRoute() {
  const navigate = useNavigate();

  return (
    <Card
      title="Yikes! 🥲"
      bordered={false}
      style={{ maxWidth: "420px" }}
      actions={[
        <CaretLeftFilled key="browser-back" onClick={() => navigate(-1)} />,
        <HomeFilled key="home" onClick={() => navigate("/")} />,
      ]}
    >
      There was no route found. Try restarting the Task or Application.
    </Card>
  );
}
