import { GraphQLClient } from 'graphql-request'

const url = 'http://localhost:5000/graphql'
const client = new GraphQLClient(url,{method: 'POST'})

export const makeRequest = (query, variables) =>
    client.request(query, variables)


