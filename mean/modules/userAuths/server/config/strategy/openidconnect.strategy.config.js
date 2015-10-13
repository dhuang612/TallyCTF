'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  OpenIDConnect = require('passport-openidconnect').Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  console.log("RUNNING WITH: " + userAuth.provider);
  passport.use(new OpenIDConnect({
      authorizationURL: userAuth.authURL || 'test',
      tokenURL: userAuth.tokenURL || 'test',
      userInfoURL: userAuth.userInfoURL || 'test',
      clientID: userAuth.clientId || 'test',
      clientSecret: userAuth.clientSecret || 'test',
      callbackURL: userAuth.callbackURL || 'test',
      scope: 'openid profile email',
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        provider: userAuth.provider,
        providerIdentifierField: 'user_id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};
