# Stiching API Gateway

A Node JS application that combines two remote GraphQL APIs, one responsible for storing truck data and another for storing planning data.

The FDP data source is a definative list of trucks and includes their name and an indication of fuel burned at different speeds.

The PLAN data source stores data related to project plans that includes a plan name and trucks involved, along with the dates they join and leave a plan (this can happen more than once)

The aim is for the API gateway to provide a single endpoint to these two remote API's and also allow the data to be joined. In the list of trucks participating in a plan the plan stores the truck id. The stiching server needs to use that to fetch the truck name and fuel data.

The two API's are maintained by remote teams and their API's cannot be changed

The FDP API contains data different collections of information related to trucks and uses a structure that is based on a common data type that is extended to expose the type of data required. To get a truck and its fuel data:

```
query TruckBurnRates {
  dataSources(dataType: Fbr) {
    ... on FBRDataSource {
      fbrTruck(truckId: "a6276400-9e2b-48c7-af57-7b799e83b4c1") {
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
```

To get information about a plan you would use:

```
{
  getPlanById(id: "b6276400-9e2b-48c7-af57-7b799e83b4c1") {
    id
    name
    trucks {
      id
      truckParticipations {
        joinDate
        leaveDate
      }
    }
  }
}
```

So one proposed way to get all the data back in a singe query would be to use either:

```
{
  getPlanById(id: "b6276400-9e2b-48c7-af57-7b799e83b4c1") {
    id
    name
    trucks {
      fbrTruck {
        truckName
        burnRates {
          speed
          mpg
        }
      }
      truckParticipations {
        joinDate
        leaveDate
      }
    }
  }
}
```

Or, though may cause issues as schemas grows

```
{
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
```

## Installation

- Download the code
- Run npm install
- run `npm start`
- Goto http://localhost:6107/graphql

## Tests

There is a small number of tests that can be executed with `npm test`. These tests demonstrate queries that prove the 2 backend api's and test the required combined query

How do you do it? All the docs on `delegateToSchema` assume you use a top legel query property and the field to use is at the top level too. How do you work with the need for more complex queries, nested parameters and nested field?
