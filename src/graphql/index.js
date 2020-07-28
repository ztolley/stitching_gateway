const { stitchSchemas } = require('@graphql-tools/stitch')
const { delegateToSchema } = require('@graphql-tools/delegate')
const { Kind, GraphQLList } = require('graphql')

const fdpSchema = require('./fdpSchema')
const planSchema = require('./planSchema')

async function getSchema() {
  return stitchSchemas({
    subschemas: [
      {
        schema: planSchema,
        merge: {
          FBRTruck: {
            selectionSet: `{ uuid }`,
            fieldName: 'getTruckById',
            args: (originalResult) => ({ uuid: originalResult.uuid }),
          }
        }
      },
      {
        schema: fdpSchema,
        merge: {
          FBRTruck: {
            selectionSet: `{ uuid }`,
            resolve: (originalResult, context, info, schema, selectionSet) => {
              const results = delegateToSchema({
                schema,
                operation: 'query',
                fieldName: 'dataSources',
                returnType: new GraphQLList(fdpSchema.getType('FBRDataSource')),
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
              // The code below is a hack that reannotates the fbrTruck with the subschema metadata
              // Improperly, not preserving errors.
              // Helper functions could be created that do this properly.
              // Alternatively, schema transforms could be created that take care of this.
              // schema transforms operate on the original result prior to annotation of data with errors
              // and would not require special helper functions.
              // The HoistField transform is an attempt along this line with object fields only.
              //
              // Note that the array check itself is valid, for if no data was returned,
              // the returnes results will contain an error that can be passed through.
              // It is the object spread that is invalid, as it simply hoists the nested data
              // into the result containing appropriate subschema metadata, but does not adjust
              // any error annotations, which is unfortunately required. 
              return Array.isArray(results) ? {
                ...results[0],
                ...results[0].fbrTruck[0]
              } : result; 
            },
          },
        },
      },
    ],
  })
}

module.exports = { getSchema }
