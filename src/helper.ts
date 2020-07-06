export function getConfig() {
    const sqsUrl = process.env.SQS_URL
    const handler = process.env.LAMBDA_HANDLER
    const endpoint = process.env.LAMBDA_ENDPOINT

    console.debug("sqslUrl", sqsUrl);
    console.debug("handler", handler);
    console.debug("endpoint", endpoint);

    if (!sqsUrl) {
        throw new Error("Missing SQS_URL");
    }
    if (!handler) {
        throw new Error("Missing LAMBDA_HANDLER");
    }
    if (!endpoint) {
        throw new Error("Missing LAMBDA_ENDPOINT");
    }

    return {
        sqsUrl,
        handler,
        endpoint,
    }
}
