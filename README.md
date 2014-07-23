
# Redmine Issues Rest API [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Redmine Issues Rest API Client for node.js

## Getting Started

#### Install globally:

```
npm install -g redmine-issues
```

## Options

 - `-h, --help`  Get usage information.
 - `-V, --version`  Get the version number.
 - `-c, --config`  Set main configuration.
 - `-q, --query`  Get issues for your user.
 - `-l, --limit`  Limit issues query.
 - `-i, --issue`  Set and Get issue information.
 - `-p, --percent`  Set issue percent.
 - `-m, --message`  Set issue message/note.
 - `-e, --estimated`  Set issue estimated hours.


### -c, --config
Type: `String`
Syntax: `key:value`

Set main configuration, can only be used with `sudo`, for security reasons.

#### domain
Required: `true`
```
sudo redmine -c domain:yourdomain.com
```

#### apikey
Required: `true`
```
sudo redmine -c apikey:here_your_api_key
```

#### port
Default: `80`
```
sudo redmine -c port:80
```

#### contenttype
Default: `application/json`
```
sudo redmine -c contenttype:application/json
```

#### head
Default: `green`
```
sudo redmine -c head:blue
```

#### border
Default: `cyan`
```
sudo redmine -c border:grey
```

### -q, --query
Type: `Boolean`

Return a redmine issues list of the current user.

```
redmine -q
```

#### -l, --limit
Optional: `true`
Default: `5`
```
redmine -q -l 20
```


[downloads-image]: http://img.shields.io/npm/dm/redmine-issues.svg
[npm-url]: https://www.npmjs.org/package/redmine-issues
[npm-image]: http://img.shields.io/npm/v/redmine-issues.svg

[travis-url]: https://travis-ci.org/jansanchez/redmine-issues
[travis-image]: http://img.shields.io/travis/jansanchez/redmine-issues.svg
