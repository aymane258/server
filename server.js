const express = require("express");
const jwt = require("express-jwt");
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require("jwks-rsa");
const port = 5000;

// Create a new Express app
const app = express();

// Set up Auth0 configuration
const authConfig = {
  domain: "apaaza.eu.auth0.com",
  audience: "SecureLogin.api.dev"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from apaaza.eu.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true, 
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt,jwtAuthz(['read:school']), (req, res) => {
  const school = [
    {id: 1, Naam: 'Artesis Plantijn'}
]
res.json(school);
});

//Test endpoint
app.get('/', (req,res) => {
  res.send('Hello there!');
});


app.listen(port, () => console.log('Server started on port ' + port));
