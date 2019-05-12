# Apollo Auth0

[![Greenkeeper badge](https://badges.greenkeeper.io/Lepozepo/apollo-auth0.svg)](https://greenkeeper.io/)

## How to use

This package is specifically meant to be used with apollo to take advantage of apollo's caching engine.

```
import { ServerClient } from 'apollo-auth0';

export const auth = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
});

export const apolloServer = new ApolloServer({
  ...otherApolloConfigs,
  dataSource: () => ({
    auth,
  }),
})
```

## What's included?
### ServerClient
A class that holds your client configuration.

#### Provided Functions
**getUsers(params)**: Queries for users, uses `search_engine.v3`, [params](https://auth0.com/docs/api/management/v2#!/Users/get_users)
**getUser(id, params)**: Queries for a single user, [params](https://auth0.com/docs/api/management/v2#!/Users/get_users_by_id)
**getUsersByEmail(params)**: Queries for users by email, uses `search_engine.v3`, [params](https://auth0.com/docs/api/management/v2#!/Users_By_Email/get_users_by_email)
**createUser(params)**: Mutates auth0 Username-Password-Authentication to create a new user with a randomly generated password, [params](https://auth0.com/docs/api/management/v2#!/Users/post_users)
**resetPassword(id, params)**: Mutates auth0 Username-Password-Authentication by user ID to reset a users password. Params:
  - newPassword: A new user password
**sendChangePasswordEmail(email)**: Send an email to the user to request a password change

