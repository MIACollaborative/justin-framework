# heartsteps-appClient

## Local Authentication Procedure

1. In a new terminal, spin up a localtunnel instance using `lt --port 3500`
2. In a new terminal, navigate to `examples/heartsteps/appServer/` and run `npm start`
3. Inside `examples/heartsteps/appClient/src/api/axios.tsx` change `TUNNELED_LOCAL_URL` to the URL provided from localtunnel
4. In a new terminal, navigate to `examples/heartsteps/appClient/` and run `yarn start`

### Local Authentication Explained
