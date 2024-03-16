import { Alert, Button, DatePicker, Space } from "antd";

export function Home() {
  return (
    <>
      <Alert message="Hello fromr react!" />
      <Space>
        <DatePicker />
        <Button type="primary">Primary Button</Button>
      </Space>
    </>
  );
}
