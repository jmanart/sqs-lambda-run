import { getConfig } from "./helper"
import { SQS } from "./aws/sqs"
import { Lambda } from "./aws/lambda"
import { Config } from "./model/config";

async function poll(
    sqs: SQS,
    lambda: Lambda,
) {

    const Messages = await sqs.receiveMessage()
    if (!Messages) {
        return;
    }

    await Promise.all(Messages.map(async message => {
        try {
            await lambda.run(message.Body);
        } catch (err) {
            console.error("Error invoking Lambda function", err);
            return;
        }

        await sqs.deleteMessage(message.ReceiptHandle);
    }))
}

async function getPairs(config: Config): Promise<{ lambda: Lambda, sqs: SQS }> {
    const sqs = new SQS(config.sqsUrl);

    if (config.createQueue) {
        await sqs.createQueue();
    }

    const lambda = new Lambda(config.lambdaEndpoint, config.lambdaHandler);
    return { lambda, sqs };
}

async function runPair(sqs: SQS, lambda: Lambda) {
    // TODO: register handler for interruptions
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await poll(sqs, lambda);
    }
}

async function infinityRun() {
    const configDefinitions = getConfig();
    const pairs = [];

    for (const config of configDefinitions) {
        pairs.push(await getPairs(config));
    }

    await Promise.all(pairs.map(({ lambda, sqs }) => runPair(sqs, lambda)));
}

console.log("STARTING!");
infinityRun();
