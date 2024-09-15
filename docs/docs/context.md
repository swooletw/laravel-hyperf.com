# Context
[[toc]]

## Introduction

Context is an important feature in Laravel Hyperf, it is used to store the states with coroutines. Context in different coroutines are isolated, and when the coroutine terminates, the context will be destroyed. You don't need to worry about memory leakage without destroying the context manually.

::: important
Do not mutate static variables in coroutines, because static variables are shared by all coroutines. It will cause states pollution and unpredictable bugs.
:::

## Interacting with Context

### Get Context

The `get` method will return the value of the key, if not exists, it will return the default value.

```php
use Hyperf\Context\Context;

$foo = Context::get('foo', 'bar');

$foo = Context::get('foo', 'bar', $coroutineId);
```

### Set Context

The `set` method will set the value of the key, and return the value of the key.

```php
use Hyperf\Context\Context;

// $foo is bar
$foo = Context::set('foo', 'bar');

$foo = Context::set('foo', 'bar', $coroutineId);
```

### Check If Context Key Exists

The `has` method will return true if the key exists, otherwise false.

```php
use Hyperf\Context\Context;

$exists = Context::has('foo');

$exists = Context::has('foo', $coroutineId);
```

### Override Context

Sometimes we need to check if a specific key exists. If the key exists, override the value of a key in the context. You may do so using the `override` method.

```php
use Hyperf\Context\Context;

$request = Context::override(ServerRequestInterface::class, function (ServerRequestInterface $request) {
    return $request->withAddedHeader('foo', 'bar');
});
```

::: note
You can pass `coroutineId` to the third parameter to override the context in a specific coroutine.
:::

### Destroy Context

The `destroy` method will delete the value of the key in coroutine context.

```php
use Hyperf\Context\Context;

Context::destroy('foo');

Context::destroy('foo', $coroutineId);
```

### Get or Set Context

The `getOrSet` method will return the value of the key, if not exists, it will set the value of the key and return.

```php
use Hyperf\Context\Context;

$foo = Context::getOrSet('foo', 'bar');

$foo = Context::getOrSet('foo', 'bar', $coroutineId);
```

### Copy Context

The `copy` method will copy the context from another coroutine to the current coroutine.

```php
use Hyperf\Context\Context;

Context::copy('foo', $fromCoroutineId, $onlyKeys);
```
