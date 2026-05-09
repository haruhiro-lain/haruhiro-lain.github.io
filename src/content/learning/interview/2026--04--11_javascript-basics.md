---
title: '前端面试八股文：JavaScript 基础'
description: '前端面试必备知识点：变量类型、作用域、闭包、原型链等核心概念详解'
pubDate: '2026-04-11'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ['面试', 'JavaScript', '前端', '八股文']
---

# 前端面试八股文：JavaScript 基础

## 变量类型与类型判断

### 基本数据类型 (Primitive Types)

JavaScript 有 7 种基本数据类型：

1. **undefined**: 未定义的值
2. **null**: 空值
3. **boolean**: 布尔值 `true`/`false`
4. **string**: 字符串
5. **number**: 数字（包括整数和浮点数）
6. **bigint**: 大整数
7. **symbol**: 唯一标识符

### 引用数据类型 (Reference Types)

- **object**: 对象
- **array**: 数组
- **function**: 函数

### 类型判断方法

```javascript
// typeof 操作符
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (历史遗留问题)
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"

// instanceof 操作符
console.log([] instanceof Array);   // true
console.log([] instanceof Object);  // true

// Object.prototype.toString
console.log(Object.prototype.toString.call(null));      // "[object Null]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
```

## 作用域与闭包

### 作用域 (Scope)

JavaScript 的作用域分为：

1. **全局作用域** (Global Scope)
2. **函数作用域** (Function Scope)
3. **块级作用域** (Block Scope) - ES6+

```javascript
// 全局作用域
var globalVar = 'global';

// 函数作用域
function testScope() {
    var functionVar = 'function';
    console.log(globalVar); // 可以访问
}

// 块级作用域
if (true) {
    let blockVar = 'block';
    const constVar = 'const';
    console.log(blockVar); // 可以访问
}
// console.log(blockVar); // ReferenceError
```

### 作用域链 (Scope Chain)

```javascript
var a = 1;

function outer() {
    var b = 2;

    function inner() {
        var c = 3;
        console.log(a, b, c); // 1, 2, 3
    }

    inner();
}

outer();
```

### 闭包 (Closure)

闭包是指有权访问另一个函数作用域中的变量的函数。

```javascript
function createCounter() {
    let count = 0;

    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

**闭包的应用场景：**
- 模块化
- 私有变量
- 函数柯里化
- 防抖/节流

## 原型与原型链

### 构造函数与实例

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);
```

### 原型对象

```javascript
Person.prototype.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
};

person1.sayHello(); // "Hello, I'm Alice"
```

### 原型链

```javascript
console.log(person1.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### 继承方式

1. **原型链继承**

```javascript
function Student(name, age, grade) {
    Person.call(this, name, age);
    this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
```

2. **ES6 Class 继承**

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }
}

class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
}
```

## this 指向

### 全局环境

```javascript
console.log(this); // 浏览器: window, Node.js: global
```

### 函数调用

```javascript
function test() {
    console.log(this);
}

test(); // 严格模式: undefined, 非严格模式: window
```

### 方法调用

```javascript
const obj = {
    name: 'Alice',
    sayHello() {
        console.log(this.name);
    }
};

obj.sayHello(); // "Alice"
```

### 构造函数

```javascript
function Person(name) {
    this.name = name;
}

const person = new Person('Alice');
console.log(person.name); // "Alice"
```

### 事件处理

```javascript
// HTML: <button id="btn">Click</button>
document.getElementById('btn').addEventListener('click', function() {
    console.log(this); // button 元素
});
```

### 手动绑定

```javascript
const obj = { name: 'Alice' };

function sayHello() {
    console.log(this.name);
}

// call/apply/bind
sayHello.call(obj);    // "Alice"
sayHello.apply(obj);   // "Alice"
sayHello.bind(obj)();  // "Alice"
```

## 异步编程

### 回调函数 (Callback)

```javascript
function fetchData(callback) {
    setTimeout(() => {
        callback('data');
    }, 1000);
}

fetchData((data) => {
    console.log(data);
});
```

### Promise

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
});

promise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### async/await

```javascript
async function fetchData() {
    try {
        const result = await promise;
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
```

## 事件循环 (Event Loop)

JavaScript 是单线程语言，但通过事件循环实现异步操作。

### 执行顺序

1. **同步代码** 直接执行
2. **微任务** (Microtasks): Promise.then, MutationObserver
3. **宏任务** (Macrotasks): setTimeout, setInterval, I/O

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');

// 输出顺序: 1, 4, 3, 2
```

## 内存管理

### 垃圾回收 (Garbage Collection)

JavaScript 使用标记清除算法进行垃圾回收：

- **引用计数**: 记录对象被引用的次数
- **标记清除**: 从根对象开始标记可达对象

### 内存泄漏预防

1. **及时清除定时器**
2. **移除事件监听器**
3. **避免闭包陷阱**
4. **使用 WeakMap/WeakSet**

## 常用设计模式

### 单例模式

```javascript
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
        this.data = 'singleton data';
    }
}
```

### 观察者模式

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }
}
```

## 面试题精选

### 1. 变量提升

```javascript
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;
```

### 2. 作用域问题

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i); // 3, 3, 3
    }, 0);
}

for (let j = 0; j < 3; j++) {
    setTimeout(() => {
        console.log(j); // 0, 1, 2
    }, 0);
}
```

### 3. this 指向

```javascript
const obj = {
    name: 'Alice',
    sayHello: () => {
        console.log(this.name);
    }
};

obj.sayHello(); // undefined (箭头函数不绑定 this)
```

## 总结

掌握 JavaScript 基础是前端开发的核心。本文涵盖了：

- ✅ 变量类型与判断
- ✅ 作用域与闭包
- ✅ 原型与继承
- ✅ this 指向
- ✅ 异步编程
- ✅ 事件循环
- ✅ 内存管理
- ✅ 设计模式

> **建议**: 多做练习，多看源码，多参与开源项目。理论知识需要通过实践来巩固。

---

*持续更新中，欢迎补充更多面试题和解答。*