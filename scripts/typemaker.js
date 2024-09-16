import fs from "fs"
import path from 'path';
import pluralize from 'pluralize';
import jsonToTS from "json-to-ts";


/**
 * This function generates ts files from a folder with jsons inside.
 * This script is adapted to run under Node commandline
 *
 * @param {String} inputDir
 * @param {String} outputDir
 */
export const generateTypesFromJSONFiles = (inputDir, outputDir) => {
    // Iteration over directory JSONs (Filtering the files that are not JSONs)
    const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.json'));
    files.forEach(file => {
        // Getting the filepath
        const filePath = path.join(inputDir, file);

        // Converting plural JSON names to singular because convention
        const outputFileName = pluralize.singular(file.split('.')[0]) + '.d.ts';

        // Getting TS inteface rootName
        const rootName = outputFileName.split('.')[0]

        // Reading the JSON file and parsing it into a JS Object 
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Generating the types using jsonToTS library
        const types = jsonToTS(jsonContent,{rootName: rootName});
        
        // Building the output directory path
        const outputFilePath = path.join(outputDir, outputFileName);

        // Writting the file
        fs.writeFileSync(outputFilePath, types.join('\n\n'), 'utf8');


        console.log(`Types generated from ${file} to: ${outputFilePath}`);
    });
};


// This is for calling the function using the console.
// Intended to use via npm run

// Gettings parametters from the commandline
const args = process.argv.slice(2);
const inputDir = args[0];
const outputDir = args[1];

// Parameters validation
if (!inputDir || !outputDir) {
    console.error('Please provide a Input directory and a Output directory:');
    console.error('Example: node generateTypes.js ./jsons ./types');
    process.exit(1);
}

// Creating Output folder if not exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Calling the function
generateTypesFromJSONFiles(inputDir, outputDir);