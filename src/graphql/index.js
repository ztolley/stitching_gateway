const { stitchSchemas } = require('@graphql-tools/stitch')
const { delegateToSchema, handleResult } = require('@graphql-tools/delegate')
const { getErrors } = require('@graphql-tools/utils')
const { Kind, GraphQLList } = require('graphql')

const fdpSchema = require('./fdpSchema')
const planSchema = require('./planSchema')

function forwardToFbr(truckId, selectionSet) {
  return {
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
                    value: truckId,
                  },
                },
              ],
              selectionSet,
            },
          ],
        },
      },
    ],
  }
}
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
              const datasources = delegateToSchema({
                schema,
                operation: 'query',
                fieldName: 'dataSources',
                returnType: new GraphQLList(fdpSchema.getType('FBRDataSource')),
                args: { dataType: 'Fbr' },
                selectionSet: forwardToFbr(originalResult.uuid, selectionSet),
                context,
                info,
                skipTypeMerging: true,
              })
              
              if (!Array.isArray(datasources)) {
                return datasources
              }

              const datasource = datasources[0]
              const fbrTrucks = handleResult(
                datasource.fbrTruck,
                getErrors(datasource, 'fbrTruck'),
                schema,
                context,
                info,
                new GraphQLList(fdpSchema.getType('FBRTruck')),
                true,
              );

              if (!Array.isArray(fbrTrucks)) {
                return fbrTrucks
              }

              return fbrTrucks[0];
            },
          },
        },
      },
    ],
  })
}

module.exports = { getSchema }
