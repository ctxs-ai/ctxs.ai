---
title: Using Playwright from ClojureScript
provenance: hand written
description: Automate browser interactions for end-to-end testing with Playwright in ClojureScript
tags: [lang:clojure]
---

Playwright is a library for controlling the browser and can be used in ClojureScript.

Here's an example of requiring it:

```clojure
(ns e2e
  (:require
    ["playwright$default" :as pw]))
```

Create an instance to use like this:

```clojure
(t/use-fixtures
  :once
  {:before
   #(async
      done
      (p/let [browser (.launch pw/chromium #js {:headless false})
              context (.newContext browser)
              page (.newPage context)]
        ; reset the test db
        (reset! rig {:page page :browser browser :base-url (str "http://localhost:8000")})
        (done)))
   :after
   #(async
      done
      (p/let [{:keys [browser server]} @rig]
        (.close browser)
        (when server
          (.kill server))
        (done)))})
```

Here's an example of waiting for a page to load:

```clojure
(defn wait-for-page
  [page base-url url]
  (-> page (.waitForNavigation
             #js {:url (str base-url url)
                  :waitUntil "networkidle"})))
```

Find an element with some text and check it contains that text:

```clojure
(defn ensure-content [page pre-selector txt]
  (p/let [content
          (-> page (.locator
                     (str pre-selector ":has-text('" txt "')"))
              .textContent)]
    (is (includes? content txt))))
```

Check if a locator found anything:

```clojure
(p/-> page (.locator "hello") (.count) #(> % 0)
```

A basic test using playwright:

```clojure
(deftest homepage-content-check
  (t/testing "Checking homepage for some text."
    (async
      done
      (p/let [{:keys [page base-url]} @rig]
        (p/all [(.goto page base-url)
                (wait-for-page page base-url "/")])
        ; Check for some text
        (ensure-content page "section.hero" "Some text)))))
```

Run all tests in the file:

```clojure
(t/run-tests 'e2e)
```

You can often find the HTML IDs or classes required to locate elements for e2e tests by inspecting the Hiccup forms in the app source code.
