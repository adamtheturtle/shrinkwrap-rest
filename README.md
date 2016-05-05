# shrinkwrap-rest
REST API to create shrink-wrap files

TODO:
Git ignore for node

docker build -t shrinkwrap .; and docker rm -f apples; or  true; and docker run -p 8085:8080 -d --name apples shrinkwrap

curl -H "Content-type: application/json" \
  -d '{"package_file": "ADAM", "github_ssh_key": "SSH_KEY"}' \
  http://127.0.0.1:8085/v1/shrinkwrap