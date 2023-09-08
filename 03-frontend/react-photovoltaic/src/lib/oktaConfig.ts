export const oktaConfig = {
    clientId: '0oaa2yhf4e9EsJ5C35d7',
    issuer:  'https://dev-20498019.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}