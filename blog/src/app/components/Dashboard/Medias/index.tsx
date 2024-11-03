"use client";
import {
  AbsoluteCenter,
  Box,
  Divider,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FileUpload, FileUrlUpload } from "../../FileUpload";
import { MediaLibrary } from "./MediaLibrary";
import { MediaResponse } from "@/src/types";

interface MediasComponentProps {
  multiple?: boolean;
  maxSelection?: number;
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
}
export default function Medias({
  multiple = true,
  onSelect,
  maxSelection,
}: MediasComponentProps) {
  const dividerBgColor = useColorModeValue("white", "gray.900");
  return (
    <Box py={6} px={{ base: 4, md: 5 }} bg={dividerBgColor} minH={"100vh"}>
      <Tabs isLazy h={"full"} bg={"red"}>
        <TabList>
          <Tab>Media Library</Tab>
          <Tab>Upload Media</Tab>
          <Tab>Upload from URL</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MediaLibrary
              multiple={multiple}
              maxSelection={maxSelection}
              onSelect={(selectedMedia) => {
                onSelect?.(selectedMedia);
              }}
            />
          </TabPanel>
          <TabPanel>
            <Stack gap={4}>
              <FileUpload />
            </Stack>
          </TabPanel>
          <TabPanel>
            <Box py={4}>
              <FileUrlUpload />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
