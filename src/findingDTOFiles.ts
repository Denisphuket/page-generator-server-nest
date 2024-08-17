import * as fs from 'fs-extra';
import * as path from 'path';
import glob from 'glob-promise'; // Используем glob-promise

async function generateDtoImports() {
  const dtosPath = path.join(__dirname, '**', '*.dto.ts');
  const outputPath = path.join(__dirname, 'swagger-dtos.ts');

  try {
    const files: string[] = await glob(dtosPath); // Прямое использование, возвращающее промис

    const imports = files.map((file, index) => {
      const relativePath = path.relative(path.dirname(outputPath), file);
      const importPath = relativePath.replace(/\\/g, '/').replace('.ts', '');
      return `import * as DTO${index} from '${importPath}';`;
    });

    // console.log('Imports', imports);

    const content = `${imports.join('\n')}\n\nexport const DTOS = [${imports.map((_, index) => `DTO${index}`).join(', ')}];`;

    await fs.outputFile(outputPath, content);
    // console.log(`Generated ${files.length} DTO imports in ${outputPath}`);
  } catch (err) {
    console.error('Error finding DTO files:', err);
  }
}

generateDtoImports();
