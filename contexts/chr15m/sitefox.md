---
title: Sitefox ClojureScript Framework
description: Develop web applications using Sitefox ClojureScript framework with Node.js for streamlined setups
tags: [lang:clojure]
---
# Sitefox

Sitefox is a ClojureScript web framework for Node.js, designed for rapid development with batteries included. It uses Express.js under the hood with sensible defaults.

## Key Features

- Web server & routing (Express.js based)
- Server-side Reagent rendering
- Database & key-value store (SQLite by default)
- Sessions & authentication 
- Email sending
- Form handling with CSRF protection
- Logging and error handling
- Live reloading

## Code Examples

### Basic Server Setup
```clojure
(ns webserver
  (:require 
    [promesa.core :as p]
    [sitefox.web :as web]
    [sitefox.html :refer [render]]))

(defn root [_req res]
  (->> (render [:h1 "Hello world!"])
       (.send res)))

(p/let [[app host port] (web/start)]
  (.get app "/" root)
  (print "Serving on" (str "http://" host ":" port)))
```

### Database Operations
```clojure
(ns myapp.db
  (:require [sitefox.db :as db]
            [promesa.core :as p]))

;; Key-value store
(p/let [table (db/kv "sometable")
        _ (.set table "key" "42")
        val (.get table "key")]
  (println "Value:" val))

;; Direct SQL
(p/let [client (db/client)
        rows (.query client "SELECT * FROM sometable WHERE x = 1")]
  (println rows))
```

### Authentication Setup
```clojure
(defn setup-routes [app]
  (let [template (fs/readFileSync "index.html")]
    (web/reset-routes app)
    (auth/setup-auth app)
    (auth/setup-email-based-auth app template "main")
    (auth/setup-reset-password app template "main")))
```

### Server-side Rendering
```clojure
(ns myapp.views
  (:require [sitefox.html :refer [render-into]]))

(defn component-main []
  [:div
   [:h1 "Hello world!"]
   [:p "Server-side rendered content"]])

(def html-string 
  (render-into (fs/readFileSync "index.html") 
               "main" 
               [component-main]))
```

### Form Handling with CSRF
```clojure
;; Server-side form component
[:form {:method "POST" :action "/submit"}
  [:input {:name "_csrf" 
           :type "hidden" 
           :default-value (.csrfToken req)}]
  [:input {:name "email" :type "email"}]]

;; Client-side AJAX POST
(-> (fetch-csrf-token)
    (.then (fn [token]
             (js/fetch "/api/endpoint"
                      #js {:method "POST"
                           :headers #js {:Content-Type "application/json"
                                       :X-XSRF-TOKEN token}
                           :body (js/JSON.stringify data)}))))
```

### Email Sending
```clojure
(mail/send-email
  "to@example.com"
  "from@example.com"
  "Email Subject"
  :text "Email body text")
```

## Environment Variables

- `PORT` - Web server port
- `BIND_ADDRESS` - Web server bind address  
- `SMTP_SERVER` - SMTP server URL
- `DATABASE_URL` - Database connection URL (default: SQLite)
- `SEND_CSRF_TOKEN` - Enable cookie-based CSRF tokens

## Best Practices

- Use Promesa for promise/async handling
- Enable WAL mode for SQLite in production
- Set up error handlers and logging early
- Use the built-in CSRF protection for forms
- Store user data keyed by user.id
