import { getConfig } from "./helper"
import { SQS } from "./aws/sqs"
import { Lambda } from "./aws/lambda"

async function poll(
    sqs: SQS,
    lambda: Lambda,
) {

    const Messages = await sqs.receiveMessage()
    if (!Messages) {
        return
    }

    await Promise.all(Messages.map(async (message: any) => {
        try {
            await lambda.run(message.Body)
        } catch (err) {
            console.error("Error invoking Lambda function", err)
            return
        }

        await sqs.deleteMessage(message.ReceiptHandle)
    }))
}

async function infinityRun() {
    const configs = getConfig();

    const pairs = [];

    for (const config of configs) {
        const sqs = new SQS(config.sqsUrl);

        if (config.createQueue) {
            await sqs.createQueue();
        }

        const lambda = new Lambda(config.lambdaEndpoint, config.lambdaHandler);
        pairs.push({ lambda, sqs });
    }

    // TODO: register handler for interruptions
    while (true) {
        for (const { lambda, sqs } of pairs) {
            await poll(sqs, lambda)
        }
    }
}

console.log("STARTING!");
infinityRun()
