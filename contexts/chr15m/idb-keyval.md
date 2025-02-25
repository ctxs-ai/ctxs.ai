---
title: IDB Keyval API
provenance: created using aider conventions
description: Implement a promise-based key-value store with IndexedDB using IDB Keyval API functions
---
# IDB Keyval documentation

This is a super-simple promise-based keyval store implemented with IndexedDB, originally based on async-storage by Mozilla.

## Install
```html
<script src="https://cdn.jsdelivr.net/npm/idb-keyval@6/dist/umd.js"></script>
```
```shell
npm install idb-keyval
```
```
import { get, set } from 'idb-keyval';
```

## Usage

### set:

```js
import { set } from 'idb-keyval';

set('hello', 'world');
```

Since this is IDB-backed, you can store anything structured-clonable (numbers, arrays, objects, dates, blobs etc), although old Edge doesn't support `null`. Keys can be numbers, strings, `Date`s, (IDB also allows arrays of those values, but IE doesn't support it).

All methods return promises:

```js
import { set } from 'idb-keyval';

set('hello', 'world')
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));
```

### get:

```js
import { get } from 'idb-keyval';

// logs: "world"
get('hello').then((val) => console.log(val));
```

If there is no 'hello' key, then `val` will be `undefined`.

### setMany:

Set many keyval pairs at once. This is faster than calling `set` multiple times.

```js
import { set, setMany } from 'idb-keyval';

// Instead of:
Promise.all([set(123, 456), set('hello', 'world')])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));

// It's faster to do:
setMany([
  [123, 456],
  ['hello', 'world'],
])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));
```

This operation is also atomic – if one of the pairs can't be added, none will be added.

### getMany:

Get many keys at once. This is faster than calling `get` multiple times. Resolves with an array of values.

```js
import { get, getMany } from 'idb-keyval';

// Instead of:
Promise.all([get(123), get('hello')]).then(([firstVal, secondVal]) =>
  console.log(firstVal, secondVal),
);

// It's faster to do:
getMany([123, 'hello']).then(([firstVal, secondVal]) =>
  console.log(firstVal, secondVal),
);
```

### update:

Transforming a value (eg incrementing a number) using `get` and `set` is risky, as both `get` and `set` are async and non-atomic:

```js
// Don't do this:
import { get, set } from 'idb-keyval';

get('counter').then((val) =>
  set('counter', (val || 0) + 1);
);

get('counter').then((val) =>
  set('counter', (val || 0) + 1);
);
```

With the above, both `get` operations will complete first, each returning `undefined`, then each set operation will be setting `1`. You could fix the above by queuing the second `get` on the first `set`, but that isn't always feasible across multiple pieces of code. Instead:

```js
// Instead:
import { update } from 'idb-keyval';

update('counter', (val) => (val || 0) + 1);
update('counter', (val) => (val || 0) + 1);
```

This will queue the updates automatically, so the first `update` set the `counter` to `1`, and the second `update` sets it to `2`.

### del:

Delete a particular key from the store.

```js
import { del } from 'idb-keyval';

del('hello');
```

### delMany:

Delete many keys at once. This is faster than calling `del` multiple times.

```js
import { del, delMany } from 'idb-keyval';

// Instead of:
Promise.all([del(123), del('hello')])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));

// It's faster to do:
delMany([123, 'hello'])
  .then(() => console.log('It worked!'))
  .catch((err) => console.log('It failed!', err));
```

### clear:

Clear all values in the store.

```js
import { clear } from 'idb-keyval';

clear();
```

### entries:

Get all entries in the store. Each entry is an array of `[key, value]`.

```js
import { entries } from 'idb-keyval';

// logs: [[123, 456], ['hello', 'world']]
entries().then((entries) => console.log(entries));
```

### keys:

Get all keys in the store.

```js
import { keys } from 'idb-keyval';

// logs: [123, 'hello']
keys().then((keys) => console.log(keys));
```

### values:

Get all values in the store.

```js
import { values } from 'idb-keyval';

// logs: [456, 'world']
values().then((values) => console.log(values));
```

### Custom stores:

By default, the methods above use an IndexedDB database named `keyval-store` and an object store named `keyval`. If you want to use something different, see [custom stores](https://www.jsdelivr.com/package/npm/custom-stores.md).
