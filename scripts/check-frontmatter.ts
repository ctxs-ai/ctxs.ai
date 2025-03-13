import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

// Define required frontmatter keys
const REQUIRED_KEYS = ['tags', 'description', 'title'];

// Valid tags from context-tags.tsx
const VALID_TAGS = [
  'tool:cursor',
  'tool:claude-code',
  'tool:windsurf',
  'lang:clojure',
  'lib:react',
  'lib:tailwindcss',
  'lib:astro',
  'lib:nextjs',
  'platform:cloudflare',
  'platform:vercel',
  'platform:aws',
  'platform:gcp',
];

interface FrontmatterIssue {
  file: string;
  missingKeys: string[];
}

async function scanMarkdownFiles() {
  const files = await glob('./contexts/**/*.md');
  const issues: FrontmatterIssue[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter } = matter(content);

    const missingKeys = REQUIRED_KEYS.filter(key => !frontmatter[key]);

    if (missingKeys.length > 0) {
      issues.push({
        file: path.relative(process.cwd(), file),
        missingKeys
      });
    }
  }

  return issues;
}

function generatePrompt(issues: FrontmatterIssue[]) {
  const filesSection = issues.map(issue => {
    return `- ${issue.file}
  Missing keys: ${issue.missingKeys.join(', ')}`;
  }).join('\n');

  const prompt = `Please add the missing frontmatter to the following markdown files. Each file should have the following required keys: ${REQUIRED_KEYS.join(', ')}.

For the 'tags' field, please use one or more of the following valid tags:
${VALID_TAGS.map(tag => `- ${tag}`).join('\n')}

<files>
${filesSection}
</files>

Please maintain any existing frontmatter values and only add the missing keys. When adding tags, please ensure they are relevant to the content of each file.`;

  return prompt;
}

async function main() {
  const issues = await scanMarkdownFiles();
  if (issues.length === 0) {
    console.log('No issues found! All markdown files have the required frontmatter.');
    return;
  }

  const prompt = generatePrompt(issues);
  console.log(prompt);
}

main().catch(console.error); 