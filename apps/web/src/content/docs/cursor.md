---
title: "Cursor Rules"
description: "Learn how to manage and organize Cursor rules in your project."
---

# Cursor Rules

## What are Cursor Rules?
Cursor rules are configuration files that help AI assistants understand your codebase better. They provide context and guidelines about your project's structure, coding standards, and best practices.

## Rules Files & ctxs
Some uploads to ctxs will have special metadata that tells the CLI to add a file to `.cursor/rules/`. The CLI does not need any specific arguments.

```bash
npx ctxs add "https://ctxs.ai/cli/registry-item/urn:ctxs:gh:martinklepsch:qdg6m0.json"
```

## Integration with Cursor
Cursor will automatically detect and apply rules from the `.cursor/rules/` directory. You can also configure Cursor to look for rules in custom locations through your project settings. 