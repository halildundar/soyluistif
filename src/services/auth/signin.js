import express from "express";
let router = express.Router({ mergeParams: true });
import { checkLoggedOut,checkMusteriLoggedOut,postLogOut,postMusteriLogOut } from "./auth.js";
import {Authenticate,Authenticate1} from './passportCtrl.js';
import { getMainMenu, GetEticLogos, GetSettings } from "../web/dbdata.js";
export const AuthApi = (app) => {
  router.get("/signin", checkLoggedOut, (req, res) => {
    return res.render("pages/signin.hbs", {
      title: "Signin",
      scriptname:`signin`,
    });
  });
  router.post("/signin", (req, res,next) => {
    const data = req.body;
    if(!data){
      return res.send('User Not found');
    }
    next();
  },Authenticate);
  router.post("/signout", postLogOut);

  router.get("/login", checkMusteriLoggedOut, async (req, res) => {
      const mainMenus = await getMainMenu();
         const sett = await GetSettings();
    return res.render("pages/website/auth/login.hbs", {
      title: "Login",
      scriptname:process.env.WEBSCRIPTNAME,
        scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
           menus: [...mainMenus],
    wpno: sett.whatsappno,
    });
  });
  router.post("/login", (req, res,next) => {
    const data = req.body;
    if(!data){
      return res.send('User Not found');
    }
    next();
  },Authenticate1);
  router.post("/logout", postMusteriLogOut);
  return app.use("/", router);
  
};
