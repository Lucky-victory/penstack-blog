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
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SiteSettings } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DashHeader from "../../../Dashboard/Header";
import { DEFAULT_SETTINGS } from "../../../../../lib/settings/config";
import { useSiteConfig } from "@/src/hooks/useSiteConfig";

export default function SettingsPage() {
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const settingsContext = useSiteConfig();
  const [settings, setSettings] = useState<SiteSettings>(settingsContext);

  const { data, isFetching } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  async function fetchSettings() {
    try {
      const { data } = await axios<{ data: SiteSettings; message?: string }>(
        "/api/settings"
      );
      const fetchedData = data.data;
      setSettings({ ...fetchedData });
    } catch (error) {
      toast({
        title: "Failed to load settings",
        status: "error",
        duration: 3000,
      });
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

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
    <Box>
      <DashHeader></DashHeader>
      <Container maxW="container.xl" py={8}>
        <Heading mb={6}>Settings</Heading>
        <Card rounded={"lg"}>
          <CardBody>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>General</Tab>
                <Tab>Analytics</Tab>
                <Tab>Monitoring</Tab>
                <Tab>Media</Tab>
                <Tab>Email (Resend)</Tab>
                <Tab>Advanced</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Site Name</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.siteName.value}
                        onChange={(e) =>
                          handleInputChange("siteName", e.target.value)
                        }
                        placeholder="My Awesome Blog"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Site Description</FormLabel>
                      <Textarea
                        maxH={110}
                        maxW={600}
                        rounded="md"
                        value={settings.siteDescription.value}
                        onChange={(e) =>
                          handleInputChange("siteDescription", e.target.value)
                        }
                        placeholder="A brief description of your site"
                      />
                    </FormControl>
                    <Box>
                      <FormControl>
                        <FormLabel>Site Logo</FormLabel>
                        <FormHelperText>
                          Recommended size 500x500
                        </FormHelperText>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl>
                        <FormLabel>Site Favicon</FormLabel>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl>
                        <FormLabel>Site Opengraph Image</FormLabel>
                      </FormControl>
                    </Box>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb={0}>Maintenance Mode</FormLabel>
                      <Switch
                        isChecked={settings.maintenanceMode.enabled}
                        onChange={() => handleToggle("maintenanceMode")}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Google Analytics 4 Measurement ID</FormLabel>
                      <HStack mb={1}>
                        <Text>
                          {settings.gaId.enabled ? "Enabled" : "Disabled"}
                        </Text>
                        <Switch
                          isDisabled={!settings.gaId.value}
                          isChecked={settings.gaId.enabled}
                          onChange={() => handleToggle("gaId")}
                        />
                      </HStack>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.gaId.value}
                        onChange={(e) =>
                          handleInputChange("gaId", e.target.value)
                        }
                        placeholder="G-XXXXXXXXXX"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Google Tag Manager ID</FormLabel>
                      <HStack mb={1}>
                        <Text>
                          {settings.gtmId.enabled ? "Enabled" : "Disabled"}
                        </Text>
                        <Switch
                          isDisabled={!settings.gtmId.value}
                          isChecked={settings.gtmId.enabled}
                          onChange={() => handleToggle("gtmId")}
                        />
                      </HStack>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.gtmId.value}
                        onChange={(e) =>
                          handleInputChange("gtmId", e.target.value)
                        }
                        placeholder="GTM-XXXXXXX"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>PostHog API Key</FormLabel>
                      <HStack mb={1}>
                        <Text>
                          {settings.posthogKey.enabled ? "Enabled" : "Disabled"}
                        </Text>
                        <Switch
                          isDisabled={!settings.posthogKey.value}
                          isChecked={settings.posthogKey.enabled}
                          onChange={() => handleToggle("posthogKey")}
                        />
                      </HStack>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.posthogKey.value}
                        onChange={(e) =>
                          handleInputChange("posthogKey", e.target.value)
                        }
                        placeholder="phc_XXXXXXXXXXXXXXXXXX"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Sentry DSN</FormLabel>
                      <HStack mb={1}>
                        <Text>
                          {settings.sentryDsn.enabled ? "Enabled" : "Disabled"}
                        </Text>
                        <Switch
                          isDisabled={!settings.sentryDsn.value}
                          isChecked={settings.sentryDsn.enabled}
                          onChange={() => handleToggle("sentryDsn")}
                        />
                      </HStack>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.sentryDsn.value}
                        onChange={(e) =>
                          handleInputChange("sentryDsn", e.target.value)
                        }
                        placeholder="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
                      />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb={0}>Enable Error Tracking</FormLabel>
                      <Switch
                        isChecked={settings.errorTracking.enabled}
                        onChange={() => handleToggle("errorTracking")}
                      />
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb={0}>
                        Enable Performance Monitoring
                      </FormLabel>
                      <Switch
                        isChecked={settings.performanceMonitoring.enabled}
                        onChange={() => handleToggle("performanceMonitoring")}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Cloudinary Cloud Name</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.cloudinaryName.value}
                        onChange={(e) =>
                          handleInputChange("cloudinaryName", e.target.value)
                        }
                        placeholder="your-cloud-name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Max Upload Size (MB)</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        type="number"
                        value={settings.maxUploadSize.value}
                        onChange={(e) =>
                          handleInputChange("maxUploadSize", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Default Media Folder</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        value={settings.defaultMediaFolder.value}
                        onChange={(e) =>
                          handleInputChange(
                            "defaultMediaFolder",
                            e.target.value
                          )
                        }
                        placeholder="uploads"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>From Email</FormLabel>
                      <FormHelperText>
                        The address to send emails from
                      </FormHelperText>
                      <Input
                        maxW={600}
                        rounded="md"
                        mt={2}
                        type="email"
                        value={settings.emailFrom.value}
                        onChange={(e) =>
                          handleInputChange("emailFrom", e.target.value)
                        }
                        placeholder="noreply@example.com"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>From Name</FormLabel>
                      <FormHelperText>
                        The title to display in the from field of emails
                      </FormHelperText>

                      <Input
                        mt={2}
                        maxW={600}
                        rounded="md"
                        placeholder="My Blog"
                        value={settings.emailFromName.value}
                        onChange={(e) =>
                          handleInputChange("emailFromName", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Newsletter From Email (optional)</FormLabel>
                      <FormHelperText>
                        The address to send newsletter emails from
                      </FormHelperText>

                      <Input
                        maxW={600}
                        mt={2}
                        rounded="md"
                        value={settings.newsletterEmailFrom.value}
                        onChange={(e) =>
                          handleInputChange(
                            "newsletterEmailFrom",
                            e.target.value
                          )
                        }
                        placeholder="newsletter@example.com"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>API Rate Limit</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        type="number"
                        value={settings.apiRateLimit.value}
                        onChange={(e) =>
                          handleInputChange("apiRateLimit", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Cache Duration (minutes)</FormLabel>
                      <Input
                        maxW={600}
                        rounded="md"
                        type="number"
                        value={settings.cacheDuration.value}
                        onChange={(e) =>
                          handleInputChange("cacheDuration", e.target.value)
                        }
                      />
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
                rounded="md"
              >
                Save Changes
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
