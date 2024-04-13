import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamodb = new DocumentClient();

export const batchAddMessage = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { messages } = JSON.parse(event.body);

        // Validate the input
        if (!Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. Messages should be an array.' }),
            };
        }

        // Prepare the batch write request
        const params: DocumentClient.BatchWriteItemInput = {
            RequestItems: {
                'your-dynamodb-table-name': messages.map((message) => ({
                    PutRequest: {
                        Item: {
                            // Add your message properties here
                            // For example:
                            id: message.id,
                            text: message.text,
                            createdAt: new Date().toISOString(),
                        },
                    },
                })),
            },
        };

        // Execute the batch write request
        await dynamodb.batchWrite(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Messages added successfully.' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error.' }),
        };
    }
};