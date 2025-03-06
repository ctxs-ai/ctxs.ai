#!/usr/bin/env bun

// This script helps maintaining consistent frontmatter in the context files in this repository
// It can be used to check for missing frontmatter keys and to generate missing values using `llm`

import fs from 'fs';
import { program } from 'commander';
import { Command } from '@commander-js/extra-typings';
import yaml from 'js-yaml';
import { globSync } from 'glob';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

// Define CLI options
program
  .option('--files <files...>', 'Individual markdown files to process')
  .option('-p, --pattern <pattern>', 'Regex pattern to match markdown files (e.g. "contexts/**/*.md")')
  .option('--force', 'Force re-generation', false)
  .option('--dry-run', 'Print what would be changed without making changes', false)
  .option('--verbose', 'Print additional information during processing', false)
  .option('--model <model>', 'LLM model to use with llm CLI', 'claude-3-7-sonnet-latest')
  .option('--fix', 'Automatically fix missing frontmatter using LLM', false);

// Define required frontmatter keys
const REQUIRED_FRONTMATTER_KEYS = [
  'description', 'token_count'
] as const;

type RequiredKey = typeof REQUIRED_FRONTMATTER_KEYS[number];

// Prompts for generating missing values
const PROMPTS: Record<RequiredKey, string> = {
  description: `The following text is documentation for achieving a specific goal. 
Create a 100 character description of the goal starting with a verb.
Do not include a period at the end of the description.

Examples:
- Craft web animations with appropriate timing and easing functions
- Build Astro sites with Shadcn, Tailwind and TypeScript

Be specific and avoid generic language like 'seamless integration',
'facilitate', 'simplify'.

%s`
};

interface Options {
  model?: string;
  verbose?: boolean;
  dryRun?: boolean;
  fix?: boolean;
  force?: boolean;
  files?: string[];
  pattern?: string;
}

/**
 * Extracts YAML frontmatter from markdown content.
 * Returns [frontmatter, remainingContent] or null if no frontmatter found.
 */
function extractFrontmatter(content: string): [string, string] | null {
  if (content.startsWith('---\n')) {
    const endIdx = content.indexOf('\n---\n', 4);
    if (endIdx !== -1) {
      const frontmatter = content.substring(4, endIdx);
      const remaining = content.substring(endIdx + 5);
      return [frontmatter, remaining];
    }
  }
  return null;
}

/**
 * Generate a value for a missing frontmatter key using LLM
 */
async function generateKeyValue(key: RequiredKey, content: string, model: string): Promise<string> {
  const prompt = PROMPTS[key].replace('%s', content.trim());
  const system = "You are an expert at analyzing technical content and extracting summary information.";

  const anthropicModel = anthropic(model);
  const { text } = await generateText({
    model: anthropicModel,
    ...(system ? { system } : {}),
    prompt,
  });
  return text.trim();
}

/**
 * Check if frontmatter has required keys and returns an array of missing keys
 */
function missingFrontmatter(frontmatter: Record<string, unknown>): RequiredKey[] {
  return REQUIRED_FRONTMATTER_KEYS.filter(key => {
    return !frontmatter[key] || frontmatter[key].toString().trim() === '';
  });
}

/**
 * Updates the frontmatter by adding missing required keys using LLM
 */
