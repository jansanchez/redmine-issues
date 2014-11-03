

# Redmine Issues Rest API [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Redmine Issues Rest API Client for node.js

## Getting Started

#### Install globally:

```
npm install -g redmine-issues
```

## Options

 - `-h, --help`  Get usage information.
 - `-V, --version`  Get version number.
 - `-c, --config`  Set main configuration.
 - `-q, --query`  Get user issues.
 - `-l, --limit`  Limit the number of query issues.
 - `-i, --issue`  Set and Get issue information.
 - `-p, --percent`  Set issue percent.
 - `-m, --message`  Set issue message/note.
 - `-e, --estimated`  Set issue estimated hours.


### -c, --config
Type: `String`
Syntax: `key:value`

For security reasons, setting the main configuration can only be used with `sudo`.

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

### -i, --issue
Type: `Number`

Set and Get issue information.

### Get

#### -i, Get information of issue #45678.

```
redmine -i 45678
```

### Set

#### -p, --percent
Set progress to 15%.

```
redmine -i 45678 -p 15
```

#### -m, --message
Set note.

```
redmine -i 45678 -m "my note"
```

#### -e, --estimated
Set estimated hours to 9.

```
redmine -i 45678 -e 9
```

### Combining options

Set percent to 25% and Set note.

```
redmine -i 45678 -p 25 -m "my note"
```

Set percent to 30%, Set note and Set estimated hours to 5.

```
redmine -i 45678 -p 30 -m "my note" -e 5
```

### Additional features

If you're using git and the name of your branch is issues#45678 then redmine-issues automatically recognizes the issue id (45678) so that you don't have to indicate it.
so that you don't have to type it.

```
redmine -p 35
```

No need to specify the id of the issue.


[downloads-image]: http://img.shields.io/npm/dm/redmine-issues.svg
[npm-url]: https://www.npmjs.org/package/redmine-issues
[npm-image]: http://img.shields.io/npm/v/redmine-issues.svg

[travis-url]: https://travis-ci.org/jansanchez/redmine-issues
[travis-image]: http://img.shields.io/travis/jansanchez/redmine-issues.svg

