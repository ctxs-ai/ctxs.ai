---
description: Configure aider to use custom ClojureScript conventions files for enhanced LLM context recognition
---
These are conventions files I use with [aider](https://aider.chat) to give the LLM context about ClojureScript technologies.

These were mostly scraped from project documentation pages with [`aider-conventions-scraper`](https://gist.github.com/chr15m/1e52c9a246c2f8867325db3dd7085cd4). You can use that tool to create your own concise conventions files from documentation pages.

You can configure aider to use your conventions file (in `~/.aider.conf.yml`):

```yaml
read: [CONVENTIONS.md]
```

Then append one or more of these to that file before you start aider.
