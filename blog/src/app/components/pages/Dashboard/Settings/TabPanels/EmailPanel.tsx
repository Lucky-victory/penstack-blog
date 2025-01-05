import {
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { SiteSettings } from "@/src/types";

interface EmailPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
}

export const EmailPanel = ({
  settings,
  handleInputChange,
}: EmailPanelProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>From Email</FormLabel>
        <FormHelperText>The address to send emails from</FormHelperText>
        <Input
          maxW={600}
          rounded="md"
          mt={2}
          type="email"
          value={settings.emailFrom.value}
          onChange={(e) => handleInputChange("emailFrom", e.target.value)}
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
          onChange={(e) => handleInputChange("emailFromName", e.target.value)}
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
            handleInputChange("newsletterEmailFrom", e.target.value)
          }
          placeholder="newsletter@example.com"
        />
      </FormControl>
    </VStack>
  );
};
