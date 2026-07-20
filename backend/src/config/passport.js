  const passport = require('passport');
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const GitHubStrategy = require('passport-github2').Strategy;
  const User = require('../models/User');

  /* ===========================
    GOOGLE OAUTH
  =========================== */

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(new Error('Google account has no email address'), null);
            }

            // Find user by Google ID
            let user = await User.findOne({ googleId: profile.id });

            // If not found, check by email
            if (!user) {
              user = await User.findOne({ email });

              if (user) {
                // Link existing local account with Google
                user.googleId = profile.id;
                user.authProvider = 'google';
                user.isVerified = true;

                await user.save();
              } else {
                // Create new Google user
                user = await User.create({
                  name: profile.displayName,
                  email,
                  googleId: profile.id,
                  authProvider: 'google',
                  isVerified: true,
                });
              }
            }

            return done(null, user);
          } catch (err) {
            console.error('Google OAuth Error:', err);
            return done(err, null);
          }
        }
      )
    );

    console.log('✅ Google OAuth configured');
  } else {
    console.log('⚠️ Google OAuth not configured');
  }

  /* ===========================
    GITHUB OAUTH
  =========================== */

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.[0]?.value ||
              `${profile.username}@github.local`;

            let user = await User.findOne({ githubId: profile.id });

            if (!user) {
              user = await User.findOne({ email });

              if (user) {
                user.githubId = profile.id;
                user.authProvider = 'github';
                user.isVerified = true;

                await user.save();
              } else {
                user = await User.create({
                  name: profile.displayName || profile.username,
                  email,
                  githubId: profile.id,
                  authProvider: 'github',
                  isVerified: true,
                });
              }
            }

            return done(null, user);
          } catch (err) {
            console.error('GitHub OAuth Error:', err);
            return done(err, null);
          }
        }
      )
    );

    console.log('✅ GitHub OAuth configured');
  } else {
    console.log('⚠️ GitHub OAuth not configured');
  }

  module.exports = passport;