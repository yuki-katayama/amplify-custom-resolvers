import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// クエリパラメータを使用する例
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    try {
        const id = event.pathParameters?.id; // パスパラメータの取得
        const queryParam = event.queryStringParameters; // クエリパラメータの取得
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `HttpQueryResolver Function Query: ${queryParam.name} ${queryParam.content}, PathParam: ${id}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred in HttpQueryResolver Function',
            }),
        };
    }
};
