---
provenance: partially AI generated
description: A condensed description of babashka APIs and concepts
---
# general tips for writing babashka code

1. When using `p/process` and `p/shell` a variable list of strings is expected at the end. When creating the command using a vector or similar, be sure to use `apply` so that the vector is unwrapped
	1. Example: `(apply p/process {} ["echo" "123"])`
	   
2. Some useful flags for file processing scripts
	1. `--dry-run` only print actions, don’t execute
	2. `--verbose` log additional input
	
3. When creating namespaces and functions using the babashka.cli APIs, it is useful to alias them into your `bb.edn` file so that they can used as a shorter command
   
	    e.g. {:tasks {prune some.ns/prune}} 

# babashka.cli

Turn Clojure functions into CLIs!

## Installation

Add to your `deps.edn` or `bb.edn` `:deps` entry:

```clojure
org.babashka/cli {:mvn/version "<latest-version>"}
```

## Overview

babashka.cli provides a simple way to parse command line arguments in Clojure and babashka CLIs:

```clojure
$ cli command :opt1 v1 :opt2 v2
# or
$ cli command --long-opt1 v1 -o v2
```

Key features:
- Minimal effort to turn Clojure functions into CLIs
- Better UX by avoiding EDN quotes on command line
- Open world assumption - extra arguments don't break functionality

## Basic Usage

Here's a simple example:

```clojure
#!/usr/bin/env bb
(require '[babashka.cli :as cli]
         '[babashka.fs :as fs])

(def cli-spec
  {:spec
   {:num {:coerce :long
          :desc "Number of items"
          :alias :n
          :validate pos?
          :require true}
    :dir {:desc "Directory name"
          :alias :d
          :validate fs/directory?}
    :flag {:coerce :boolean
           :desc "Flag option"}}})

(defn -main [args]
  (let [opts (cli/parse-opts args cli-spec)]
    (if (:help opts)
      (println (cli/format-opts cli-spec))
      (println "CLI args:" opts))))

(-main *command-line-args*)
```

## Options

Parse options using `parse-opts` or `parse-args`:

```clojure
(cli/parse-opts ["--port" "1339"] {:coerce {:port :long}})
;;=> {:port 1339}

;; With alias
(cli/parse-opts ["-p" "1339"] {:alias {:p :port} :coerce {:port :long}})
;;=> {:port 1339}

;; Collection values
(cli/parse-opts ["--paths" "src" "test"] {:coerce {:paths []}})
;;=> {:paths ["src" "test"]}
```

## Subcommands

Handle subcommands using `dispatch`:

```clojure
(def table
  [{:cmds ["copy"] :fn copy :args->opts [:file]}
   {:cmds ["delete"] :fn delete :args->opts [:file]}
   {:cmds [] :fn help}])

(defn -main [& args]
  (cli/dispatch table args {:coerce {:depth :long}}))
```

## Spec Format

For better CLI documentation, use the spec format:

```clojure
(def spec 
  {:port {:ref "<port>"
          :desc "Port to listen on"
          :coerce :long
          :default 8080
          :alias :p}})
```

Print help with:
```clojure
(println (cli/format-opts {:spec spec}))
```

## Features
- Auto-coercion for values
- Boolean flags
- Required options
- Value validation
- Default values
- Command aliases
- Error handling
- Help text generation

# babashka.fs API

```
(require [babashka.fs :as fs])
```

## Core Functions

### File System Operations
- `absolute?` - Returns true if path is absolute
- `absolutize` - Converts path to absolute path 
- `canonicalize` - Returns canonical path
- `components` - Returns seq of path components split by file separator
- `copy` - Copies file to destination. Options: `:replace-existing`, `:copy-attributes`, `:nofollow-links`
- `copy-tree` - Copies entire file tree recursively
- `create-dir` - Creates single directory
- `create-dirs` - Creates directory and parents (like mkdir -p)
- `create-file` - Creates empty file with optional permissions
- `create-link` - Creates hard link
- `create-sym-link` - Creates symbolic link
- `delete` - Deletes file/directory
- `delete-if-exists` - Deletes if exists, returns boolean
- `delete-tree` - Recursively deletes directory tree (like rm -rf)
- `move` - Moves/renames file or directory

