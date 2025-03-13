# Contributing context windows and prompts

ctxs.ai is meant as an open registry for context windows, for now you can add contexts under your username.

## Why contribute?



## The quick & easy way

You can [open an issue](https://github.com/ctxs-ai/ctxs.ai/issues/new?template=new-context.md) following the provided template and we'll integrate your context window into the registry. 

No need to:

- clone the repo
- edit files
- open a PR
- understand the registry structure


## The proper way

All contexts are stored following the pattern below:

```
./contexts/{your github username}/{context-slug}.md
```

You can open pull requests adding to the `contexts/` directory under your username.

Below is an example of what the file could look like:

```md
---
title: Working with xyz
description: Condensed docs of xyz
provenance: Compiled based on xyz.com/docs
---
the actual context / prompt
```

- `title` and `description` are meant as summaries that can be used for RAG etc.
- `provenance` is meant to provide some background about how the context window was created (hand written, generated, edited, etc.)
