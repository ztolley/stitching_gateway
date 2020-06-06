/* eslint-disable no-underscore-dangle */
const { makeExecutableSchema } = require('@graphql-tools/schema')
const data = require('../../data/fdp.json')

const typeDefs = `
  enum DataTypes {
    Fbr
  }

  interface DataSource {
    dataType: String
  }

  type FBRDataSource implements DataSource {
    dataType: String
    fbrTruck(truckId: String): [FBRTruck]
  }

  type FBRTruck {
    uuid: ID!
    truckName: String!
    burnRates: [BurnRate]
  }

  type BurnRate {
    speed: Int
    mpg: Int
  }

  type Query {
    dataSources(dataType: DataTypes): [DataSource]
  }
`

const resolvers = {
  DataSource: {
    __resolveType() {
      return 'FBRDataSource'
    },
  },
  FBRDataSource: {
    fbrTruck: (parent, args) =>
      args.truckId
        ? parent.fbrTruck.filter((fbrTruck) => fbrTruck.uuid === args.truckId)
        : parent.fbrTruck,
  },
  Query: {
    dataSources: (_, { dataType }) =>
      data.filter((dataItem) => dataItem.dataType === dataType),
  },
}

const fdpSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

module.exports = fdpSchema
