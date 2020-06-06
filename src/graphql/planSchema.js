const { makeExecutableSchema } = require('@graphql-tools/schema')

const data = require('../../data/plan.json')

const typeDefs = `
  scalar DateTime
  scalar Number

  type Truck {
    id: String
    truckParticipations: [TruckParticipation!]
  }

  type TruckParticipation {
    id: String
    planId: String!
    truckId: String!
    joinDate: DateTime!
    leaveDate: DateTime!
  }

  type Plan {
    id: String
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    timeZoneOffset: Number
    trucks: [Truck]
  }

  type Query {
    listPlans: [Plan]
    getPlanById(id: String!): Plan
  }
`

const resolvers = {
  Query: {
    listPlans: () => data.plans,
    getPlanById: (_, args) => data.plans.find((plan) => plan.id === args.id),
  },
}

const planSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

module.exports = planSchema
