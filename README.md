# JSON to TypeScript Generator

This Node.js script generates TypeScript definition (`.d.ts`) files from JSON files. It converts JSON data into TypeScript interfaces using the `json-to-ts` library and saves the generated interfaces to a specified output directory. This tool is useful for automatically generating TypeScript types from API responses or other JSON data.

## Features

- **JSON to TypeScript Conversion**: Converts JSON structures into TypeScript interfaces.
- **Singular Naming Convention**: Ensures that the output interface filenames follow the singular naming convention (e.g., `users.json` → `user.d.ts`).
- **Easy Command Line Usage**: Can be used as an npm script or run directly from the command line.
- **Automatic Directory Handling**: Creates the output directory if it does not exist.

## Prerequisites

- Node.js installed on your system
- `npm` for managing packages

## Installation

1. Clone the repository or copy the script into your project.
2. Install the required dependencies by running:

   ```bash
   npm install json-to-ts pluralize
   ```

## License

This project is licensed under the MIT License.