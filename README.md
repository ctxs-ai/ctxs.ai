# What is ctxs.ai

ctxs.ai is an open-source, community-curated directory of contexts for use with LLMs.

Users can contribute context data as markdown files via GitHub pull requests.

# Rationale

- LLMs are trained with huge datasets, especially when coding the important bits may not be up to date
- Providing more precise context about the project, libraries used, available tools and frameworks improves model performance
- IDEs like cursor are starting develop their own indexing system but this makes it hard to share what’s working
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

# Interface

For now [`ctxs.ai`](https://ctxs.ai) redirects to this repo. Eventually it will serve as a CDN. Think of `unpkg` for prompts and context windows.

Some ideas:

- A command line script to search and download contexts
- A web UI to browse and download

For now the README will contain a list of all entries.

# Inspirations

In order of discovery -

- Jim Lowin [The Qualified Self](https://www.jlowin.dev/blog/the-qualified-self)
- Cursor Notebooks & `.cursorrules`
- Daniel Rosehill Prompt Library (read the [README](https://github.com/danielrosehill/Prompt-Library), it's great)

# Available Contexts

Browse via GitHub for now. Will fix soon :-)
