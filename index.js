//Special Thanks to 
//https://auth0.com/docs/quickstart/webapp/express
//https://www.youtube.com/watch?v=QQwo4E_B0y8

const express = require('express');
const { auth,requiresAuth } = require('express-openid-connect');
require('dotenv').config();
const app = express();
const port= process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET
};

// auth router attach with /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req,res)=>{
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
})

// requiresAuth checks authentication.
app.get('/admin', requiresAuth(), (req, res) =>
  res.send(`Hello ${req.oidc.user.nickname}, this is the admin section.`)
);

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('*', (req,res)=>{
    res.send("Page Not Found.")
})

app.listen(port, ()=>{
    console.log(`Application is running on port ${port}`);
})
