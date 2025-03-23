---
title: "Permalinks"
description: "Learn how to use permalinks to access and share your context rules consistently over time."
---

# Permalinks

## What are Permalinks?
Permalinks are permanent, reliable URLs that allow you to access and share your context rules consistently over time. Each context rule you create on ctxs.ai gets its own unique URN (Uniform Resource Name) that will remain stable and accessible.

## How to Use Permalinks
There are several ways to use permalinks for your context rules:

### 1. Direct Access
Every context rule has a unique URN in the format: `urn:ctxs:gh:[username]:[id]`

### 2. Plaintext Version
You can access a plaintext version of any context rule by using the format: `https://ctxs.ai/api/txt/[urn]`

For example:
```
https://ctxs.ai/api/txt/urn:ctxs:gh:martinklepsch:qdg6m0
```

### 3. JSON Format
For programmatic access, you can get the JSON version using: `https://ctxs.ai/cli/registry-item/[urn].json`

For example:
```
https://ctxs.ai/cli/registry-item/urn:ctxs:gh:martinklepsch:qdg6m0.json
```

## Benefits
- Share context rules easily with teammates
- Reference rules consistently in documentation
- Integrate with tools and workflows using stable URLs
- Access your rules from anywhere, anytime
- URN-based system ensures globally unique identifiers 