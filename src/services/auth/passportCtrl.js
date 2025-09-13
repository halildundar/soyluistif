import passportLocal from "passport-local";
import passport from "passport";
import { findUserById, findUserByEmail,findMusteriById,findMusteriByEmail, comparePassword } from "./user_db.js";

let LocalStrategy = passportLocal.Strategy;
export let Authenticate = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    switch (req.accepts("html", "json")) {
      case "html":
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/signin");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/ctrlpanel");
        });
        break;
      case "json":
        if (err) {
          return next(err);
        }
        if (!user) {
          console.log("Kullunıcı bulunamadı");
          return res
            .status(401)
            .json({ ok: false, msg: "Kullunıcı bulunamadı" });
        }
        if (!!info) {
          console.log(info, user);
          return res
            .status(401)
            .json({ ok: false, msg: "Email veya şifre hatalı" });
        }
        req.logIn(user, function (err) {
          if (err) {
            console.log(user, "Hatalı bir durum var");
            return res
              .status(401)
              .json({ ok: false, msg: "Hatalı bir durum var" });
          }
          return res.json({ ok: true });
        });
        break;
      default:
        res.status(406).json();
    }
  })(req, res, next);
};
export let Authenticate1 = (req, res, next) => {
  return passport.authenticate("musteri", function (err, user, info) {
    switch (req.accepts("html", "json")) {
      case "html":
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
        break;
      case "json":
        if (err) {
          return next(err);
        }
        if (!user) {
          console.log("Kullunıcı bulunamadı11");
          return res.status(401).json({ ok: false, msg: "Kullunıcı bulunamadı" });
        }
        if (!!info) {
          console.log(info, user);
          return res
            .status(401)
            .json({ ok: false, msg: "Email veya şifre hatalı" });
        }
        req.logIn(user, function (err) {
          if (err) {
            console.log(user, "Hatalı bir durum var");
            return res
              .status(401)
              .json({ ok: false, msg: "Hatalı bir durum var" });
          }
          return res.json({ ok: true });
        });
        break;
      default:
        res.status(406).json();
    }
  })(req, res, next);
};
export let initPassportLocal = () => {
  let localOptions = {
    usernameField: "email",
    passwordField: "sifre",
    passReqToCallback: true,
  };
  const localStrtegy = new LocalStrategy(
    localOptions,
    async (req, email, sifre, done) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) {
          return done(
            null,
            false
            // req.flash("errors", `This user email "${email}" doesn't exist`)
          );
        } else {
          let match = await comparePassword(sifre, user);
          if (match === true) {
            return done(null, user, null);
          } else if (
            match === "The password that you've entered is incorrect"
          ) {
            return done(null, user, match);
          } else {
            return done(null, false, null);
          }
        }
      } catch (err) {
        return done(null, false, { message: err });
      }
    }
  );
  localOptions = {
    usernameField: "email",
    passwordField: "passw",
    passReqToCallback: true,
  };
  const localStrtegyMusteri = new LocalStrategy(
    localOptions,
    async (req, email, sifre, done) => {
      try {
        const user = await findMusteriByEmail(email);
        if (!user) {
          return done(
            null,
            false
            // req.flash("errors", `This user email "${email}" doesn't exist`)
          );
        } else {
          let match = await comparePassword(sifre, user);
          if (match === true) {
            return done(null, user, null);
          } else if (
            match === "The password that you've entered is incorrect"
          ) {
            return done(null, user, match);
          } else {
            return done(null, false, null);
          }
        }
      } catch (err) {
        return done(null, false, { message: err });
      }
    }
  );
  passport.use("local", localStrtegy);
  passport.use("musteri", localStrtegyMusteri);
};

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   findUserById(id)
//     .then((user) => {
//       return done(null, user);
//     })
//     .catch((error) => {
//       return done(error, null);
//     });
// });
class SessionConstructor {
  constructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }
}
passport.serializeUser(function (userObject, done) {
  let userGroup = '';
  if ("sifre" in userObject) {
    userGroup = "local";
  } else if ("passw" in userObject) {
    userGroup = "musteri";
  }
  let sessionConstructor = new SessionConstructor(userObject.id, userGroup, "");
  done(null, sessionConstructor);
});

passport.deserializeUser(function (sessionConstructor, done) {
  if (sessionConstructor.userGroup == "local") {
    findUserById(sessionConstructor.userId)
      .then((usr) => {
        return done(null, usr);
      })
      .catch((error) => {
        return done(error, null);
      });
  } else if (sessionConstructor.userGroup == "musteri") {
   findMusteriById(sessionConstructor.userId)
      .then((usr) => {
        return done(null, usr);
      })
      .catch((error) => {
        return done(error, null);
      });
  }
});
