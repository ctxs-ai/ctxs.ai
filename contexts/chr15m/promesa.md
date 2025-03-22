---
title: Promesa (ClojureScript library)
description: Manage asynchronous programming in ClojureScript using Promesa for effective promise handling
provenance: hand-written
tags: [lang:clojure]
---
# Promesa

Promesa is a popular library for dealing with asynchronous programming using promises in Clojure and ClojureScript.
Use the Promesa library for handling promises.

Note: promesa macros like `p/let` and `p/do!` always return a promse which resolves on completion of the block, returning the reslut of the last expression.
So you don't have to wrap those macros and functions in a separate promise with it's own resolve handling.

### Promesa examples

```clojure
(require '[promesa.core :as p])

;; Handling errors
;; Using async/await syntax (in ClojureScript or JVM with proper setup)
(p/let [a (p/resolved 10)
        b (p/resolved 20)]
  (println "The sum is:" (+ a b)))

(p/do!
  (println "Step 1: Starting something...")
  (p/delay 1000) ;; Simulate async delay
  (println "Step 2: Something after 1 second delay")
  (p/delay 500) ;; Another delay
  (println "Step 3: Another side effect after 500ms"))

;; Fetch example
(p/let [req (js/fetch "https//example.com/api.json")
        json (when (aget req "ok") (.json req))]
        ; do something with the resulting JSON here
        ; or handle nil when the request fails
        )

;; Combining multiple promises
(p/let [[result-1 result-2 result-2]
        (p/all [(p/resolved 1) (p/resolved 2) (p/resolved 3)])]
		(apply + [result-1 result-2 result3]))

;; Simple promise chain
(p/then
  (p/resolved 42)
  (fn [result]
    (println "The result is:" result)))

;; Catching errors
(p/catch
  (p/rejected (ex-info "Something went wrong!" {}))
  (fn [err]
    (println "Caught an error:" (.getMessage err))))
```
