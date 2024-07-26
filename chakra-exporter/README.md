# Chakra Exporter

A command-line tool to export Chakra UI components to separate files.

## Installation


npm install chakra-exporter


## Usage


npx chakra-exporter <components...> [options]


### Arguments

- `<components...>`: Names of the components to export (required)

### Options

- `-o, --output <dir>`: Output directory for component files (default: "components/ui")
- `-e, --extension <ext>`: File extension for component files (tsx or jsx) (default: "tsx")

### Examples


npx chakra-exporter Button Input Checkbox -o src/components -e jsx


This command will export the Button, Input, and Checkbox components to separate files in the `src/components` directory with a `.jsx` extension.

## Features

- Exports Chakra UI components to individual files
- Supports both TypeScript (.tsx) and JavaScript (.jsx) file extensions
- Creates the output directory if it doesn't exist
- Validates component names (must start with an uppercase letter and contain only letters)

## File Structure

The exported component files will have the following structure:


'use client'

export { ComponentName } from '@chakra-ui/react'


## Error Handling

The tool provides error messages for invalid component names and any issues that occur during the export process.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
