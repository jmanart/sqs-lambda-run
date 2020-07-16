// A simple wrapper to receive and delete messages from an sqs queue

import * as AWS from "aws-sdk"

export class SQS {
    readonly sqs: AWS.SQS
    readonly sqsEndpoint: string
    readonly sqsUrl: string
    readonly queueName: string

    constructor(sqsUrl: string) {
        const splitURL = sqsUrl.split("/");
        const sqsEndpoint = splitURL[0] + "//" + splitURL[2];
        const queueName = splitURL[splitURL.length - 1];

        this.sqs = new AWS.SQS({
            apiVersion: "2015-03-31",
            endpoint: sqsEndpoint
        });
        this.sqsEndpoint = sqsEndpoint;
        this.sqsUrl = sqsUrl;
        this.queueName = queueName;
    }

    async createQueue(): Promise<any> {
        try {
            const params = {
                QueueName: this.queueName,
            };
            await this.sqs.createQueue(params).promise();
            console.log("DONE CREATING QUEUE!");
        } catch(err) {
            if (err.toString().indexOf("NetworkingError: connect ECONNREFUSED") >= 0) {
                console.log("WAITING FOR SQS...");
                await new Promise(resolve => setTimeout(resolve, 1000))
                await this.createQueue();
            } else {
                console.log(err.toString());
            }
        }
    }

    async receiveMessage(): Promise<AWS.SQS.MessageList | undefined> {

        const params: AWS.SQS.Types.ReceiveMessageRequest = {
            QueueUrl: this.sqsUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 10,
            WaitTimeSeconds: 5, // how long to wait before returning
        }
        const { Messages } = await (this.sqs as AWS.SQS).receiveMessage(params).promise()
        return Messages
    }

    async deleteMessage(receiptHandle: string | undefined) {
        if (!receiptHandle) {
            return
        }

        await (this.sqs as AWS.SQS).deleteMessage({
            QueueUrl: this.sqsUrl,
            ReceiptHandle: receiptHandle,
        }).promise()
    }
}
