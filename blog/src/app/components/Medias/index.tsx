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
import { FileUpload, FileUrlUpload } from "../FileUpload";
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
  maxSelection = 1,
}: MediasComponentProps) {
  const dividerBgColor = useColorModeValue("white", "gray.900");
  return (
    <>
      <Tabs isLazy>
        <TabList>
          <Tab>Media Library</Tab>
          <Tab>Upload Media</Tab>
          <TabIndicator />
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
              <Box pos={"relative"} h={"1px"} bg={"gray.300"}>
                <AbsoluteCenter bg={dividerBgColor} px={2}>
                  <Text>or</Text>
                </AbsoluteCenter>
              </Box>
              <FileUrlUpload />
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
