---
title: Clojure Style Guide
description: Follow Clojure style conventions for clear, consistent, and maintainable codebases.
provenance: Distilled by an LLM from the source material at guide.clojure.style
---
# Clojure Style Guide

A concise summary of key Clojure style conventions for LLM context.

## Source Code Layout

- Use spaces for indentation (2 spaces)
- Limit lines to 80 characters where feasible
- Use Unix-style line endings
- One namespace per file
- Terminate files with newline
- No trailing whitespace
- Empty line between top-level forms
- No blank lines within definition forms

## Naming Conventions

- Use `lisp-case` for functions and variables: `(def some-var)`, `(defn some-fun)`
- Use `CapitalCase` for protocols, records, structs, types: `(defprotocol MyProtocol)`
- End predicate function names with `?`: `(defn palindrome?)`
- End unsafe transaction functions with `!`: `(defn reset!)`
- Use `->` for conversion functions: `(defn f->c)`
- Use `*earmuffs*` for dynamic vars: `(def ^:dynamic *db*)`
- Use `_` for unused bindings: `(fn [_ b] b)`

## Namespace Conventions

- No single-segment namespaces
- Prefer `:require` over `:use`
- Common namespace aliases:
  - `[clojure.string :as str]`
  - `[clojure.java.io :as io]`
  - `[clojure.edn :as edn]`
  - `[clojure.walk :as walk]`
  - `[clojure.zip :as zip]`
  - `[clojure.data.json :as json]`

## Function Style

```clojure
;; Good function style examples
(defn foo 
  "Docstring goes here."
  [x]
  (bar x))

;; Multiple arity - align args
(defn foo
  "I have two arities."
  ([x]
   (foo x 1))
  ([x y]
   (+ x y)))

;; Threading macros for readability
(-> person
    :address
    :city
    str/upper-case)

(->> items
     (filter active?)
     (map :name)
     (into []))
```

## Collections

- Prefer vectors `[]` over lists `()` for sequences
- Use keywords for map keys: `{:name "John" :age 42}`
- Use sets as predicates: `(filter #{:a :b} coll)`
- Prefer `vec` over `into []`
- Avoid Java collections/arrays

## Common Idioms

```clojure
;; Use when instead of (if x (do ...))
(when test
  (do-this)
  (do-that))

;; Use if-let for conditional binding
(if-let [val (may-return-nil)]
  (do-something val)
  (handle-nil-case))

;; Use cond with :else
(cond
  (neg? n) "negative"
  (pos? n) "positive"
  :else "zero")

;; Use case for constants
(case day
  :mon "Monday"
  :tue "Tuesday"
  "unknown")
```

## Documentation

- Start docstrings with complete sentence
- Use Markdown in docstrings
- Document all function arguments with backticks
- Reference vars with backticks: `clojure.core/str`
- Link to other vars with `[[var-name]]`

## Testing

- Put tests in `test/` directory 
- Name test namespaces `*.test`
- Name tests with `-test` suffix
- Use `deftest` macro

## Common Metadata

```clojure
;; Version added
(def ^{:added "1.0"} foo 42)

;; Deprecation
(def ^{:deprecated "2.0"} old-foo 42)

;; No documentation
(def ^:no-doc internal-thing 42)

;; Private
(def ^:private secret 42)
```
