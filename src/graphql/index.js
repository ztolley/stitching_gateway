const { stitchSchemas } = require('@graphql-tools/stitch')

const fdpSchema = require('./fdpSchema')
const typeDefs = require('./linkTypeDefs')
const planSchema = require('./planSchema')
const resolvers = require('./resolvers')

async function getSchema() {
  return stitchSchemas({
    resolvers: resolvers({ fdpSchema, planSchema }),
    subschemas: [{ schema: fdpSchema }, { schema: planSchema }],
    typeDefs,
  })
}

module.exports = { getSchema }
