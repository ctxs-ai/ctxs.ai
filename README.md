# What is ctxs.ai

ctxs.ai is an open-source, community-curated directory of contexts for use with LLMs.

Users can contribute context data as markdown files via GitHub pull requests.

# Rationale

- LLMs are trained with huge datasets, constrained by a training cut off date
- Providing more precise context about a project, libraries used, available tools and frameworks improves model performance
- IDEs like Cursor are starting develop their own indexing system but this makes it hard to share what’s working
- Serve as an open-source “deterministic checkpoint” that can be used for evals

# Use Cases

Generally this exists to share context windows and prompts, see what works for others and learn from it.

Specifically for coding use cases:

- Help LLMs work more efficiently in a specific framework
- Define coding style, conventions and formatting
- Provide library documentation in a format suited for LLMs

# The Repository

The repo contains a namespaces tree of markdown files which can be contributed via PR. Each markdown file comes with certain frontmatter (last updated, description, whether it is ai generated, a link to how it was generated)

**Currently you are invited to contribute under your personal namespace** (GitHub username). I would love to see contributions to teach LLMs how to work with specific frameworks, translate code between languages or libraries,

**If you're unsure how to contribute feel free to open an issue with your contribution**.

# How to contribute

ctxs.ai is meant as an open registry for context windows, for now you can add contexts under

```
./contexts/{your github username}/{context-slug}.md
```

To add a file use the following template

```md

---
title: 
description: 
provenance: 
type: "prompt" or "context"
---
the actual context prompt
```

`provenance` is meant to provide some background about how the context window was created (hand written, generated, edited, etc.)

# Interface

For now [`ctxs.ai`](https://ctxs.ai) redirects to this repo. Eventually it will serve as a CDN. Think of `unpkg` for prompts and context windows.

Some ideas:

- A command line script to search and download contexts
- A Model Context Protocol server
- A web UI to browse and download

For now the README will contain a list of all entries.

# Convention Assembler

The `bin/convention-assembler` script helps you combine multiple context files into a single conventions file. It automatically strips frontmatter and concatenates the content.

To install it, symlink it into your PATH:

```bash
ln -s "$(pwd)/bin/convention-assembler" ~/bin/convention-assembler
```

Run without arguments to see available context files:

```bash
./bin/convention-assembler
```

Create a new conventions file from available contexts:

```bash
./bin/convention-assembler user1/context1 user2/context2 > CONVENTIONS.md
```

# Inspirations

- Jim Lowin [The Qualified Self](https://www.jlowin.dev/blog/the-qualified-self)
- llms.txt and [llmstxt.directory](https://llmstxt.directory/)
- PatrickJS' [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- Daniel Rosehill Prompt Library (read the [README](https://github.com/danielrosehill/Prompt-Library), it's great)
- `shadcn` CLI experience

# Like this project?

🌟 Star the repo and contribute! 🌟

# Available Contexts

Browse via GitHub for now (type <kbd>t</kbd> now). Will fix soon :-)

All contexts can also be retrieved via `curl`, e.g.

```
curl https://ctxs.ai/gh/martinklepsch/babashka
```
