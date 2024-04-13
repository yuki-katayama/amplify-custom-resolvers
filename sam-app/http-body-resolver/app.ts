import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// POSTリクエストのボディを扱う例
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    try {
        // リクエストボディの解析
        const requestBody = JSON.parse(event.body);
        const queryParam = event.queryStringParameters;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Received POST body: name = ${requestBody.name}, content = ${requestBody.content}, query: name = ${queryParam.name}, content = ${queryParam.content}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while processing your request',
            }),
        };
    }
};
