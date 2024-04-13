import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // ここにLambdaのロジックを追加
        console.log(event);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Lambda Http Resolver Function',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred in Lambda Http Resolver Function',
            }),
        };
    }
};