### File Properties
- `directory?` - Checks if path is directory
- `exists?` - Checks if path exists
- `executable?` - Checks if file is executable
- `hidden?` - Checks if file is hidden
- `readable?` - Checks if file is readable
- `regular-file?` - Checks if is regular file
- `relative?` - Checks if path is relative
- `size` - Gets file size in bytes
- `sym-link?` - Checks if is symbolic link
- `writable?` - Checks if file is writable

### Path Operations
- `expand-home` - Expands ~ to user home directory
- `file` - Converts to java.io.File
- `file-name` - Gets name from path
- `normalize` - Normalizes path
- `parent` - Gets parent directory
- `path` - Converts to java.nio.file.Path
- `relativize` - Gets relative path between paths
- `unixify` - Converts path separators to Unix style

### File Content
- `read-all-bytes` - Reads file as byte array
- `read-all-lines` - Reads file as lines
- `write-bytes` - Writes bytes to file
- `write-lines` - Writes lines to file
- `update-file` - Updates text file contents

### Time/Dates
- `creation-time` - Gets file creation time
- `last-modified-time` - Gets last modified time
- `set-creation-time` - Sets creation time
- `set-last-modified-time` - Sets last modified time

### Search & Traversal
- `glob` - Finds files matching glob pattern
- `list-dir` - Lists directory contents
- `list-dirs` - Lists contents of multiple directories
- `match` - Finds files matching pattern
- `modified-since` - Finds files modified after reference
- `walk-file-tree` - Traverses directory tree with visitor functions

### Archive Operations
- `gunzip` - Extracts gzip file
- `gzip` - Compresses file with gzip
- `unzip` - Extracts zip archive
- `zip` - Creates zip archive

### Temporary Files
- `create-temp-dir` - Creates temporary directory
- `create-temp-file` - Creates temporary file
- `delete-on-exit` - Marks for deletion on JVM exit
- `temp-dir` - Gets system temp directory
- `with-temp-dir` - Executes with temporary directory

### Permissions & Attributes
- `get-attribute` - Gets file attribute
- `owner` - Gets file owner
- `posix-file-permissions` - Gets POSIX permissions
- `read-attributes` - Reads file attributes
- `set-attribute` - Sets file attribute
- `set-posix-file-permissions` - Sets POSIX permissions
- `str->posix` - Converts string to POSIX permissions
- `posix->str` - Converts POSIX permissions to string

### System & Environment
- `exec-paths` - Gets executable search paths
- `which` - Finds executable in PATH
- `which-all` - Finds all matching executables
- `windows?` - Checks if running on Windows

### XDG Base Directories
- `xdg-cache-home` - Gets XDG cache directory
- `xdg-config-home` - Gets XDG config directory
- `xdg-data-home` - Gets XDG data directory
- `xdg-state-home` - Gets XDG state directory

## Constants
- `file-separator` - System file separator
- `path-separator` - System path separator

Each function preserves its original docstring and source link from the original API documentation.


# babashka.http-client API Reference

## Core HTTP Functions

### Main Request Functions
- `request [opts]` - Core function for making HTTP requests
  - Required: `:uri`
  - Common options: `:headers`, `:method`, `:body`, `:query-params`, `:form-params`
  - Auth: `:basic-auth`, `:oauth-token`
  - Response: `:async`, `:timeout`, `:throw`
  - Advanced: `:client`, `:interceptors`, `:version`

### Convenience Methods
```clojure
(get uri [opts])    ; GET request
(post uri [opts])   ; POST request
(put uri [opts])    ; PUT request
(delete uri [opts]) ; DELETE request
(patch uri [opts])  ; PATCH request
(head uri [opts])   ; HEAD request
```

### Client Configuration

#### Client Creation
- `client [opts]` - Create custom HTTP client
  - Options:
    - `:follow-redirects` - `:never`, `:always`, `:normal`
    - `:connect-timeout` - Connection timeout in ms
    - `:executor`, `:ssl-context`, `:ssl-parameters`
    - `:proxy`, `:authenticator`, `:cookie-handler`
    - `:version` - `:http1.1` or `:http2`
  
- `default-client-opts` - Default options used by implicit client

#### HTTP Component Builders
```clojure
(->Authenticator {:user "user" :pass "pass"})
(->CookieHandler {:store cookie-store :policy :accept-all})
(->Executor {:threads 4})
(->ProxySelector {:host "proxy.com" :port 8080})
(->SSLContext {:key-store "cert.p12" :key-store-pass "pass"})
(->SSLParameters {:ciphers ["TLS_AES_128_GCM_SHA256"]})
```

