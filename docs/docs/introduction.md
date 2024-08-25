## Introduction

**Laravel Hyperf** is a Laravel-style skeleton based on Hyperf framework designed for Laravel artisans.

Besides the high performance brought by Hyperf, it adopts Laravel's directory structure and component styles while migrating many common Laravel packages such as `Auth`, `Cache`, `Config`, `Container`, `Command`, `Database`, `Event`, `Facade`, `Router`, `Middleware`, `Log`, `Encryption`, `Testing` to be more coroutine-friendly. If you're a Laravel developer, you'll feel right at home with this framework, requiring minimal additional learning.

## Why Laravel Hyperf?

While Laravel Octane is impressive and significantly improves your Laravel application's speed and performance, it's important to consider the nature of modern web applications. In most cases, the majority of latency comes from I/O operations, such as reading files, querying databases and making API requests.

If your application relies heavily on slow I/O operations, you may still encounter performance bottlenecks. Consider this scenario:

Imagine building an AI-powered chatbot where each conversation API takes 3-5 seconds to respond. If you have 10 workers in Laravel Octane and receive 10 concurrent requests, all workers would be occupied until these requests complete.

In such cases, even with Laravel Octane's improvements, your application's ability to handle concurrent requests is still limited by the duration of these I/O operations. Laravel Hyperf addresses this issue by leveraging coroutines, allowing for efficient handling of concurrent I/O operations without blocking workers. This approach can significantly improve the performance and concurrency of applications with heavy I/O requirements.

For I/O-intensive scenarios, Laravel Octane may not significantly boost performance. Moreover, and it's unlikely that Laravel Octane will support coroutines in the near future, given that only Swoole runtime currently supports this feature and considering backward compatibility with the framework and third-party packages.

::: note
Even if Laravel Octane supported coroutines, they would be limited to a single request, with workers remaining blocked until all I/O operations within that request are completed.

