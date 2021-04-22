export interface Config {
    sqsUrl: string;
    createQueue: boolean;
    lambdaHandler: string;
    lambdaEndpoint: string;
}