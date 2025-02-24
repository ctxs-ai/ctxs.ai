---
title: applied-science/js-interop
description: A ClojureScript library facilitating JavaScript interop by mirroring core Clojure functions adapted for JavaScript contexts.
---

# js-interop

## Overview
`js-interop` is a ClojureScript library facilitating JavaScript interop by mirroring core Clojure functions adapted for JavaScript contexts.

## Key Features
- **Core Operations**: `get`, `get-in`, `assoc!`, `assoc-in!`, `update!`, `update-in!`, `select-keys`.
- **Key Types**: Supports static keys (keywords) and renamable keys (`.-keyName`).
- **Destructuring**: Use `^js` metadata with `j/let`, `j/fn`, and `j/defn` for JS-specific bindings.
- **Mutation**: Functions mutate objects and return the original for easy threading.
- **Host-interop Keys**: Allow keys to be renamed by the Closure compiler.
- **Wrappers**: Includes utilities like `j/push!`, `j/unshift!`, `j/call`, `j/apply`, `j/call-in`, `j/apply-in`.
- **Object/Array Creation**: `j/obj` for literal objects, `j/lit` for nested structures with support for unquote-splicing.
- **Threading**: Designed to work seamlessly with Clojure’s threading macros.

## Usage Examples

### Reading
```clojure
(j/get obj :x)
(j/get obj :x default-value)
(j/get-in obj [:x :y])
(j/select-keys obj [:x :z])
```

### Destructuring
```clojure
(j/let [^js {:keys [x y]} obj]
  ...)
```

### Mutation
```clojure
(j/assoc! obj :x 10)
(j/update! obj :x inc)
```

### Host-interop Keys
```clojure
(j/get obj .-x)
(j/assoc! obj .-a 1)
```

### Wrappers
```clojure
(j/call o :someFunction 10)
(j/apply o :someFunction #js[1 2 3])
```

### Object Creation
```clojure
(j/obj :a 1 .-b 2)
(j/lit {:a 1 .-b [2 3]})
```

## Best Practices
- Use `^js` to opt-in to JS interop in destructuring.
- Utilize mutation functions for efficient object updates.
- Leverage threading with interop functions for readable code flows.
