Based on https://github.com/aws-samples/serverless-app-examples/blob/master/javascript/sqs-poller/index.js

## Usage of the config file

In docker-compose.yaml:

```yaml
  sqs:
    image: roribio16/alpine-sqs
    ports:
      - "9324:9324"

  lambda:
    image: 'lambda:local'
    ports:
      - 9001:9001
    build: lambda

  sqs-lambda-run:
    image: 'jmanart/sqs-lambda-run'
    depends_on:
      - sqs
    volumes:
      - ./config/sqs.json:/etc/sqs/sqs.json
    environment:
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_KEY}"
```

In the config file:

```json
{
  "queues": [
    {
      "host": "http://sqs:9324",
      "name": "queue/default",
      "lambda": {
        "handler": "index.handler",
        "endpoint": "http://lambda:9001"
      }
    }
  ]
}
```
