---
title: "Cursor Rules"
description: "Learn how to manage and organize Cursor rules in your project."
---

# Cursor Rules

## What are Cursor Rules?
Cursor rules are configuration files that help AI assistants understand your codebase better. They provide context and guidelines about your project's structure, coding standards, and best practices.

## Using Cursor Rules with the CLI
When adding cursor rules to your project, you can specify a custom path where the rule should be saved:

```bash
npx ctxs add "https://ctxs.ai/r/gh/[context-id].json" --path .cursor/rules/my-rule.json
```

### Default Location
If no path is specified, the CLI will save the rule to the default location:
```bash
.cursor/rules/[rule-name].json
```

### Custom Paths
You can organize your rules in any directory structure:
- Project-specific rules: `.cursor/rules/project/`
- Team rules: `.cursor/rules/team/`
- Feature-specific rules: `.cursor/rules/features/`

## Best Practices
- Keep rules organized in logical directories
- Use descriptive filenames that reflect the rule's purpose
- Version control your rules alongside your code
- Document any custom organization structure in your project's README

## Integration with Cursor
Cursor will automatically detect and apply rules from the `.cursor/rules/` directory. You can also configure Cursor to look for rules in custom locations through your project settings. 