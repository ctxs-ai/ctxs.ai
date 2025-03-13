# What is ctxs.ai

ctxs.ai is an open-source, community-curated registry of contexts for use with LLMs.

Users can contribute context data as markdown files via GitHub pull requests.

[Rationale](#rationale) | [Use Cases](#use-cases) | [Contributing](CONTRIBUTING.md) | [Interface](#interface)

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

# How to contribute

See [CONTRIBUTING.md](CONTRIBUTING.md)

# Interface

[`ctxs.ai`](https://ctxs.ai) serves as a public endpoint for the content of this repo.

The URL structure is as follows:

- `/gh/{username}/{context}` for HTML representations
- `/gh/{username}/{context}.txt` for plaintext
- `/r/gh/{username}/{context}.json` for shadcn-style registry
- `/r/index.json` contains all available contexts


## `ctxs` command line

`npx ctxs add` will allow you to add a selection of context windows to your project. 

On the website you will also be able to copy `ctxs` commands that add files to your project. By default files will be written to `ctxs/` in your current directory. Some files will be written to a designated path (e.g. Cursor rules, [example](https://github.com/ctxs-ai/ctxs.ai/blob/main/contexts/danhollick/tailwind-css-v4.md?plain=1)).

```sh
npx ctxs add "https://ctxs.ai/r/gh/danhollick/tailwind-css-v4.json"
```

## HTTP endpoints

For any context on the site you can append `.txt` to the URL to get a plaintext version of the context. This URL can be used with LLMs as a token-efficient way of providing context.

```sh
curl https://ctxs.ai/gh/martinklepsch/babashka.txt
```

Note that currently there is no versioning and context may change. For regular, unsupervised use it is recommended to download contexts in order to preempt prompt injection.

# Inspirations

- Jim Lowin [The Qualified Self](https://www.jlowin.dev/blog/the-qualified-self)
- llms.txt and [llmstxt.directory](https://llmstxt.directory/)
- PatrickJS' [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- Daniel Rosehill Prompt Library (read the [README](https://github.com/danielrosehill/Prompt-Library), it's great)
- `shadcn` CLI experience

# Like this project?

🌟 Star the repo and contribute! 🌟

# Available Contexts

Browse via [ctxs.ai](https://ctxs.ai)