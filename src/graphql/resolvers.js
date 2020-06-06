const { delegateToSchema } = require('@graphql-tools/delegate')

const truckFbrTruckResolver = (fdpSchema) => ({
  selectionSet: '{ id }',
  resolve(truck, args, context, info) {
    return delegateToSchema({
      schema: fdpSchema,
      option: 'query',
      fieldName: 'FBRTruck',
      args: {
        ...args,
        id: truck.id,
      },
      context,
      info,
    })
  },
})

const resolvers = ({ fdpSchema }) => ({
  Truck: {
    fbrTruck: truckFbrTruckResolver(fdpSchema),
  },
})

module.exports = resolvers
