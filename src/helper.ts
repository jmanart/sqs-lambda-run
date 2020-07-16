export function getConfig() {
    const sqsUrl = process.env.SQS_URL
    const createQueue = Boolean(process.env.CREATE_QUEUE)
    const lambdaHandler = process.env.LAMBDA_HANDLER
    const lambdaEndpoint = process.env.LAMBDA_ENDPOINT

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
    return {
        sqsUrl,
        createQueue,
        lambdaHandler,
        lambdaEndpoint,
    }
}