## Interceptors
Interceptors modify requests/responses in the processing chain.

### Request Interceptors
- `accept-header` - Add Accept header
- `basic-auth` - Add Basic Auth header
- `oauth-token` - Add Bearer token header
- `query-params` - Encode and append query params
- `form-params` - Encode form parameters
- `construct-uri` - Build URI from map components
- `multipart` - Handle multipart requests

### Response Interceptors
- `decode-body` - Decode response as :string/:stream/:bytes
- `decompress-body` - Handle gzip/deflate encoding
- `throw-on-exceptional-status-code` - Error on bad status

### Interceptor Chain
- `default-interceptors` - Default processing chain
- Order: Request phase forward, response phase reverse

## WebSocket Support 

### WebSocket Creation
```clojure
(websocket {
  :uri "ws://example.com"
  :headers {"Authorization" "Bearer token"}
  :on-open (fn [ws] ...)
  :on-message (fn [ws data last] ...)
  :on-close (fn [ws status reason] ...)
})
```

### WebSocket Operations
```clojure
(send! ws data [opts])     ; Send message
(ping! ws data)            ; Send ping
(pong! ws data)            ; Send pong
(close! ws [code reason])  ; Graceful close
(abort! ws)                ; Immediate close
```

## Usage Examples

### Basic GET Request
```clojure
(get "https://api.example.com/data" 
     {:headers {"Accept" "application/json"}})
```

### POST with JSON
```clojure
(post "https://api.example.com/create"
      {:body "{\"name\":\"test\"}"
       :headers {"Content-Type" "application/json"}})
```

### Custom Client with Authentication
```clojure
(def custom-client 
  (client {:authenticator {:user "user" :pass "pass"}
           :follow-redirects :always
           :connect-timeout 5000}))

(request {:client custom-client
          :uri "https://api.example.com/secure"})
```

### WebSocket Example
```clojure
(def ws (websocket 
          {:uri "wss://echo.example.com"
           :on-message (fn [ws data last] 
                        (println "Received:" data))
           :on-error (fn [ws err] 
                      (println "Error:" err))}))
(send! ws "Hello WebSocket!")
```

## Notes
- Interceptors can be customized via `:interceptors` option
- Default HTTP version is HTTP/2
- For async operations, use `:async true` with callbacks
- SSL configuration supports both key stores and trust stores
- WebSocket implementation is based on Java 11 HTTP Client

# Using LLMs from babashka

Here’s a useful snippet for using Simon Willison’s `llm` command line tool from Babashka:

```clojure
(require '[babashka.process :as p])

(defn- build-command
  "Builds the llm command with options"
  [{:keys [model system template continue conversation-id
           no-stream extract extract-last options attachments
           attachment-types out]
    :as _opts}]
  (cond-> ["llm"]
    model (conj "-m" model)
    system (conj "-s" system)
    template (conj "-t" template)
    continue (conj "-c")
    conversation-id (conj "--cid" conversation-id)
    no-stream (conj "--no-stream")
    extract (conj "-x")
    extract-last (conj "--xl")
    out (conj (str "--out=" out))
    options (concat (mapcat (fn [[k v]] ["-o" (name k) (str v)]) options))
    attachments (concat (mapcat (fn [a] ["-a" a]) attachments))
    attachment-types (concat (mapcat (fn [[path type]] ["--at" path type]) attachment-types))))

(defn prompt
  "Execute an LLM prompt. Returns the response as a string.

   LLM Options:
   :model - Model to use (e.g. \"gpt-4o\") 
   :system - System prompt
   :template - Template name to use
   :continue - Continue previous conversation
   :conversation-id - Specific conversation ID to continue
   :no-stream - Disable streaming output
   :extract - Extract first code block
   :extract-last - Extract last code block
   :options - Map of model options (e.g. {:temperature 0.7})
   :attachments - Vector of attachment paths/URLs
   :attachment-types - Map of {path content-type} for attachments
   :out - Output file path"
  ([prompt] (prompt {} prompt))
  ([opts prompt]
   (-> (apply p/process
              {:out :string
               :in prompt}
              (build-command opts))
       deref
       :out)))


;; Example usage:
#_(comment
  ;; Basic prompt
    (prompt "Write a haiku about coding")

  ;; Prompt with options
    (prompt {:model "gpt-4o"
             :system "You are a helpful assistant"
             :options {:temperature 0.7}}
            "Explain monads simply")) 
```


