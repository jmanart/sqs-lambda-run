// A simple wrapper to receive and delete messages from an sqs queue

import * as AWS from "aws-sdk"

export class SQS {
    readonly sqs: AWS.SQS
    readonly sqsUrl: string

    constructor(endpoint: string, sqsUrl:string) {
        this.sqs = new AWS.SQS({
            apiVersion: "2015-03-31",
            endpoint,
        })
        this.sqsUrl = sqsUrl
    }

    async receiveMessage(): Promise<AWS.SQS.MessageList | undefined> {

        const params: AWS.SQS.Types.ReceiveMessageRequest = {
            QueueUrl: this.sqsUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 10,
            WaitTimeSeconds: 5, // how long to wait before returning
        }
        const { Messages } = await this.sqs.receiveMessage(params).promise()
        return Messages
    }

    async deleteMessage(receiptHandle: string | undefined) {
        if (!receiptHandle) {
            return
        }

        await this.sqs.deleteMessage({
            QueueUrl: this.sqsUrl,
            ReceiptHandle: receiptHandle,
        }).promise()
    }
}
