const { stitchSchemas } = require('@graphql-tools/stitch')
const { delegateToSchema } = require('@graphql-tools/delegate')
const { getNamedType, Kind } = require('graphql')

const fdpSchema = require('./fdpSchema')
const planSchema = require('./planSchema')

async function getSchema() {
  return stitchSchemas({
    subschemas: [
      { schema: fdpSchema },
      {
        schema: planSchema,
        merge: {
          FBRTruck: (originalResult, context, info, schema, selectionSet) =>
            delegateToSchema({
              schema,
              operation: 'query',
              fieldName: 'dataSources',
              returnType: getNamedType(info.returnType),
              args: { dataType: 'Fbr' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.INLINE_FRAGMENT,
                    typeCondition: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: 'FBRDataSource',
                      },
                    },
                    selectionSet: {
                      kind: Kind.SELECTION_SET,
                      selections: [
                        {
                          kind: Kind.FIELD,
                          name: {
                            kind: Kind.NAME,
                            value: 'fbrTruck',
                          },
                          arguments: [
                            {
                              kind: Kind.ARGUMENT,
                              name: {
                                kind: Kind.NAME,
                                value: 'truckId',
                              },
                              value: {
                                kind: Kind.STRING,
                                value: originalResult.id,
                              },
                            },
                          ],
                          selectionSet,
                        },
                      ],
                    },
                  },
                ],
              },
              context,
              info,
              skipTypeMerging: true,
            }),
        },
      },
    ],
  })
}

module.exports = { getSchema }
