import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';
import { tagConfigs, allTags } from './src/lib/tags';


// Define metadata type
type PostMetadata = {
  title: string;
  description: string;
  tags: string[];
};

// Define the structure for our output
type PostData = {
  title: string;
  description: string;
  content: string;
  frontmatter: Record<string, any>;
  tags: string[];
  provenance: string;
  targetFile: string;
  createdAt: string;
  attributedGitHubUser: string | null;
  attributedXUser: string | null;
};

// Get the first commit date of a file
const getFirstCommitDate = (filePath: string): string => {
  try {
    // Get the first commit date in ISO format
    const cmd = `git log --follow --format=%aI --reverse "${filePath}" | head -1`;
    const date = execSync(cmd, { encoding: 'utf-8' }).trim();
    return date || new Date().toISOString(); // fallback to current date if no git history
  } catch (error) {
    console.warn(`Could not get git history for ${filePath}:`, error);
    return new Date().toISOString(); // fallback to current date
  }
};

// Process a single markdown file
const processFile = async (filePath: string): Promise<PostData | null> => {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter if present
    const { data: frontmatter, content } = matter(fileContent);
    console.log(frontmatter)

    // Extract directory name for GitHub attribution
    const dirParts = path.dirname(filePath).split(path.sep);
    const dirName = dirParts[dirParts.length - 1];

    // Generate metadata using OpenAI
    console.log(`Generating metadata for ${filePath}...`);

    // Prepare post data
    const postData: PostData = {
      title: frontmatter.title,
      description: frontmatter.description,
      content: content.trim(),
      frontmatter: frontmatter || {},
      tags: frontmatter.tags,
      provenance: frontmatter?.provenance,
      targetFile: frontmatter?.target,
      createdAt: getFirstCommitDate(filePath),
      attributedGitHubUser: dirName || null,
      attributedXUser: frontmatter?.attributedXUser || null,
    };

    console.log(`Processed: ${filePath}`);
    console.log(`Title: ${frontmatter.title}`);
    console.log(`Tags: ${frontmatter.tags?.join(', ')}`);
    return postData;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
};

// Find all markdown files in a directory recursively
const findMarkdownFiles = (dir: string): string[] => {
  const results: string[] = [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`);
    return results;
  }

  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      results.push(...findMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      // Add markdown files to results
      results.push(filePath);
    }
  });

  return results;
};

// Main function to process all files
const convertContextsToJson = async () => {
  try {
    // Define the output file path
    const outputFilePath = path.join(process.cwd(), 'contexts-data.json');

    // Get all markdown files from the contexts directory
    const contextsDir = path.join(process.cwd(), 'contexts');
    const files = findMarkdownFiles(contextsDir);

    if (files.length === 0) {
      console.error('No markdown files found in contexts directory.');
      process.exit(1);
    }

    console.log(`Found ${files.length} markdown files to process`);

    // Process each file
    const results: PostData[] = [];
    for (const file of files) {
      const data = await processFile(file);
      if (data) results.push(data);
    }

    console.log(`Successfully processed ${results.length} out of ${files.length} files`);

    // Write results to JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
    console.log(`Output written to ${outputFilePath}`);

  } catch (error) {
    console.error('Error converting contexts to JSON:', error);
    process.exit(1);
  }
};

// Run the conversion
convertContextsToJson();