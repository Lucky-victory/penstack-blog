import { TaxonomyItem, TaxonomyItemsWithMeta } from "@/src/types";
import {
  useColorModeValue,
  Flex,
  Box,
  Grid,
  GridItem,
  Stack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuArrowUpDown,
  LuFolderTree,
  LuTag,
  LuMoreVertical,
  LuFileEdit,
  LuTrash2,
} from "react-icons/lu";
import Pagination from "../../../../Pagination";
import { useTaxonomiesStore } from "../state";

interface SortConfig {
  key: keyof TaxonomyItem;
  direction: "asc" | "desc";
}

interface FilteredListProps {
  items: TaxonomyItemsWithMeta;
}
export const FilteredList: React.FC<FilteredListProps> = ({ items }) => {
  const searchTerm = useTaxonomiesStore((state) => state.searchTerm);
  const type = useTaxonomiesStore((state) => state.type);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [editItem, setEditItem] = useState<TaxonomyItem | null>(null);

  const handleSort = (key: keyof TaxonomyItem): void => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };
  const filteredItems = items.results
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    });

  const handleDelete = (id: number): void => {
    console.log("Delete item:", id);
  };

  const handleEdit = (item: TaxonomyItem): void => {
    setEditItem(item);
    //  setNewItemDialog(true);
  };
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const cellBg = useColorModeValue("white", "gray.800");
  const cellTextColor = useColorModeValue("gray.800", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Flex gap={4} overflowX={"auto"}>
      <Box flexShrink={0} flexGrow={1} mb={4}>
        <Grid
          templateColumns="repeat(12, 1fr)"
          alignItems={"center"}
          gap={4}
          px={4}
          py={2}
          mb={3}
          bg={headerBg}
          borderRadius="lg"
          fontWeight="medium"
          fontSize="sm"
        >
          <GridItem colSpan={1} />
          <GridItem colSpan={3}>
            <Button
              variant="ghost"
              onClick={() => handleSort("name")}
              ml={-3}
              size="sm"
              color={"inherit"}
              rightIcon={<LuArrowUpDown />}
            >
              Name
            </Button>
          </GridItem>
          <GridItem colSpan={4}>Slug</GridItem>
          <GridItem colSpan={2}>
            <Button
              variant="ghost"
              onClick={() => handleSort("postCount")}
              size="sm"
              color={"inherit"}
              ml={-3}
              rightIcon={<LuArrowUpDown />}
            >
              Posts Count
            </Button>
          </GridItem>
          <GridItem colSpan={2}>Actions</GridItem>
        </Grid>

        <Stack>
          {filteredItems.map((item) => (
            <Grid
              key={item.id}
              templateColumns="repeat(12, 1fr)"
              gap={4}
              px={4}
              py={3}
              bg={cellBg}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              alignItems="center"
              _hover={{ bg: headerBg }}
            >
              <GridItem colSpan={1}>
                {type === "categories" ? <LuFolderTree /> : <LuTag />}
              </GridItem>
              <GridItem colSpan={3} fontWeight="medium">
                {item.name}
              </GridItem>
              <GridItem colSpan={4} color={cellTextColor}>
                {item.slug}
              </GridItem>
              <GridItem colSpan={2}>
                <Badge>{item.postCount}</Badge>
              </GridItem>
              <GridItem colSpan={2}>
                <Menu>
                  <MenuButton as={Button} variant="ghost" size="sm">
                    <LuMoreVertical />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<LuFileEdit />}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      color="red.600"
                      icon={<LuTrash2 />}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </GridItem>
            </Grid>
          ))}
        </Stack>
      </Box>
    </Flex>
  );
};
