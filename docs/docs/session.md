# Session
[[toc]]

## Introduction

Since HTTP driven applications are stateless, sessions provide a way to store information about the user across multiple requests. That user information is typically placed in a persistent store / backend that can be accessed from subsequent requests.

Laravel Hyperf ships with a variety of session backends that are accessed through an expressive, unified API. Currently it only supports `file`, `database` and `redis` driver.

::: note
Session is provided by [hyperf/session](https://github.com/hyperf/session) package. Some methods are different from Laravel's session implementation.
:::

### Configuration

Your application's session configuration file is stored at `config/session.php`. Be sure to review the options available to you in this file. By default, Laravel Hyperf is configured to use the `file` session driver, which will work well for many applications. If your application will be load balanced across multiple web servers, you a centralized store that all servers can access, such as Redis or a database.

::: info
It's recommended to use `redis` as the session driver if possible, it will have better performance and scalability.
:::

The session `driver` configuration option defines where session data will be stored for each request. Laravel Hyperf ships with some great drivers out of the box:

- `file` - sessions are stored in `storage/framework/sessions`.
- `database` - sessions are stored in a relational database.
- `redis` - sessions are stored in redis, a fast and cache based store.

::: important
Before using session, you need to enable the `Hyperf\Session\Middleware\SessionMiddleware` middleware in `Kernel.php`.
:::

### Driver Prerequisites

#### Database

When using the `database` session driver, you will need to create a table to contain the session records. An example `Schema` declaration for the table may be found below:

```php
use Hyperf\Database\Schema\Blueprint;
use Hyperf\Database\Schema\Schema;

Schema::create('sessions', function (Blueprint $table) {
    $table->string('id')->primary();
    $table->text('payload');
    $table->integer('last_activity')->index();
});
```

You may use the `session:table` Artisan command to generate this migration. To learn more about database migrations, you may consult the complete [migration documentation](/docs/migrations.html):

```shell
php artisan session:table

php artisan migrate
```

#### Redis

Before using Redis sessions with Laravel Hyperf, you will need to either install the PhpRedis PHP extension via PECL. For more information on configuring Redis, consult Laravel Hyperf's [Redis documentation](/docs/redis.html#configuration).

::: note
In the `session` configuration file, the `connection` option may be used to specify which Redis connection is used by the session.
:::

## Interacting With the Session

### Retrieving Data

There are two primary ways of working with session data in Laravel Hyperf: the global `session` helper and via a `Request` instance. First, let's look at accessing the session via a `Request` instance, which can be type-hinted on a route closure or controller method. Remember, controller method dependencies are automatically injected via the Laravel Hyperf [service container](/docs/container.html):

```php
<?php

namespace App\Http\Controllers;

use SwooleTW\Hyperf\Http\Request;
use Hyperf\ViewEngine\Contract\ViewInterface;

class UserController extends Controller
{
    /**
     * Show the profile for the given user.
     */
    public function show(Request $request, string $id): ViewInterface
    {
        $value = $request->session()->get('key');

        // ...

        $user = $this->users->find($id);

        return view('user.profile', ['user' => $user]);
    }
}
```

When you retrieve an item from the session, you may also pass a default value as the second argument to the `get` method. This default value will be returned if the specified key does not exist in the session. If you pass a closure as the default value to the `get` method and the requested key does not exist, the closure will be executed and its result returned:

```php
$value = $request->session()->get('key', 'default');

$value = $request->session()->get('key', function () {
    return 'default';
});
```

#### The Global Session Helper

You may also use the global `session` PHP function to retrieve and store data in the session. When the `session` helper is called with a single, string argument, it will return the value of that session key. When the helper is called with an array of key / value pairs, those values will be stored in the session:

```php
Route::get('/home', function () {
    // Retrieve a piece of data from the session...
    $value = session('key');

    // Specifying a default value...
    $value = session('key', 'default');

    // Store a piece of data in the session...
    session(['key' => 'value']);
});
```

::: note
There is little practical difference between using the session via an HTTP request instance versus using the global `session` helper.
:::

#### Retrieving All Session Data

If you would like to retrieve all the data in the session, you may use the `all` method:

```php
$data = $request->session()->all();
```

#### Determining if an Item Exists in the Session

To determine if an item is present in the session, you may use the `has` method. The `has` method returns `true` if the item is present and is not `null`:

```php
if ($request->session()->has('users')) {
    // ...
}
```

To determine if an item is present in the session, even if its value is `null`, you may use the `exists` method:

```php
if ($request->session()->exists('users')) {
    // ...
}
```

### Storing Data

To store data in the session, you will typically use the request instance's `put` method or the global `session` helper:

```php
// Via a request instance...
$request->session()->put('key', 'value');

// Via the global "session" helper...
session(['key' => 'value']);
```

#### Pushing to Array Session Values

The `push` method may be used to push a new value onto a session value that is an array. For example, if the `user.teams` key contains an array of team names, you may push a new value onto the array like so:

```php
$request->session()->push('user.teams', 'developers');
```

#### Retrieving and Deleting an Item

The `remove` method will retrieve and delete an item from the session in a single statement:

```php
$value = $request->session()->remove('key');
```

### Flash Data

Sometimes you may wish to store items in the session for the next request. You may do so using the `flash` method. Data stored in the session using this method will be available immediately and during the subsequent HTTP request. After the subsequent HTTP request, the flashed data will be deleted. Flash data is primarily useful for short-lived status messages:

```php
$request->session()->flash('status', 'Task was successful!');
```

If you need to persist your flash data for several requests, you may use the `reflash` method, which will keep all of the flash data for an additional request. If you only need to keep specific flash data, you may use the `keep` method:

```php
$request->session()->reflash();

$request->session()->keep(['username', 'email']);
```

To persist your flash data only for the current request, you may use the `now` method:

```php
$request->session()->now('status', 'Task was successful!');
```

### Deleting Data

The `forget` method will remove a piece of data from the session. If you would like to remove all data from the session, you may use the `flush` method:

```php
// Forget a single key...
$request->session()->forget('name');

// Forget multiple keys...
$request->session()->forget(['name', 'status']);

$request->session()->flush();
```

### Getting the current Session ID

The `getId` method will return the ID of the current session:

```php
$id = $request->session()->getId();
```

### Clearing the Session

The `clear` method will clear all data from the session:

```php
$request->session()->clear();
```

### Regenerating the CSRF Token

You can get the CSRF token using the `token` method, and regenerate it using the `regenerateToken` method:

```php
$request->session()->token();
$request->session()->regenerate();
```

If you need to regenerate the session ID and remove all data from the session in a single statement, you may use the `invalidate` method:

```php
$request->session()->invalidate();
```

## Adding Custom Session Drivers

### Implementing the Driver

If none of the existing session drivers fit your application's needs, Laravel Hyperf makes it possible to write your own session handler. Your custom session driver should implement PHP's built-in `SessionHandlerInterface`. This interface contains just a few simple methods. A stubbed MongoDB implementation looks like the following:

```php
<?php

namespace App\Extensions;

class MongoSessionHandler implements \SessionHandlerInterface
{
    public function open($savePath, $sessionName) {}
    public function close() {}
    public function read($sessionId) {}
    public function write($sessionId, $data) {}
    public function destroy($sessionId) {}
    public function gc($lifetime) {}
}
```

::: note
Laravel Hyperf does not ship with a directory to contain your extensions. You are free to place them anywhere you like. In this example, we have created an `Extensions` directory to house the `MongoSessionHandler`.
:::

Since the purpose of these methods is not readily understandable, let's quickly cover what each of the methods do:

- The `open` method would typically be used in file based session store systems. Since Laravel ships with a `file` session driver, you will rarely need to put anything in this method. You can simply leave this method empty.
- The `close` method, like the `open` method, can also usually be disregarded. For most drivers, it is not needed.
- The `read` method should return the string version of the session data associated with the given `$sessionId`. There is no need to do any serialization or other encoding when retrieving or storing session data in your driver, as Laravel will perform the serialization for you.
- The `write` method should write the given `$data` string associated with the `$sessionId` to some persistent storage system, such as MongoDB or another storage system of your choice.  Again, you should not perform any serialization - Laravel Hyperf will have already handled that for you.
- The `destroy` method should remove the data associated with the `$sessionId` from persistent storage.
- The `gc` method should destroy all session data that is older than the given `$lifetime`, which is a UNIX timestamp. For self-expiring systems like Memcached and Redis, this method may be left empty.

### Registering the Driver

Once your driver has been implemented, you are ready to configure it with Laravel Hyperf. You can add your driver to the `config/session.php` configuration file:

```php
return [
    'handler' => App\Extensions\MongoSessionHandler::class,
    // ...
];
```
