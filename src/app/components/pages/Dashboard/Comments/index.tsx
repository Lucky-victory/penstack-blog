import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/src/utils";
import { Avatar, HStack, Link } from "@chakra-ui/react";
import DashHeader from "../../../Dashboard/Header";
import { DataTable } from "../../../DataTable";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("author", {
    header: "Author",
    cell: (info) => (
      <HStack>
        <Avatar
          size="sm"
          name={info.getValue()?.name}
          src={info.getValue()?.avatar}
        />
        <Link href={`/author/${info.getValue()?.username}`}>
          {info.getValue()?.name}
        </Link>
      </HStack>
    ),
  }),
  columnHelper.accessor("content", {
    header: "Comment",
    cell: (info) => <Text noOfLines={2}>{info.getValue()}</Text>,
  }),
  columnHelper.accessor("post", {
    header: "Post",
    cell: (info) => (
      <Link href={`/post/${info.getValue()?.slug}`} noOfLines={1}>
        {info.getValue()?.title}
      </Link>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "Date",
    cell: (info) => formatDate(new Date(info.getValue())),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
];

export default function Comments() {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box>
      <DashHeader />
      <Stack spacing={4}>
        <Box bg={bgColor} rounded="lg" p={6} shadow="sm">
          <DataTable
            columns={columns}
            apiUrl="/api/comments"
            searchPlaceholder="Search comments..."
            defaultSort={{ id: "created_at", desc: true }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
