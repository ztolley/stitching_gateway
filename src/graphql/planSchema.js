const { makeExecutableSchema } = require('@graphql-tools/schema')

const data = require('../../data/plan.json')

const typeDefs = `
  scalar DateTime
  scalar Number

  type FBRTruck {
    uuid: ID!
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
    trucks: [FBRTruck]
  }

  type Query {
    listPlans: [Plan]
    getPlanById(id: String!): Plan
    getTruckById(uuid: ID!): FBRTruck
  }
`

const resolvers = {
  Query: {
    listPlans: () => data.plans,
    getPlanById: (_, args) => data.plans.find((plan) => plan.id === args.id),
    getTruckById: (_, args) => data.trucks.find((truck) => truck.uuid === args.uuid),
  },
}

const planSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

module.exports = planSchema
