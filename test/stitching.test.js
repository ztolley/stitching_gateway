/* istanbul ignore file */
const { graphql } = require('graphql')
const { getSchema } = require('../src/graphql')

describe('Gateway', () => {
  let schema
  let result

  beforeEach(async () => {
    schema = await getSchema()
  })

  describe('when a user asks for the name of a truck in a plan', () => {
    beforeEach(async () => {
      const query = `
        query StitchedPlan {
          getPlanById(id: "b6276400-9e2b-48c7-af57-7b799e83b4c1") {
            id
            name
            trucks {
              truckName
              burnRates {
                speed
                mpg
              }
              truckParticipations {
                joinDate
                leaveDate
              }
            }
          }
        }
      `

      const response = await graphql(schema, query)

      console.log(response.errors);

      result = response.data.getPlanById
    })

    it('should return the name of a truck', () => {
      const fbrTruck = result.trucks[0].fbrTruck
      expect(fbrTruck.truckName).toEqual('Danger')
    })

    it('should return the mpg data for the truck', () => {
      const fbrTruck = result.trucks[0].fbrTruck
      expect(fbrTruck.burnRates[0].mpg).toEqual(50)
    })
  })
})
