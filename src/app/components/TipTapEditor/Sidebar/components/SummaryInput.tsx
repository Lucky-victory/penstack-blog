import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { SummaryInputProps } from "../types";
import React, { useState } from "react";

export const SummaryInput = ({ activePost }: SummaryInputProps) => {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setValue(val);
  }
  return (
    <FormControl>
      <FormLabel>Summary:</FormLabel>
      <Textarea
        placeholder="summary"
        name="summary"
        value={value}
        onChange={handleChange}
        maxH={150}
        rounded="lg"
      />
    </FormControl>
  );
};
