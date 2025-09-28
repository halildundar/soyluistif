import passportLocal from "passport-local";
import passport from "passport";
import {
  findUserById,
  findUserByEmail,
  findMusteriById,
  findMusteriByEmail,
  comparePassword,
} from "./user_db.js";

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
        console.log(user,info);
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
  passport.authenticate("musteri", function (err, user, info) {
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
        const {status,msg} = info;
        if(!status){
           return res
            .status(401)
            .json({ ok: false, msg:msg });
        }
        if (!user) {
          console.log("Kullunıcı bulunamadı11");
          return res
            .status(401)
            .json({ ok: false, msg: "Kullunıcı bulunamadı" });
        }
        if (!info || !info.status) {
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
            return done(null, false, match);
          } else {
            return done(null, false, null);
          }
        }
      } catch (err) {
        return done(null, false, { message: err });
      }
    }
  );
  let localMusteriOptions = {
    usernameField: "email",
    passwordField: "passw",
    passReqToCallback: true,
  };

  const localStrtegyMusteri = new LocalStrategy(
    localMusteriOptions,
    async (req, email, sifre, done) => {
      try {
        const user = await findMusteriByEmail(email);
        if (!user) {
          return done(
            null,
            false,
            {status:false,msg:"Email adresi veya Şifre Yanlış"}
          );
        } else {
          let match = await comparePassword(sifre, user);
          const {role,onay_kod} = user;
          if (match === false) {
            return done(null, user, {status:false,msg:"Email adresi veya Şifre Yanlış"});
          } else if (match === "The password that you've entered is incorrect") {
            return done(null, false, {status:false,msg:"Email adresi veya Şifre Yanlış"});
          } else if (onay_kod !== "-") {
            return done(null, false, {status:false,msg:"Email Adresinize gönderilen aktiviasyon mailinizi aktifleştirin"});
          }else if (role !== "musteri") {
            return done(null, false, {status:false,msg:"Email adresi veya Şifre Yanlış"});
          } else{
              return done(null, user, {status:true,msg:"OK!"});
          }
        }
      } catch (err) {
        return done(null, false, { message: err });
      }
    }
  );
  passport.use("musteri", localStrtegyMusteri);
  passport.use("local", localStrtegy);
};

passport.serializeUser(function (userObject, done) {
  done(null, userObject);
});

passport.deserializeUser(function (userObject, done) {
  if (userObject.role == "local") {
    findUserById(userObject.id)
      .then((usr) => {
        return done(null, usr);
      })
      .catch((error) => {
        return done(error, null);
      });
  } else if (userObject.role == "musteri") {
    findMusteriById(userObject.id)
      .then((usr) => {
        return done(null,usr);
      })
      .catch((error) => {
        return done(error, null);
      });
  }
});
