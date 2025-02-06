import React, { memo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const PostViewsChart = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [timeRanges, setTimeRanges] = useState([
    { label: "7 days", value: "7days" },
    { label: "30 days", value: "30days" },
    { label: "All time", value: "all" },
  ]);
  // Sample data - in real usage, this would come from props or an API
  const allData = [
    { date: "2024-10-21", views: 532 },
    { date: "2024-10-22", views: 105 },
    { date: "2024-10-23", views: 145 },
    { date: "2024-10-24", views: 215 },
    { date: "2024-10-25", views: 232 },
    { date: "2024-10-26", views: 343 },
    { date: "2024-10-27", views: 428 },
    { date: "2024-10-28", views: 339 },
    { date: "2024-10-29", views: 289 },
    { date: "2024-10-30", views: 412 },
    { date: "2024-10-31", views: 567 },
    { date: "2024-11-01", views: 267 },
  ];

  const getFilteredData = () => {
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    switch (timeRange) {
      case "7days":
        return allData.slice(-7);
      case "30days":
        return allData.slice(-30);
      default:
        return allData;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const tooltipContentBg = useColorModeValue("white", "black");
  const tooltipTextColor = useColorModeValue("black", "white");
  const gridColor = useColorModeValue("#e0e0e0", "#444444");

  return (
    <Card variant={"outline"}>
      <CardHeader>
        <HStack wrap={"wrap"} justify={"space-between"} gap={4}>
          <Heading size={"md"}>Post Views</Heading>
          <HStack wrap={"wrap"} gap={2}>
            {timeRanges.map((range) => (
              <Button
                size={"sm"}
                rounded={"lg"}
                key={range.value}
                colorScheme={timeRange === range.value ? "brand" : "gray"}
                variant={timeRange === range.value ? "solid" : "ghost"}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            width={undefined}
            height={400}
            data={getFilteredData()}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              textAnchor="end"
              height={30}
              fontSize={14}
            />
            <YAxis fontSize={14} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipContentBg,
                borderRadius: "12px",
                border: "none",
                color: tooltipTextColor,
              }}
              labelFormatter={formatDate}
              formatter={(value) => [`${value} views`, "Views"]}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--chakra-colors-brand-500)"
              fill="var(--chakra-colors-brand-400)"
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default memo(PostViewsChart);
