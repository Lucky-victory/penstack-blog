const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const readline = require('readline');

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}
/**
 * Check if the component is a parent component, e.g Menu Dialog. etc, if it's then we need to export it with it's children/parent
  @param {string} componentName
*/
function checkIfItsAParentComponent(componentName) {

  return 
    if(componentName.startsWith('Menu')){
      return ["Menu",
     "MenuButton",
      "MenuList",
      "MenuItem",
     "MenuItemOption",
      "MenuGroup",
      "MenuOptionGroup",
      "MenuDivider"]
    }
    
   
}

function exportComponent(componentName, outputDir, fileExtension) {
  const filePath = path.join(outputDir, `${componentName}.${fileExtension}`);
  
  const content = `'use client'\n\nexport { ${componentName} } from '@chakra-ui/react'\n`;
  
  fs.writeFileSync(filePath, content);
  console.log(`Exported ${componentName} to ${filePath}`);
}

function validateComponentName(name) {
  return /^[A-Z][a-zA-Z]*$/.test(name);
}

function promptForComponentName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter a valid component name (starting with an uppercase letter and containing only letters): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function processComponent(component, outputDir, fileExtension) {
  let componentName = component;
  while (!validateComponentName(componentName)) {
    console.log('Invalid component name. It must start with an uppercase letter and contain only letters.');
    componentName = await promptForComponentName();
  }
  exportComponent(componentName, outputDir, fileExtension);
}

program
  .name('chakra-exporter')
  .description('Export Chakra UI components to separate files')
  .argument('[components...]', 'Names of the components to export')
  .option('-o, --output <dir>', 'Output directory for component files', 'components/ui')
  .option('-e, --extension <ext>', 'File extension for component files (tsx or jsx)', 'tsx')
  .action(async (components, options) => {
    const outputDir = path.resolve(options.output);
    const fileExtension = options.extension === 'jsx' ? 'jsx' : 'tsx';
    createDirectoryIfNotExists(outputDir);

    if (components.length === 0) {
      const componentName = await promptForComponentName();
      components.push(componentName);
    }

    for (const component of components) {
      await processComponent(component, outputDir, fileExtension);
    }
  });

program.parse();