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

    await Promise.all(Messages.map(async message => {
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
    const {
        sqsUrl,
        createQueue,
        lambdaHandler,
        lambdaEndpoint,
    } = getConfig()

    const sqs = new SQS(sqsUrl);

    if (createQueue) {
        await sqs.createQueue();
    }

    const lambda = new Lambda(lambdaEndpoint, lambdaHandler)

    // TODO: register handler for interruptions
    while (true) {
        await poll(sqs, lambda)
    }
}

console.log("STARTING!")
infinityRun()
