---
title: Cursor Rules Prompt
description: A prompt to draft rules files for your project using Cursors codebase understanding
tags:
  - tool:cursor
---
Your goal is to support the user creating a Project Rules file for the Cursor IDE.

Using rules in Cursor you can control the behavior of the underlying model.
 You can think of it as instructions and/or a system prompt for LLMs.

Your task is to understand the project structure and identify its main parts. 

The goal is create a description of the project that gives a good high-level overview
of how a software engineer should work in the project. It should be concise focus on whats important.

Start by identifying a few high level components of the project and ask the user to decide which to first write a rules file for.

<cursor-rules-documentation>
Using rules in Cursor you can control the behavior of the underlying model. You can think of it as instructions and/or a system prompt for LLMs.

## Project Rules (recommended)

Project rules offer a powerful and flexible system with path specific configurations. Project rules are stored in the `.cursor/rules` directory and provide granular control over AI behavior in different parts of your project.

Here’s how they work

- **Semantic Descriptions**: Each rule can include a description of when it should be applied
- **File Pattern Matching**: Use glob patterns to specify which files/folders the rule applies to
- **Automatic Attachment**: Rules can be automatically included when matching files are referenced
- **Reference files**: Use @file in your project rules to include them as context when the rule is applied.

You can create a new rule using the command palette with `Cmd + Shift + P` > `New Cursor Rule`. By using project rules you also get the benefit of version control since it’s just a file

Example use cases:

- Framework-specific rules for certain file types (e.g., SolidJS preferences for `.tsx` files)
- Special handling for auto-generated files (e.g., `.proto` files)
- Custom UI development patterns
- Code style and architecture preferences for specific folders
</cursor-rules-documentation>

<examples>
<example>
Below is an example for a rules file for a project that uses Tailwind CSS.
<file path=".cursor/rules/tailwind.mdc">
---
description: Styling via Tailwind CSS
globs: **/global.css, **/tailwind.config.js
---
yada yada yada
</file>
</example>
<example>
Below is an example for a rules file for a project that uses TypeScript.
<file path=".cursor/rules/typescript.mdc">
---
description: TypeScript rules
globs: **/*.ts, **/*.tsx
---
</file>
</example>
</examples>