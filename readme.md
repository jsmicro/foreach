# JSMicro - Iterator

### **`foreach(object, handler, reversed)`**

Iterate Array, Object, String, Number, and Arguments (and NodeList on browser), using direct mode.

* **`object`** - Array, Object, String, Number, or Arguments to iterate.
* **`handler`** - Function to handle the each items. Will get (key, value) for object, and (i, value) for non-object.
* **`reversed`** - Boolean does the iteration should be reversed. Default is no.

### **`foreach(object).run(handler, reversed)[.then(handler)][.catch(handler)]`**

Iterate Array, Object, String, Number, and Arguments (and NodeList on browser), using waiting mode.

* **`object`** - Array, Object, String, Number, or Arguments to iterate.
* **`handler`** - Function to handle the each items. Will get (key, value) for object, and (i, value) for non-object.
* **`reversed`** - Boolean does the iteration should be reversed. Default is no.

### **`.then(handler)`**

Add function that will be called when the iteration done.
 
### **`.catch(handler)`**

Add function that will be called when the iteration is stopped.

## Browser Usage

```bash
bower install --save jsmicro-foreach
```

```html
<script type="text/javascript" src="bower_components/jsmicro-foreach/index.js">
<script type="text/javascript">
    // Iterating array.
    foreach([1,2,3], function(i, v) {
        console.log(i); // 0, 1, 2
        console.log(v); // 1, 2, 3
    });
    
    // Iterating object.
    foreach({a: 1, b: 2 }, function(key, value) {
        console.log(key); // a, b
        console.log(value); // 1, 2
    });
    
    // Iterating number.
    foreach(100, function(i, n) {
        console.log(i); // 0 - 99
        console.log(n); // 1 - 100;
    });
    
    // Iterating string using waiting mode.
    foreach('Test').run(function(i, char, next) {
        console.log(i); // 0, 1, 2, 3
        console.log(char); // T, e, s, t
        
        next();
    }).then(function() {
        console.log('Iteration done');
    });
    
    // Iterating number using waiting mode.
    foreach(5).run(function(i, n, next) {
        console.log(i); // 0, 1, 2, 3, 4
        console.log(n); // 1, 2, 3, 4, 5
        
        next();
    }).then(function() {
        console.log('Iteration done');
    });
</script>
```

## NodeJS Usage

```bash
npm install --save jsmicro-foreach
```

```js
require('jsmicro-foreach');

// Iterating array.
foreach([1,2,3], function(i, v) {
    console.log(i); // 0, 1, 2
    console.log(v); // 1, 2, 3
});

// Iterating object.
foreach({a: 1, b: 2 }, function(key, value) {
    console.log(key); // a, b
    console.log(value); // 1, 2
});

// Iterating number.
foreach(100, function(i, n) {
    console.log(i); // 0 - 99
    console.log(n); // 1 - 100;
});

// Iterating string using waiting mode.
foreach('Test').run(function(i, char, next) {
    console.log(i); // 0, 1, 2, 3
    console.log(char); // T, e, s, t
    
    next();
}).then(function() {
    console.log('Iteration done');
});

// Iterating number using waiting mode.
foreach(5).run(function(i, n, next) {
    console.log(i); // 0, 1, 2, 3, 4
    console.log(n); // 1, 2, 3, 4, 5
    
    next();
}).then(function() {
    console.log('Iteration done');
});

// Iterating number and break the iteration.
foreach(100).run(function(i, n, next, stop) {
    console.log(i); // 0 - 49
    console.log(n); // 1 - 50
    
    if (n === 50) {
        stop('Break on 50');
    } else {
        next();
    }
}).catch(function(msg) {
    console.log(msg); // Break on 50
});
```

## Changelogs

#### **`v1.0.0 - May 20, 2016`**

* Initial release.

### [The MIT License (MIT)](https://mahdaen.mit-license.org/)
