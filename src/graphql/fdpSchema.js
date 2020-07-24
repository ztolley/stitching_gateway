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
    fbrTruck: (parent, args) => {
      const result = args.truckId
        ? parent.fbrTruck.filter((fbrTruck) => fbrTruck.uuid === args.truckId)
        : parent.fbrTruck

      return result
    },
  },
  Query: {
    dataSources: (_, { dataType }) => {
      return data.filter((dataItem) => dataItem.dataType === dataType)
    },
  },
}

const fdpSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

module.exports = fdpSchema
