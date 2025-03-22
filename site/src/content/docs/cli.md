---
title: "CLI"
description: "Learn how to use the ctxs CLI to manage and apply context rules."
---

# CLI

## Getting Started
The ctxs CLI tool allows you to seamlessly integrate context rules into your development workflow. It provides built-in support for managing and applying Cursor rules directly from your terminal.

## Installation
You can use npx to run the CLI without installation:
```bash
npx ctxs [command]
```

## Adding Context Rules
To add a context rule to your codebase, use the following command:
```bash
npx ctxs add "https://ctxs.ai/r/gh/[context-id].json"
```

This will:
- Download the context rule
- Validate its contents
- Add it to your project's configuration

## Features
- Seamless integration with your development workflow
- Built-in support for Cursor rules
- Easy sharing and importing of context rules
- Version control friendly

## Coming Soon
MCP server integration is in development and will provide additional features for managing and synchronizing your context rules across your team. 