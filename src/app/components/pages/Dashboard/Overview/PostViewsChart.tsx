import React, { memo, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Button,
  useColorModeValue,
  Box,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AggregatedPostViews } from "@/src/types";

const PostViewsChart = () => {
  const [timeRange, setTimeRange] = useState("7");
  const timeRanges = useMemo(
    () => [
      { label: "7 days", value: "7" },
      { label: "30 days", value: "30" },
      { label: "60 days", value: "60" },
      { label: "90 days", value: "90" },
      { label: "All time", value: "all" },
    ],
    []
  );

  const { data: postViews } = useQuery({
    queryKey: ["analyticsPostViews", timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/posts/views?timeRange=${timeRange}`
      );
      const data = await response.json();
      return data.data as AggregatedPostViews[];
    },
    refetchOnMount: false,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const tooltipContentBg = useColorModeValue("white", "gray.900");
  const tooltipTextColor = useColorModeValue("black", "white");
  const gridColor = useColorModeValue("#e0e0e0", "#444444");
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          px={2}
          py={2}
          bg={tooltipContentBg}
          color={tooltipTextColor}
          rounded={"lg"}
        >
          <Text>{formatDate(label)}</Text>
          {payload.map((entry: any, index: number) => (
            <Box key={index}>
              <HStack>
                <Box w={2} h={2} bg={entry.color}></Box>
                <p className="label">{`${entry.value} views`}</p>
              </HStack>
            </Box>
          ))}
        </Box>
      );
    }

    return null;
  };
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
            data={postViews}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="viewed_date"
              tickFormatter={formatDate}
              textAnchor="end"
              height={30}
              fontSize={14}
            />
            <YAxis fontSize={14} width={50} />
            <Tooltip content={<CustomTooltip />} labelFormatter={formatDate} />
            <Legend />
            <Area
              dot={{ r: 1 }}
              activeDot={{ r: 6 }}
              name="Total views"
              stackId={1}
              dataKey="total_views"
              stroke="var(--chakra-colors-green-500)"
              fill="var(--chakra-colors-green-400)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dot={{ r: 1 }}
              activeDot={{ r: 6 }}
              name="Unique views"
              stackId={1}
              type="monotone"
              dataKey="unique_views"
              stroke="var(--chakra-colors-blue-500)"
              fill="var(--chakra-colors-blue-400)"
              strokeWidth={2}
            />
            <Area
              stackId={1}
              dot={{ r: 1 }}
              activeDot={{ r: 6 }}
              type="monotone"
              name="Anonymous views"
              dataKey="anonymous_views"
              stroke="var(--chakra-colors-orange-500)"
              fill="var(--chakra-colors-orange-400)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default memo(PostViewsChart);
