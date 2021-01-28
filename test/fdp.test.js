/* istanbul ignore file */
const { graphql } = require('graphql')
const { getSchema } = require('../src/graphql')

describe('FDP Schema', () => {
  let schema
  let result

  beforeEach(async () => {
    schema = await getSchema()
  })

  describe('When a user requests a list of trucks', () => {
    beforeEach(async () => {
      const query = `
        query Trucks {
          dataSources(dataType: Fbr) {
            ... on FBRDataSource {
              fbrTruck {
                uuid
                truckName
              }
            }
          }
        }
      `

      const response = await graphql(schema, query)
      result = response.data.dataSources[0]
    })

    it('should return a list of trucks', () => {
      expect(result.fbrTruck).toHaveLength(2)
    })

    it('should information about the truck', () => {
      expect(result.fbrTruck[0]).toHaveProperty('truckName', 'Danger')
    })
  })

  describe('when a user requests a single truck', () => {
    beforeEach(async () => {
      const query = `
        query TruckData {
          dataSources(dataType: Fbr) {
            ... on FBRDataSource {
              fbrTruck(truckId: "a6276400-9e2b-48c7-af57-7b799e83b4c1") {
                uuid
                truckName
              }
            }
          }
        }
      `

      const response = await graphql(schema, query)
      result = response.data.dataSources[0]
    })

    it('should return a truck', () => {
      expect(result.fbrTruck).toHaveLength(1)
    })

    it('should return information about the truck', () => {
      expect(result.fbrTruck[0]).toHaveProperty('truckName', 'Danger')
    })
  })
})
