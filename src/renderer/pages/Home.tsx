import { Flex, Segmented } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const laces = ["overview", "lamps", "energy", "blinds"] as const;
type Lace = (typeof laces)[keyof typeof laces];

export function Home() {
  const navigate = useNavigate();

  const [firstStart, setFirstStart] = useState(true);
  const [page, setPage] = useState<Lace>("overview");

  useEffect(() => {
    if (firstStart) {
      navigate("/first-start");
    }
  }, [firstStart]);

  return (
    <Flex vertical style={{ width: "100%" }}>
      <Segmented
        value={page}
        style={{ marginBottom: 8 }}
        onChange={(value) => setPage(value as Lace)}
        options={[...laces]}
      />

      <h1 style={{ color: "HighlightText" }}>Overview</h1>
    </Flex>
  );
}
