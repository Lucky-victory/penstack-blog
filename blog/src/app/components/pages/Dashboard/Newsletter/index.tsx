"use client";

import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  TableContainer,
  Avatar,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { PermissionGuard } from "../../../PermissionGuard";
import { SearchIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "../../../Loader";
import { NewsletterSelect, PaginatedResponse } from "@/src/types";

export const DashboardNewsletterPage = () => {
  const [newsletters, setNewsletters] = useState<NewsletterSelect[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNewsletters, setFilteredNewsletters] = useState<
    NewsletterSelect[]
  >([]);

  const { isFetching, data, refetch } = useQuery({
    queryKey: ["newsletters"],
    queryFn: async () => {
      const { data } = await axios<PaginatedResponse<NewsletterSelect>>(
        "/api/newsletters"
      );
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (data) {
      setNewsletters(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (newsletters) {
      const filtered = newsletters.filter((newsletter) => {
        const matchesSearch =
          newsletter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newsletter.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      setFilteredNewsletters(filtered);
    }
  }, [newsletters, searchTerm]);

  return (
    <PermissionGuard requiredPermission={"dashboard:view"}>
      <Box p={8}>
        <Card rounded={{ base: 20, md: 24 }} mb={8}>
          <CardBody>
            <HStack justify="space-between" align="center">
              <Heading size="lg">Newsletter Subscribers</Heading>
            </HStack>
          </CardBody>
        </Card>

        <Card rounded={{ base: 20, md: 24 }}>
          <CardBody>
            <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
              <InputGroup>
                <InputLeftAddon roundedLeft={"full"}>
                  <SearchIcon />
                </InputLeftAddon>
                <Input
                  maxW={{ md: "320px" }}
                  autoComplete="off"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  roundedRight={"full"}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Stack>

            {isFetching && (
              <Center>
                <Loader />
              </Center>
            )}

            {!isFetching && filteredNewsletters?.length > 0 ? (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Email</Th>
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Verification</Th>
                      <Th>Referrer</Th>
                      <Th>Created At</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredNewsletters &&
                      filteredNewsletters.map((subscriber) => (
                        <Tr key={subscriber.id}>
                          <Td>{subscriber.id}</Td>
                          <Td>{subscriber.email}</Td>
                          <Td>{subscriber.name || "-"}</Td>
                          <Td>
                            <Badge
                              rounded={"lg"}
                              colorScheme={
                                subscriber.status === "subscribed"
                                  ? "green"
                                  : "red"
                              }
                            >
                              {subscriber.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              rounded={"lg"}
                              colorScheme={
                                subscriber.verification_status === "verified"
                                  ? "green"
                                  : "yellow"
                              }
                            >
                              {subscriber.verification_status}
                            </Badge>
                          </Td>
                          <Td>{subscriber.referrer || "-"}</Td>
                          <Td>
                            {new Date(
                              subscriber.created_at as Date
                            ).toLocaleDateString()}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              !isFetching && (
                <Center py={10}>
                  <Text color="gray.500">No subscribers yet</Text>
                </Center>
              )
            )}
          </CardBody>
        </Card>
      </Box>
    </PermissionGuard>
  );
};
