/* istanbul ignore file */
const { graphql } = require('graphql')
const { getSchema } = require('../src/graphql')

describe('Plan Schema', () => {
  let schema
  let result

  beforeEach(async () => {
    schema = await getSchema()
  })

  describe('When a user asks for information about a plan', () => {
    beforeEach(async () => {
      const query = `
        query Plan {
          getPlanById(id: "b6276400-9e2b-48c7-af57-7b799e83b4c1") {
            id
            name
            trucks {
              uuid
              truckParticipations {
                joinDate
                leaveDate
              }
            }
          }
        }
      `

      const response = await graphql(schema, query)
      result = response.data.getPlanById
    })

    it('should return plan name', () => {
      expect(result.name).toEqual('My plan')
    })

    it("should return a list of truck id's associated with the plan and their join/leave dates", () => {
      const truck = result.trucks[0]

      expect(truck.uuid).toEqual('a6276400-9e2b-48c7-af57-7b799e83b4c1')
      expect(truck.truckParticipations[0].joinDate).toEqual(
        '2020-10-01T17:08:49.000-0430'
      )
      expect(truck.truckParticipations[0].leaveDate).toEqual(
        '2020-10-10T17:08:49.000-0430'
      )
    })
  })
})
