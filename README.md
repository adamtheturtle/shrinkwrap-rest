# shrinkwrap-rest

This is a REST API to create NPM Shrinkwrap files.

## Running the service

This is a service which runs in a Docker container.

```
$ docker build -t shrinkwrap .
$ docker rm -f shrinkwrap_container
$ docker run -p 8085:8080 -d --name shrinkwrap_container shrinkwrap
```

## API

### POST /v1/shrinkwrap

Parameters:
* package_file (string) - base64 encoded ``package.json`` file.
* github_ssh_key (string) - base64 encoded SSH key with access to all repositories needed by ``npm install`` of the given ``package.json`` file.

Request headers:
* Content-Type - application/json

Response JSON Object:
* The contents of an ``npm-shrinkwrap.json`` for the given ``package.json``.

Response Headers:
* 200 OK
* 500 Internal Server Error

#### Example

Using `fish`, can be adjusted for different shells:

```
$ set -x PACKAGE_JSON (cat example_package.json | base64)
$ set -x KEY (cat ~/.ssh/auth0 | base64)
$ set -x URL http://127.0.0.1:8085

$ curl \
  -X POST \
  -H "Content-type: application/json" \
  -d "{\"package_file\": \"$PACKAGE_JSON\", \"github_ssh_key\": \"$KEY\"}" \
  $URL/v1/shrinkwrap
```

## Future work

This has limited error handling
This has no CI, which should run tests and e.g. linting
This uses exec processes, but could probably use Uber's shrinkwrap library to avoid flakiness
This should be hooked up to a domain
