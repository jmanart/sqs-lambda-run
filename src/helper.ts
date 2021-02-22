const fs = require("fs");
const configFilePath = "/etc/sqs/sqs.json";

export function getConfig() {
    let configFile = null;

    if (fs.existsSync(configFilePath)) {
        configFile = JSON.parse(fs.readFileSync(configFilePath).toString("ascii"));
        return configFile.queues.map((queue: any) => ({
            sqsUrl: `${queue.host}/${queue.name}`,
            createQueue: true,
            lambdaHandler: queue.lambda.handler,
            lambdaEndpoint: queue.lambda.endpoint,
        }));
    }

    const sqsUrl = process.env.SQS_URL;
    const createQueue = Boolean(process.env.CREATE_QUEUE);
    const lambdaHandler = process.env.LAMBDA_HANDLER;
    const lambdaEndpoint = process.env.LAMBDA_ENDPOINT;

    console.debug("sqslUrl", sqsUrl);
    console.debug("lambdaHandler", lambdaHandler);
    console.debug("lambdaEndpoint", lambdaEndpoint);
    console.debug("createQueue", createQueue)

    if (!sqsUrl) {
        throw new Error("Missing SQS_URL");
    }
    if (!lambdaHandler) {
        throw new Error("Missing LAMBDA_HANDLER");
    }
    if (!lambdaEndpoint) {
        throw new Error("Missing LAMBDA_ENDPOINT");
    }
    return [{
        sqsUrl,
        createQueue,
        lambdaHandler,
        lambdaEndpoint,
    }];
}
