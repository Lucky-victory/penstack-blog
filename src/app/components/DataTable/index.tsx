import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Stack,
  HStack,
  Select,
  Text,
  IconButton,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell: (value: T[keyof T]) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data = [],
  columns,
  searchPlaceholder = "Search...",
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card>
      <CardBody>
        <Stack spacing={4}>
          <HStack justify="space-between">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              maxW="300px"
            />
            <Select maxW="100px" value={pageSize}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
          </HStack>

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {columns.map((column, i) => (
                    <Th key={i}>{column.header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((row, i) => (
                  <Tr key={i}>
                    {columns.map((column, j) => (
                      <Td key={j}>{column.cell(row[column.accessor])}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <HStack justify="space-between" align="center">
            <Text>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </Text>
            <HStack>
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              />
              <Text>
                Page {currentPage} of {pageCount}
              </Text>
              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                isDisabled={currentPage === pageCount}
                onClick={() => setCurrentPage((p) => p + 1)}
              />
            </HStack>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
}
