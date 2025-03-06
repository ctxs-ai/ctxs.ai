import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { completeFrontmatterWorkflow } from '../workflows/frontmatter';

const REQUIRED_FRONTMATTER_KEYS = [
  'title',
  'description',
  'tags',
  'date',
  'status'
] as const;

type RequiredFrontmatter = {
  title: string;
  description: string;
  tags: string[];
  date: string;
  status: 'draft' | 'published';
}

async function processMdFile(filePath: string): Promise<void> {
  const content = await readFile(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(content);

  // Check for missing required keys
  const missingKeys = REQUIRED_FRONTMATTER_KEYS.filter(
    key => !(key in frontmatter)
  );

  if (missingKeys.length === 0) {
    console.log(`✓ ${path.basename(filePath)} has all required frontmatter`);
    return;
  }

  console.log(`Processing ${path.basename(filePath)}...`);
  console.log(`Missing keys: ${missingKeys.join(', ')}`);

  // Run the workflow to complete missing frontmatter
  const result = await completeFrontmatterWorkflow.start({
    content: markdownContent,
    missingKeys,
  });

  // Merge existing and new frontmatter
  const updatedFrontmatter = {
    ...frontmatter,
    ...result.output,
  };

  // Create updated content with new frontmatter
  const updatedContent = matter.stringify(markdownContent, updatedFrontmatter);
  await writeFile(filePath, updatedContent);

  console.log(`✓ Updated ${path.basename(filePath)} with new frontmatter`);
}

export async function completeFrontmatter(): Promise<void> {
  try {
    const files = await glob('contexts/**/*.md');

    for (const file of files) {
      await processMdFile(file);
    }
  } catch (error) {
    console.error('Error processing markdown files:', error);
    process.exit(1);
  }
} 