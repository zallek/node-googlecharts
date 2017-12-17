# Google Chart for Node using jsdom

[![Build Status][travis-image]][travis-url]

## Requirements

- Node.js > 4.0
- ICU4C

## ICU4C dependency

Google Chart needs full internationalization support whereas it's not built in by default on nodejs. You can either:
- Use [full-icu](https://www.npmjs.com/package/full-icu) npm package which requires running node with a specific environment  variable.
- Or, build Node.js with an embedded icu. [more info](https://github.com/nodejs/node/wiki/Intl#building-node-with-an-embedded-icu)

### Run binary

```SH
node bin/node-googlecharts <ChartWrapperOptions>
```
`ChartWrapperOptions` is the serialized JSON options to give to `ChartWrapper`.

## FAQ

#### Who uses it?

[lambda-googlechart](https://github.com/slashdotdash/lambda-googlecharts) uses it to generate charts images on AWS Lambda.

#### Why jsdom?

Google Charts needs a browser-like environment to run in. Jsdom is a light DOM implementation, much faster than PhantomJS.

#### Why Node.js > 4.0?

This is a requirement of jsdom itself.

#### Why does it need ICU4C?

Google Chart needs full internationalization support whereas it's not built in by default on nodejs.

[travis-url]: https://travis-ci.org/slashdotdash/node-googlecharts
[travis-image]: https://travis-ci.org/slashdotdash/node-googlecharts.svg?branch=master
