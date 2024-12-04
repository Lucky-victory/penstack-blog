"use client";

import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Card,
  CardBody,
  Switch,
  Divider,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function SettingsPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Implementation for saving settings
      toast({
        title: "Settings saved successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Settings</Heading>
      <Card rounded={{ base: 20, md: 24 }}>
        <CardBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>General</Tab>
              <Tab>Analytics</Tab>
              <Tab>Monitoring</Tab>
              <Tab>Media</Tab>
              <Tab>Advanced</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Site Name</FormLabel>
                    <Input rounded="full" placeholder="My Awesome Blog" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Site Description</FormLabel>
                    <Input
                      rounded="full"
                      placeholder="A brief description of your site"
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Maintenance Mode</FormLabel>
                    <Switch />
                  </FormControl>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack>
                    <FormControl>
                      <FormLabel>Google Analytics 4 Measurement ID</FormLabel>
                      <Input rounded="full" placeholder="G-XXXXXXXXXX" />
                    </FormControl>
                    <HStack>
                      <Text>Enable</Text>
                      <Switch isChecked />
                    </HStack>
                  </HStack>
                  <HStack>
                    <FormControl>
                      <FormLabel>Google Tag Manager ID</FormLabel>
                      <Input rounded="full" placeholder="GTM-XXXXXXX" />
                    </FormControl>
                    <HStack>
                      <Text>Enable</Text>
                      <Switch isChecked />
                    </HStack>
                  </HStack>
                  <HStack>
                    <FormControl>
                      <FormLabel>PostHog API Key</FormLabel>
                      <Input
                        rounded="full"
                        placeholder="phc_XXXXXXXXXXXXXXXXXX"
                      />
                    </FormControl>
                    <HStack>
                      <Text>Enable</Text>
                      <Switch isChecked />
                    </HStack>
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack>
                    <FormControl>
                      <FormLabel>Sentry DSN</FormLabel>
                      <Input
                        rounded="full"
                        placeholder="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
                      />
                    </FormControl>
                    <HStack>
                      <Text>Enable</Text>
                      <Switch isChecked />
                    </HStack>
                  </HStack>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Enable Error Tracking</FormLabel>
                    <Switch />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Enable Performance Monitoring</FormLabel>
                    <Switch />
                  </FormControl>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Cloudinary Cloud Name</FormLabel>
                    <Input rounded="full" placeholder="your-cloud-name" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Max Upload Size (MB)</FormLabel>
                    <Input rounded="full" type="number" defaultValue={10} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Default Media Folder</FormLabel>
                    <Input rounded="full" placeholder="uploads" />
                  </FormControl>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>API Rate Limit</FormLabel>
                    <Input rounded="full" type="number" defaultValue={100} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Cache Duration (minutes)</FormLabel>
                    <Input rounded="full" type="number" defaultValue={5} />
                  </FormControl>
                  <Box>
                    <Button colorScheme="red" variant="outline">
                      Clear Cache
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Divider my={6} />

          <Box display="flex" justifyContent="flex-end">
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              onClick={handleSave}
              rounded="full"
            >
              Save Changes
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
}
