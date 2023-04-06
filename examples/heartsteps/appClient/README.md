# heartsteps-appClient

## Local Authentication Procedure

1. In a new terminal, spin up a localtunnel instance using `lt --port 3500`
2. In a new terminal, navigate to `examples/heartsteps/appServer/` and run `npm start`
3. Inside `examples/heartsteps/appClient/src/api/axios.tsx` change `TUNNELED_LOCAL_URL` to the URL provided from localtunnel
4. In a new terminal, navigate to `examples/heartsteps/appClient/` and run `yarn start`

### Local Authentication Explained

#### Backend

All routes underneath the line `app.use(verifyJWT);` in `server.js` undergo the verifyJWT middleware found in `verifyJWT.middleware.js` and require a valid access token to utilize. The access token is sent via the Authorization header. If no access token or an invalid token is provided the server returns 403 status.

#### useAxiosPrivate

`useAxiosPrivate.js` is a hook that routes all axios requests and responses through the logic in the hook's definition. We check to make sure all requests are sent with an Authorization header containing an access token. In particular the response interceptor is used to refresh the access token when it expires. Refreshing the access token essentially uses the refresh token to call the `/refresh` endpoint on the backend to obtain a fresh access token. We allow the user to refresh the access token only once. After they have already used their refresh token to obtain a new access token, once that new access token expires, we log the user out and redirect them to the login screen. After they login again, they will be provided with a new access token and a new refresh token.

#### useRefreshToken

`useRefreshToken.js` is a hook that provides us with a new access token using the user's refresh token. We also decode the user's roles (their permissions) and include that in the AuthContext.

#### Roles

Role checking is done via middleware by providing a list of roles to `verifyRoles(ALLOWED_ROLES)` on any API route **THAT COMES AFTER THE VERIFYJWT** middleware on the backend. Take this for example:

```
router
  .route('/:id')
  .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Staff), usersController.getUser);
```

In this case only admin and staff are allowed to access this endpoint and retrieve a user's information. The `verifyJWT` middlware decodes the roles from the JWT token and passes it along as a request parameter. These roles are then verified to match the correct corresponding role in `verifyRoles`.

### Logout

Logging out of the website dashboard (admin dashboard) erases the JWT access token from it's stored location in cookies. It also erases the refresh token from the user's database object where it is stored (changes the refresh token field to any empty string).
