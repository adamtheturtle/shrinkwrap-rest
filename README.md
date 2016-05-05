# shrinkwrap-rest
REST API to create shrink-wrap files

TODO:
Git ignore for node

docker build -t shrinkwrap .; and docker rm -f apples; or  true; and docker run -p 8085:8080 -d --name apples shrinkwrap


```
set -x PACKAGE_JSON (cat example_package.json | base64)
set -x KEY (cat ~/.ssh/auth0 | base64)

curl -H "Content-type: application/json" \
  -d "{\"package_file\": \"$PACKAGE_JSON\", \"github_ssh_key\": \"$KEY\"}" \
  http://127.0.0.1:8085/v1/shrinkwrap
```