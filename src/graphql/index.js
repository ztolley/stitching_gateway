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
          FBRTruck: {
            selectionSet: `{ uuid }`,
            resolve: (originalResult, context, info, schema, selectionSet) => {
              console.log(
                'AT LEAST I AM IN THE RESOLVER',
                selectionSet,
                originalResult
              )
              return delegateToSchema({
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
                                  value: originalResult.uuid,
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
              })
            },
          },
        },
      },
    ],
    mergeTypes: true,
  })
}

module.exports = { getSchema }
