/* istanbul ignore file */
const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const { getSchema } = require('./graphql')

const port = process.env.PORT || 6107

async function run() {
  const schema = await getSchema()

  const server = new ApolloServer({
    context: ({ req }) => ({
      headers: req.headers,
    }),
    introspection: true,
    playground: true,
    schema,
  })

  const app = express()

  server.applyMiddleware({ app, path: '/' })
  app.listen(port, () => {
    console.log(`🚀 API Gateway Server ready at ${port}`)
  })
}

try {
  run()
} catch (e) {
  console.error(e)
}
