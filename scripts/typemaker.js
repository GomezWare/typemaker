const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

// Función para leer todos los archivos JSON de un directorio
const readJSONFilesFromDirectory = (directory) => {
    const files = fs.readdirSync(directory);
    return files.filter(file => file.endsWith('.json'))
                .map(file => ({
                    name: file.replace('.json', ''),
                    content: JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'))
                }));
};

// Mapa para almacenar las interfaces generadas para reutilización
const interfaceMap = new Map();

// Función para generar un nombre de interfaz para objetos anidados, evitando colisiones
const generateInterfaceName = (key, parentKey = '', level = 0) => {
    return `${parentKey ? parentKey.charAt(0).toUpperCase() + parentKey.slice(1) : ''}${key.charAt(0).toUpperCase() + key.slice(1)}${level}`;
};

// Función para detectar si una propiedad es opcional
const isOptional = (obj, key) => {
    return obj[key] === null || obj[key] === undefined;
};

// Función para convertir los valores de JSON a tipos de TypeScript
const jsonToTSType = (key, value, parentKey = '', level = 0) => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        return `${jsonToTSType(key, value[0], key, level + 1)}[]`;
    }

    switch (typeof value) {
        case 'string': return 'string';
        case 'number': return 'number';
        case 'boolean': return 'boolean';
        case 'object': {
            if (value !== null && typeof value === 'object') {
                const interfaceName = generateInterfaceName(key, parentKey, level);
                if (!interfaceMap.has(interfaceName)) {
                    const interfaceBody = createInterfaceFromObject(value, key, level + 1);
                    interfaceMap.set(interfaceName, interfaceBody);
                }
                return interfaceName;
            }
            return 'any';
        }
        default:
            return 'any';
    }
};

// Función para generar interfaces de TypeScript a partir de un objeto
const createInterfaceFromObject = (obj, parentKey = '', level = 0) => {
    return `{ ${Object.keys(obj).map(key => {
        const optional = isOptional(obj, key) ? '?' : '';
        return `${key}${optional}: ${jsonToTSType(key, obj[key], parentKey, level)};`;
    }).join(' ')} }`;
};

// Función principal para generar tipos
const generateTypesFromJSON = (inputDir, outputFile) => {
    const jsonFiles = readJSONFilesFromDirectory(inputDir);

    jsonFiles.forEach(file => {
        const interfaceName = pluralize.singular(file.name.charAt(0).toUpperCase() + file.name.slice(1));  // Singularizar el nombre de la interfaz
        const interfaceBody = createInterfaceFromObject(file.content);
        interfaceMap.set(interfaceName, interfaceBody);
    });

    // Crear contenido con todas las interfaces generadas
    let allInterfaces = '';
    interfaceMap.forEach((body, name) => {
        allInterfaces += `export interface ${name} ${body}\n\n`;
    });

    // Escribir el archivo de salida con el nombre especificado
    fs.writeFileSync(outputFile, allInterfaces, 'utf8');
    console.log(`Tipos generados correctamente en: ${outputFile}`);
};

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const inputDir = args[0];  // Primer argumento: directorio de entrada
const outputFile = args[1];  // Segundo argumento: archivo de salida

// Validar que se han pasado los argumentos necesarios
if (!inputDir || !outputFile) {
    console.error('Por favor, proporciona un directorio de entrada y un archivo de salida.');
    console.error('Ejemplo de uso: node ./scripts/typemaker.js ./data ./src/types/output.ts');
    process.exit(1);
}

// Ejecutar la función con los argumentos proporcionados
generateTypesFromJSON(inputDir, outputFile);
