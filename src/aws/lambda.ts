// A simple wrapper class to run lambdas

import * as AWS from "aws-sdk"

export class Lambda {
    readonly lambda: AWS.Lambda
    readonly handler: string

    constructor(endpoint: string, handler:string) {
        this.lambda = new AWS.Lambda({
            apiVersion: "2015-03-31",
            endpoint,
        })
        this.handler = handler
    }

    async run(payload: string | undefined) {
        if (!payload) {
            return
        }
        const params: AWS.Lambda.Types.InvocationRequest = {
            FunctionName: this.handler,
            InvocationType: "Event",
            Payload: payload,
        };
        console.log("payload", payload);
        await this.lambda.invoke(params).promise()
    }
}