async function updateFrontmatterWithLlm(filePath: string, keysToGenerate: RequiredKey[], options: Options): Promise<[boolean, string]> {
  const { model, verbose, dryRun } = options;
  const markdownStr = fs.readFileSync(filePath, 'utf-8');
  const extracted = extractFrontmatter(markdownStr);

  if (!extracted) {
    return [false, markdownStr];
  }

  const [frontmatterStr, content] = extracted;
  let frontmatterData: Record<string, unknown> = yaml.load(frontmatterStr) as Record<string, unknown> || {};

  if (keysToGenerate.length > 0) {
    for (const key of keysToGenerate) {
      if (verbose) {
        console.log(`🤖 Generating ${key} for ${filePath}`);
      }

      let generatedValue;
      if (dryRun) {
        generatedValue = `[Would generate ${key} using LLM]`;
      } else {
        generatedValue = await generateKeyValue(key, `${frontmatterStr}\n\n${content}`, model);
      }

      frontmatterData[key] = generatedValue;
    }

    // Configure yaml dump to match flow-style:block behavior
    const newFrontmatter = yaml.dump(frontmatterData, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      flowLevel: -1 // Use block style similar to :block in clj-yaml
    });

    return [true, `---\n${newFrontmatter}---\n${content}`];
  }

  return [false, markdownStr];
}

/**
 * Check a single markdown file for missing frontmatter
 */
async function checkFile(file: string, options: Options): Promise<void> {
  const { fix, verbose, dryRun, force } = options;
  const filePath = file.toString();
  const content = fs.readFileSync(filePath, 'utf-8');

  let hasFrontmatter = false;
  let frontmatterData: Record<string, unknown> = {};

  const extracted = extractFrontmatter(content);
  if (extracted) {
    hasFrontmatter = true;
    frontmatterData = yaml.load(extracted[0]) as Record<string, unknown> || {};
  }

  let missingKeys: RequiredKey[];
  if (force) {
    missingKeys = [...REQUIRED_FRONTMATTER_KEYS];
  } else if (hasFrontmatter) {
    missingKeys = missingFrontmatter(frontmatterData);
  } else {
    missingKeys = [...REQUIRED_FRONTMATTER_KEYS];
  }

  if (verbose) {
    console.log(`📝 Checking ${filePath}`);
  }

  if (!hasFrontmatter) {
    fs.writeFileSync(filePath, `---\n---\n${content}`);
    if (fix) {
      return checkFile(file, options);
    }
    return;
  }

  if (missingKeys.length > 0) {
    console.log(`⚠️ Missing required frontmatter keys in ${filePath}:`);
    for (const key of missingKeys) {
      console.log(`   - ${key}`);
    }

    if (fix) {
      const [updated, updatedContent] = await updateFrontmatterWithLlm(filePath, missingKeys, options);

      if (updated && updatedContent) {
        console.log(`🔄 Generated values for ${missingKeys.join(', ')}`);

        if (extracted) {
          const [newFrontmatter] = extractFrontmatter(updatedContent) || [''];
          const updatedFrontmatter = yaml.load(newFrontmatter) || {};
          for (const key of missingKeys) {
            console.log(`   - ${key}: "${(updatedFrontmatter as Record<string, string>)[key]}"`);
          }
        }

        if (!dryRun) {
          fs.writeFileSync(filePath, updatedContent);
        }
      }
    } else {
      console.log('ℹ️ Use --fix to automatically generate missing values');
    }
  } else if (verbose) {
    console.log(`✅ All required frontmatter keys present in ${filePath}`);
  }
}

/**
 * Process multiple markdown files based on CLI options
 */
async function processFiles(options: Options): Promise<void> {
  const { files = [], pattern } = options;

  let patternFiles: string[] = [];
  if (pattern) {
    patternFiles = globSync(pattern);
  }

  const allFiles = [...files, ...patternFiles];

  console.log(allFiles);

  if (allFiles.length > 0) {
    if (options.verbose) {
      console.log(`🔍 Found ${allFiles.length} files to process`);
    }

    for (const file of allFiles) {
      await checkFile(file, options);
    }

    console.log('✨ Processing complete!');
  } else {
    console.log('⚠️ No markdown files found to process');
  }
}

// Main function
async function main() {
  program.parse(process.argv);
  const options = program.opts();

  if (options.help) {
    console.log('Options: ', program.opts());
    return;
  }

  await processFiles(options);
}

// Run main if this is the main script
if (import.meta.path === Bun.main) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}
