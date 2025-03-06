import { Workflow } from '@mastra/core';
import type { StepExecutionContext } from '@mastra/core';
import { anthropic } from '@ai-sdk/anthropic';

interface FrontmatterInput {
  content: string;
  missingKeys: string[];
}

interface FrontmatterOutput {
  [key: string]: string;
}

export const completeFrontmatterWorkflow = new Workflow({
  name: 'complete-frontmatter',
  input: {} as FrontmatterInput,
  output: {} as FrontmatterOutput,
  steps: [
    {
      name: 'inferKeys',
      run: async (input: FrontmatterInput, context: StepExecutionContext) => {
        const tasks = input.missingKeys.map(async (key: string) => {
          const prompt = `Given the following markdown content, please infer an appropriate value for the frontmatter key "${key}". Only respond with the value, no explanation.

Content:
${input.content}`;

          const completion = await anthropic.messages.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'claude-3-sonnet-20240229',
            max_tokens: 100,
          });

          return { [key]: completion.content[0].text.trim() };
        });

        const results = await Promise.all(tasks);
        return Object.assign({}, ...results);
      },
    },
  ],
}); 