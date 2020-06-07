const { graphql } = require('graphql')

const truckFbrTruckResolver = (fdpSchema) => ({
  selectionSet: '{ id }',
  async resolve(truck) {
    const query = `
      query {
        dataSources(dataType: Fbr) {
          ... on FBRDataSource {
            fbrTruck(truckId: "${truck.id}") {
              uuid
              truckName
              burnRates {
                speed
                mpg
              }
            }
          }
        }
      }
    `

    const response = await graphql(fdpSchema, query)
    return response.data.dataSources[0].fbrTruck[0]
  },
})

const resolvers = ({ fdpSchema }) => ({
  Truck: {
    fbrTruck: truckFbrTruckResolver(fdpSchema),
  },
})

module.exports = resolvers
