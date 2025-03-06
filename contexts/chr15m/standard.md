---
title: Standard
hidden: true
description: Modify ClojureScript files minimally to efficiently achieve specific programming task goals
tags: [lang:clojure]
---

# General guidance

- Please modify files as minimally as possible to accomplish the task.
- Don't make superfluous changes, whitespace changes, or changes to code that don't relate to the current goal.
- In general when writing brand new code ALWAYS add some debugging print/log statements to check things are working the way you're expecting.

# ClojureScript guidance

- When doing frontend work assume the user already has the page open with a live-reloading server running and changes will be hot-loaded as you make them.
- Use `aget` or `j/get` when operating on native JS data instead of cljs calls e.g. `(aget process "env" "SMTP_SERVER")`.
- Remember `#js` is shallow. Use `j/lit` or `clj->js` to create deep JavaScript datastructures from ClojureScript.
- Pay particular attention to whether datastructures are Clojure or JS. JS libraries will take and return only JS datastructures.
- Lint all ClojureScript with the command `clj-kondo` e.g. `clj-kondo --lint FILENAME.cljs`.
