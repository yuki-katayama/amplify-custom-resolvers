const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MESSAGE7E7UC22DCFEMZGLGFZ3M3PKFCIDEV_ARN
	STORAGE_MESSAGE7E7UC22DCFEMZGLGFZ3M3PKFCIDEV_ARN
	STORAGE_MESSAGE7E7UC22DCFEMZGLGFZ3M3PKFCIDEV_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
    console.log("received event:");
    console.log(event);

    const tableName = process.env.STORAGE_MESSAGENCOLY7GESJBDNMMBKRHDU53YLADEV_NAME;
    const id = event.arguments.id; // AppSync イベントから ID を取得
    try {
        const result = await dynamodb.get({
            TableName: tableName, // この行でテーブル名を指定
            Key: { id: id }
        }).promise();
        console.log(result.Item)
        return result.Item;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get item from DynamoDB");
    }
};