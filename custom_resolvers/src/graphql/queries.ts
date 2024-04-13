/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const lambdaResolver = /* GraphQL */ `query LambdaResolver($msg: String) {
  lambdaResolver(msg: $msg)
}
` as GeneratedQuery<
  APITypes.LambdaResolverQueryVariables,
  APITypes.LambdaResolverQuery
>;
export const lambdaPipelineResolver = /* GraphQL */ `query LambdaPipelineResolver($msg: String) {
  lambdaPipelineResolver(msg: $msg)
}
` as GeneratedQuery<
  APITypes.LambdaPipelineResolverQueryVariables,
  APITypes.LambdaPipelineResolverQuery
>;
export const lambdaAccessDynamoResolver = /* GraphQL */ `query LambdaAccessDynamoResolver($id: String) {
  lambdaAccessDynamoResolver(id: $id) {
    id
    name
    content
    img
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LambdaAccessDynamoResolverQueryVariables,
  APITypes.LambdaAccessDynamoResolverQuery
>;
export const lambdaAccessDynamoDBResolver = /* GraphQL */ `query LambdaAccessDynamoDBResolver($id: String) {
  lambdaAccessDynamoDBResolver(id: $id)
}
` as GeneratedQuery<
  APITypes.LambdaAccessDynamoDBResolverQueryVariables,
  APITypes.LambdaAccessDynamoDBResolverQuery
>;
export const httpResolver = /* GraphQL */ `query HttpResolver {
  httpResolver
}
` as GeneratedQuery<
  APITypes.HttpResolverQueryVariables,
  APITypes.HttpResolverQuery
>;
export const httpRequestHeaderResolver = /* GraphQL */ `query HttpRequestHeaderResolver {
  httpRequestHeaderResolver
}
` as GeneratedQuery<
  APITypes.HttpRequestHeaderResolverQueryVariables,
  APITypes.HttpRequestHeaderResolverQuery
>;
export const httpPathParamResolver = /* GraphQL */ `query HttpPathParamResolver($params: QueryHttpPathParamResolverParamsInput!) {
  httpPathParamResolver(params: $params)
}
` as GeneratedQuery<
  APITypes.HttpPathParamResolverQueryVariables,
  APITypes.HttpPathParamResolverQuery
>;
export const httpQueryParamResolver = /* GraphQL */ `query HttpQueryParamResolver(
  $params: QueryHttpQueryParamResolverParamsInput!
  $query: QueryHttpQueryParamResolverQueryInput!
) {
  httpQueryParamResolver(params: $params, query: $query)
}
` as GeneratedQuery<
  APITypes.HttpQueryParamResolverQueryVariables,
  APITypes.HttpQueryParamResolverQuery
>;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
    id
    name
    content
    img
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      content
      img
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
