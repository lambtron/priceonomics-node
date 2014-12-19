priceonomics-node
==============

> A node.js client for the Priceonomics Analysis Engine [API](http://docs.analysisengine.apiary.io/).

### Getting Started

Install the module:
```bash
$ npm install --save priceonomics
```

Create an instance of `Priceonomics` that you can use to interact with their endpoints:
```javascript
var Priceonomics = require('priceonomics');
var priceonomics = new Priceonomics('yourXAccessKey');
```

### Examples

List applications:
```javascript
priceonomics.list(function(err, res) {
  // res  
});
```

Get details about the 'fetch' application:
```javascript
priceonomics.details('fetch', function(err, res) {
  // res
});
```

Send input to application 'fetch':
```javascript
var json = {
  async: false,
  data: {
    url: "http://priceonomics.com/porsche-the-hedge-fund-that-also-made-cars/",
    country: "US",
  }
};

priceonomics.start('fetch', json, function(err, res) {
  // res  
})
```

Get status of a job:
```javascript
priceonomics.status('c48a283230314e96b2655a768c7cb327', function(err, res) {
  // res
})
```

### API

#### new Priceonomics(xAccessKey)

Create a new Priceonomics instance to interface with Analysis Engine API.

#### .list(fn)

This [endpoint](http://docs.analysisengine.apiary.io/#reference/applications/application-listings/get-listings-for-all-analysis-engine-applications) returns a list of summaries for all applications currently available on the Analysis Engine. For greater detail, including input/output schemas, there is another endpoint for interacting directly with each application.

Sample response:
```javascript
{
  "timestamp": "2014-08-27T15:16:59.269365+00:00",
  "error": null,
  "data": {
    {
      "apps": [
        {
        "name": "Fetch",
        "slug": "fetch",
        "brief_description": "The most useful app available on the Introspect API!",
        "created": "2014-08-27T15:16:59.269365+00:00",
        "modified": "2014-08-27T15:16:59.269365+00:00",
        "latest_version": "2.0",
        },
        {
          "name": "HTML Bug Detector",
          "slug": "bugify",
          "brief_description": "Detect hundreds of third-party extensions and embedded bugs in HTML content!",
          "created": "2014-08-27T15:16:59.269365+00:00",
          "modified": "2014-08-27T15:16:59.269365+00:00",
          "latest_version": "3.0",
        },
      ],
    }
  }
}
```

#### .details(appSlug, fn)

This [endpoint](http://docs.analysisengine.apiary.io/#reference/applications/application-interaction/get-application-details) returns detailed information about the specified application. Before sending input to an application, users should verify that the application input is constructed such that it validates against the `input_schema`, as defined by the [JSON Schema draft v4](https://github.com/json-schema/json-schema). The `output_schema` defines what a user should expect as output from an application.

Sample response:
```javascript
{
  "timestamp": "2014-08-27T15:16:59.269365+00:00",
  "error": null,
  "data": {
    {
      "app": {
        "name": "Fetch",
        "slug": "fetch",
        "brief_description": "The most useful app available on the Introspect API!",
        "detailed_description": "Fetch is an Introspect core application for making HTTP requests. It aims to provide high-reliability results with useful features such as country routing selection and encoding normalization. Output can be piped to numerous other Introspect applications for more advanced analysis or recursive crawling.",
        "created": "2014-08-27T15:16:59.269365+00:00",
        "modified": "2014-08-27T15:16:59.269365+00:00",
        "latest_version": "6.0",
        "input_schema": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string"
            },
            "encoding": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "binary": {
              "type": "boolean"
            },
          },
          "required": [
            "url",
          ],
        },
        "output_schema": {
          "type": "object",
          "properties": {
            "url": {
             "type": "string"
            },
            "response": {
              "type": "number"
            },
            "content": {
              "type": "string"
            },
            "encoding": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
          },
          "required": [
            "url",
            "response",
            "content",
            "type",
          ],
        },
      },
    }
  }
}
```

#### .start(appSlug, json, fn)

The [endpoint](http://docs.analysisengine.apiary.io/#reference/applications/application-interaction/send-input-to-application) is the only way of invoking applications. Input data (`json`) is sent via POST as `application/json` content, and should validate against the input schema for the specified application. This is a synchronous example so that the API returns the output as soon as it is available (if the request can be completed in less than a minute). If the `async` field is set to `true` in the request body, the API will immediately return a `job_id` string which can be used to query the asynchronous results endpoint at `/v1/jobs/{job_id}`.

Sample response:
```javascript
{
  "timestamp": "2014-12-10T00:55:02.175069+00:00",
  "data": {
    "binary": false,
    "url": "http://priceonomics.com/porsche-the-hedge-fund-that-also-made-cars/",
    "country": "US",
    "content": "<!doctype html><html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\"> [...] </body></html>",
    "type": "text/html",
    "response": 200
  },
  "error": false
}
```

#### .status(jobId, fn)

This [endpoint](http://docs.analysisengine.apiary.io/#reference/applications/asynchronous-job-results/query-for-asynchronous-job-results) returns the status of a job. You may only query for job ids that are associated with your account (as determined by the auth token included in the header). Jobs which have not yet completed will return an error.

Sample response:
```javascript
{
  "timestamp": "2014-12-19T16:05:43.564356+00:00",
  "data": {
    "job": {
      "handler_return_code": 200,
      "data": {
        "binary": false,
        "url": "http://curlmyip.com",
        "country": "DE",
        "content": "178.162.205.24\n",
        "type": "text/plain",
        "response": 200
      },
      "complete": true
    }
  },
  "error": false
}
```

## License (MIT)

    WWWWWW||WWWWWW
     W W W||W W W
          ||
        ( OO )__________
         /  |           \
        /o o|    MIT     \
        \___/||_||__||_|| *
             || ||  || ||
            _||_|| _||_||
           (__|__|(__|__|

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.