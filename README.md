# collina-auth
Excercise for NodeJS Workshop


AuthService
=======

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

**Fast & simple storage - a Node.js-style LevelDB wrapper**

[![Build Status](https://secure.travis-ci.org/Level/levelup.svg?branch=master)](http://travis-ci.org/Level/levelup)
[![dependencies](https://david-dm.org/Level/levelup.svg)](https://david-dm.org/level/levelup)

[![NPM](https://nodei.co/npm/levelup.png?stars&downloads&downloadRank)](https://nodei.co/npm/levelup/) [![NPM](https://nodei.co/npm-dl/levelup.png?months=6&height=3)](https://nodei.co/npm/levelup/)


  * <a href="#intro">Introduction</a>
  * <a href="#basic">Basic Usage</a>

<a name="intro"></a>
Introduction
------------

**[AuthService](https://github.com/collina-auth)** is a simple ....


<a name="basic"></a>
Basic usage
-----------

First you need to install AuthService!

```sh
$ npm install collina-auth
```


All operations are asynchronous although they don't necessarily require a callback if you don't need to know when the operation was performed.

```js
var auth = require('collina-auth')

// 1) Add user, supply .
//    This will create user on  the underlying store.
var user = auth.addUser()

// 2) put a key & value
var details = user.fetchDetails('name', function (err) {

})
```

<a name="api"></a>
## API

  * <a href="#ctor"><code><b>collina-auth()</b></code></a>
  * <a href="#user"><code>auth.<b>addUser()</b></code></a>
  * <a href="#fetchDetails"><code>user.<b>fetchDetails()</b></code></a>
  * <a href="#authenticate"><code>user.<b>authenticate()</b></code></a>


