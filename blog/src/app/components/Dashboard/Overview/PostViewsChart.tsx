import React, { useState } from "react";
import {
  BarChart,
  Bar,
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

  return (
    <Card rounded={"20px"}>
      <CardHeader>
        <HStack wrap={"wrap"} justify={"space-between"} gap={4}>
          <Heading size={"md"}>Post Views</Heading>
          <HStack wrap={"wrap"} gap={2}>
            {timeRanges.map((range) => (
              <Button
                size={"sm"}
                rounded={"full"}
                key={range.value}
                colorScheme={timeRange === range.value ? "blue" : "gray"}
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
          <BarChart
            width={undefined}
            height={400}
            data={getFilteredData()}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              // angle={-40}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value) => [`${value} views`, "Views"]}
            />
            <Bar dataKey="views" fill="#3b82f6" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default PostViewsChart;
