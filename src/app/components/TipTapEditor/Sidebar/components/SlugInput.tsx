import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState, useCallback, ChangeEvent, memo } from "react";
import slugify from "slugify";

export const SlugInput = memo(
  ({ slug, onChange }: { slug: string; onChange: (val: string) => void }) => {
    const [field, setField] = useState(slug || "");
    const [isSlugEditable, setIsSlugEditable] = useState(false);
    const onChangeCb = useCallback(
      (value: string) => {
        onChange?.(value);
      },
      [onChange]
    );
    const handleChange = useCallback(
      (evt: ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target;
        const newSlug = slugify(value, {
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        });
        setField(newSlug);
        onChangeCb?.(newSlug);
      },
      [onChangeCb]
    );
    return (
      <FormControl>
        <FormLabel>URL friendly title:</FormLabel>
        <InputGroup>
          <Input
            placeholder="Slug"
            name="slug"
            value={field}
            autoComplete="off"
            onChange={handleChange}
            isDisabled={!isSlugEditable}
            onBlur={() => setIsSlugEditable(false)}
            rounded="xl"
            pr={1}
          />
          {!isSlugEditable && (
            <InputRightElement roundedRight="xl">
              <Button
                size="sm"
                variant="ghost"
                fontWeight={500}
                onClick={() => setIsSlugEditable(true)}
              >
                Edit
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>
    );
  }
);
