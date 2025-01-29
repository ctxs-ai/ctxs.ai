---
provenance: generated based on transcripts, edited
description: helpful for converting React code from documentation to ClojureScript (Reagent or Uix) and vice versa
---
# Converting Between React, Reagent, and UIx: A Comprehensive Guide

This guide provides examples and patterns for converting React components between JavaScript/JSX, Reagent (ClojureScript), and UIx (ClojureScript).

## Table of Contents
- [Component Definition](#component-definition)
- [Element Creation](#element-creation)
- [Props and Children](#props-and-children)
- [Hooks](#hooks)
- [Event Handling](#event-handling)
- [Class and Style](#class-and-style)
- [DOM References](#dom-references)
- [Common Patterns](#common-patterns)

## Component Definition

### React (JavaScript)
```javascript
function MyComponent({ title, children }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

// With hooks
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Reagent
```clojure
(defn my-component [{:keys [title]} & children]
  [:div.container
   [:h1 title]
   children])

;; With hooks (using with-let for state)
(defn counter []
  (let [[count set-count] (react/useState 0)]
    [:button {:on-click #(set-count (inc count))}
     (str "Count: " count)]))
```

### UIx
```clojure
(defui my-component [{:keys [title children]}]
  ($ :div.container
     ($ :h1 title)
     children))

;; With hooks
(defui counter []
  (let [[count set-count] (uix.core/use-state 0)]
    ($ :button 
       {:on-click #(set-count (inc count))}
       (str "Count: " count))))
```

## Element Creation

### React (JSX)
```javascript
<div className="parent">
  <Child prop1="value1" prop2={value2}>
    <span>Inner content</span>
  </Child>
</div>
```

### Reagent
```clojure
[:div.parent
 [child {:prop1 "value1"
         :prop2 value2}
  [:span "Inner content"]]]
```

### UIx
```clojure
($ :div.parent
   ($ child
      {:prop1 "value1"
       :prop2 value2}
      ($ :span "Inner content")))
```

## Props and Children

### React
```javascript
function Container({ style, className, children }) {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}

// Usage
<Container style={{margin: 10}} className="wrapper">
  <p>Content</p>
</Container>
```

### Reagent
```clojure
(defn container [{:keys [style class]} & children]
  [:div {:style style :class class}
   children])

;; Usage
[container {:style {:margin 10}
           :class "wrapper"}
 [:p "Content"]]
```

### UIx
```clojure
(defui container [{:keys [style className children]}]
  ($ :div 
     {:style style
      :className className}
     children))

;; Usage
($ container
   {:style #js {:margin 10}
    :className "wrapper"}
   ($ :p "Content"))
```

## Hooks

### React
```javascript
function Example() {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <div ref={ref}>{count}</div>;
}
```

### Reagent
```clojure
(defn example []
  (let [[count set-count] (react/useState 0)
        ref (react/useRef nil)]
    (react/useEffect
     (fn []
       (set! (.-title js/document) (str "Count: " count))
       js/undefined)
     #js [count])
    [:div {:ref ref} count]))
```

### UIx
```clojure
(defui example []
  (let [[count set-count] (uix.core/use-state 0)
        ref (uix.core/use-ref)]
    (uix.core/use-effect
     #(set! (.-title js/document) (str "Count: " count))
     [count])
    ($ :div {:ref ref} count)))
```

## Event Handling

### React
```javascript
function Button({ onClick }) {
  return (
    <button onClick={(e) => onClick(e.target.value)}>
      Click me
    </button>
  );
}
```

### Reagent
```clojure
(defn button [{:keys [on-click]}]
  [:button {:on-click #(on-click (.. % -target -value))}
   "Click me"])
```

### UIx
```clojure
(defui button [{:keys [onClick]}]
  ($ :button 
     {:onClick #(onClick (.. % -target -value))}
     "Click me"))
```

## Class and Style

### React
```javascript
<div 
  className={`base-class ${active ? 'active' : ''}`}
  style={{
    backgroundColor: color,
    fontSize: size + 'px'
  }}>
  Content
</div>
```

### Reagent
```clojure
[:div
 {:class ["base-class" (when active "active")]
  :style {:background-color color
          :font-size (str size "px")}}
 "Content"]
```

### UIx
```clojure
($ :div
   {:className (str "base-class" (when active " active"))
    :style #js {:backgroundColor color
                :fontSize (str size "px")}}
   "Content")
```

## DOM References

### React
```javascript
function Example() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

### Reagent
```clojure
(defn example []
  (let [input-ref (react/useRef nil)]
    (react/useEffect
     (fn []
       (.focus @input-ref)
       js/undefined)
     #js [])
    [:input {:ref input-ref}]))
```

### UIx
```clojure
(defui example []
  (let [input-ref (uix.core/use-ref)]
    (uix.core/use-effect
     #(.focus @input-ref)
     [])
    ($ :input {:ref input-ref})))
```

## Common Patterns

### Conditional Rendering

#### React
```javascript
{isLoading ? <Spinner /> : <Content />}
{showMessage && <Message />}
```

#### Reagent
```clojure
(if is-loading
  [spinner]
  [content])
(when show-message
  [message])
```

#### UIx
```clojure
(if is-loading
  ($ spinner)
  ($ content))
(when show-message
  ($ message))
```

### Lists

#### React
```javascript
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.text}</li>
  ))}
</ul>
```

#### Reagent
```clojure
[:ul
 (for [item items]
   ^{:key (:id item)}
   [:li (:text item)])]
```

#### UIx
```clojure
($ :ul
   (for [item items]
     ($ :li {:key (:id item)}
        (:text item))))
```

### Forms

#### React
```javascript
function Form() {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```

#### Reagent
```clojure
(defn form []
  (let [[value set-value] (react/useState "")]
    [:input
     {:value value
      :on-change #(set-value (.. % -target -value))}]))
```

#### UIx
```clojure
(defui form []
  (let [[value set-value] (uix.core/use-state "")]
    ($ :input
       {:value value
        :onChange #(set-value (.. % -target -value))})))
```

## Key Differences Summary

1. **Component Definition**
   - React uses function declarations
   - Reagent uses `defn` with vector syntax
   - UIx uses `defui` with `$` macro

2. **Element Creation**
   - React uses JSX
   - Reagent uses vectors with keywords
   - UIx uses `$` macro with keywords

3. **Props**
   - React uses camelCase
   - Reagent uses kebab-case
   - UIx maintains original casing from React

4. **Children**
   - React uses special children prop
   - Reagent uses variadic arguments
   - UIx uses children in props map

5. **Hooks**
   - React uses `useX` naming
   - Reagent wraps React hooks
   - UIx provides Clojure-friendly wrappers

6. **Style**
   - React uses camelCase and JavaScript objects
   - Reagent uses kebab-case and Clojure maps
   - UIx uses JavaScript objects with camelCase

## Best Practices

1. When converting from React:
   - Keep prop names consistent
   - Convert event handlers appropriately
   - Handle JavaScript interop carefully

2. When converting from Reagent:
   - Change vector syntax to `$` macro
   - Update hook usage to UIx equivalents
   - Convert event handler names

3. General Tips:
   - Test thoroughly after conversion
   - Pay attention to state management differences
   - Handle refs and effects carefully
   - Maintain consistent naming conventions

## Common Gotchas

1. **Props Spreading**
   - React: `{...props}`
   - Reagent: `props`
   - UIx: `:& props`

2. **Ref Handling**
   - React: `useRef(null)`
   - Reagent: `react/useRef(nil)`
   - UIx: `use-ref`

3. **Effect Cleanup**
   - React: Return cleanup function
   - Reagent: Return js/undefined or cleanup
   - UIx: Handles undefined return automatically

4. **Class Names**
   - React: className
   - Reagent: :class
   - UIx: className (matches React)

Remember to always test thoroughly after conversion, as subtle differences between the frameworks can lead to unexpected behavior.