See [this pull request](https://github.com/swoole/swoole-src/pull/4330) for more information.
:::

**Laravel Hyperf** aims to help Laravel artisans enjoy the high performance of Hyperf while maintaining familiar Laravel development practices. It's compatible with Hyperf packages, ensuring developers can share the same ecosystem and community. We encourage developers to contribute to the Hyperf project, benefiting both Hyperf and **Laravel Hyperf** simultaneously.

## Laravel Octane

Laravel is renowned for its expressive and elegant syntax, powerful package ecosystem, and thriving community. However, due to the traditional lifecycle in PHP-FPM, Laravel's performance is limited despite various optimization techniques applied to the framework.

At LaraCon 2021, Taylor Otwell announced Laravel Octane — a first-party package maintained by the Laravel team. Octane significantly enhances Laravel application performance by running your code in a long-lived process on high-powered application servers such as Swoole, RoadRunner, and FrankenPHP.

> For more information, see [Laravel Octane](https://laravel.com/docs/master/octane).

## Hyperf

Hyperf is a high-performance framework built on Swoole and Swow, with all components natively supporting coroutines and strictly adhering to PSR standards. It enables developers to easily build high-concurrency applications with out-of-the-box support for non-blocking I/O.

The Hyperf project maintains high activity levels on GitHub, with regular feature updates and version releases. This demonstrates strong community engagement and consistent development progress. With over 6,000 stars on GitHub and more than 350 contributors since 2019, Hyperf is a top choice for developers seeking a modern web framework to build high-performance PHP projects with asynchronous I/O support.

> For more details, visit [Hyperf's official website](https://hyperf.io/).

## Benchmark

The benchmark tests cover two distinct scenarios to evaluate performance under different conditions:

1. Simple API Test:
   - A basic `hello world` API endpoint
   - No middleware applied
   - Tests raw response speed

2. Simulated I/O Wait Test:
   - Sleep for one second to simulate I/O wait time
   - Respond with `hello world` after the delay
   - Tests performance under I/O-bound conditions

> worker numbers are configured by default (as CPU cores)

Test Environment Specifications:
- Hardware: Apple M1 Pro 2021
- CPU: 8 cores
- RAM: 16 GB

### Simple API Test

* Laravel Octane

```text:no-line-numbers
Running 10s test @ http://127.0.0.1:8000/api
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    15.93ms   16.86ms 155.82ms   87.02%
    Req/Sec     2.07k   420.46     3.10k    66.00%
  82661 requests in 10.04s, 16.95MB read
Requests/sec:   8230.97
Transfer/sec:      1.69MB
```

* Laravel Hyperf

```text:no-line-numbers
Running 10s test @ http://127.0.0.1:9501/api
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.66ms   17.85ms 249.92ms   90.25%
    Req/Sec    24.42k    10.47k   54.37k    68.53%
  971692 requests in 10.06s, 151.98MB read
Requests/sec:  96562.80
Transfer/sec:     15.10MB
```

::: chart

```json
{
  "type": "bar",
  "data": {
    "labels": ["Hello World API"],
    "datasets": [
      {
        "label": "Laravel Octane",
        "data": [8230.97],
        "backgroundColor": "rgba(255, 182, 193, 0.8)",
        "borderColor": "rgba(255, 182, 193, 1)",
        "borderWidth": 1
      },
      {
        "label": "Laravel Hyperf",
        "data": [96562.80],
        "backgroundColor": "rgba(173, 216, 230, 0.8)",
        "borderColor": "rgba(173, 216, 230, 1)",
        "borderWidth": 1
      }
    ]
  },
  "options": {
    "responsive": true,
    "scales": {
      "x": {
        "stacked": false
      },
      "y": {
        "stacked": false,
        "title": {
          "display": true,
          "text": "QPS"
        }
      }
    },
    "plugins": {
      "title": {
        "display": true,
        "text": "Laravel Octane vs Laravel Hyperf"
      },
      "legend": {
        "position": "top"
      }
    }
  }
}
```
:::

### Simulated I/O Wait Test

* Laravel Octane

```text:no-line-numbers
Running 10s test @ http://127.0.0.1:8000/api
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.03s   184.92us   1.03s    87.50%
    Req/Sec     1.52      1.29     5.00     54.84%
  80 requests in 10.10s, 16.80KB read
  Socket errors: connect 0, read 0, write 0, timeout 72
Requests/sec:      7.92
Transfer/sec:      1.66KB
```

* Laravel Hyperf

```text:no-line-numbers
Running 10s test @ http://10.10.4.12:9501/api
  16 threads and 15000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.02s    64.72ms   1.87s    93.62%
    Req/Sec     1.16k     1.68k    9.15k    87.59%
  109401 requests in 10.09s, 19.82MB read
Requests/sec:  10842.71
Transfer/sec:      1.96MB
```

> In this case I run wrk in another machine to make sure wrk can use as much resource for keeping more connections.

::: chart

```json
{
  "type": "bar",
  "data": {
    "labels": ["1s wait I/O"],
    "datasets": [
      {
        "label": "Laravel Octane",
        "data": [7.92],
        "backgroundColor": "rgba(255, 182, 193, 0.8)",
        "borderColor": "rgba(255, 182, 193, 1)",
        "borderWidth": 1
      },
      {
        "label": "Laravel Hyperf",
        "data": [10842.71],
        "backgroundColor": "rgba(173, 216, 230, 0.8)",
        "borderColor": "rgba(173, 216, 230, 1)",
        "borderWidth": 1
      }
    ]
  },
  "options": {
    "responsive": true,
    "scales": {
      "x": {
        "stacked": false
      },
      "y": {
        "stacked": false,
        "title": {
          "display": true,
          "text": "QPS"
        }
      }
    },
    "plugins": {
      "title": {
        "display": true,
        "text": "Laravel Octane vs Laravel Hyperf"
      },
      "legend": {
        "position": "top"
      }
    }
  }
}
```
:::

::: note
The QPS results for Laravel Hyperf have little difference between 1 worker and 8 workers configurations. Both configurations achieve approximately 10000 QPS. That means there's limitation in the benchmarking environment. In real cases Laravel Hyperf should have much better performance.
:::