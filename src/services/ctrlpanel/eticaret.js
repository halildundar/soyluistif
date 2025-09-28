import express from "express";
import { DB } from "../mysql.js";
let router = express.Router({ mergeParams: true });
import {checkLoggedIn} from '../auth/auth.js';
export const EticaretApi = (app) => {
  router.get("/ctrlpanel/etic-siteler",checkLoggedIn,  (req, res) => {
    return res.render("pages/ctrlpanel/eticaret.hbs", {
      title: "Eticaret Siteler",
      scriptname: process.env.CTRLPANELSCRIPTNAME,
      styles: ``,
      scripts: `  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      user:req.user
    });
  });
  router.post("/get-esites",  async (req, res) => {
    if (!req.body) {
      return res.send("Hata!!");
    }
    const resp = await DB.Query("SELECT * FROM `eticsites`");
    return res.json(resp);
  });
  router.post("/ctrlpanel/add-esite",checkLoggedIn,  async (req, res) => {
    if (!req.body) {
      return res.send("Hata!!");
    }
    await DB.Query("INSERT INTO `eticsites` SET ?", [req.body]);
    return res.json({
      msg: "OK!",
    });
  });
  router.post("/ctrlpanel/update-esite",checkLoggedIn,  async (req, res) => {
    if (!req.body) {
      return res.send("Hata!!");
    }
    const {id,...others} = req.body;
    await DB.Query("UPDATE `eticsites` SET ? WHERE id = " + id, [others]);
    return res.json({
      msg: "OK!",
    });
  });
  router.post("/ctrlpanel/delete-esite",checkLoggedIn,  async (req, res) => {
    if (!req.body) {
      return res.send("Hata!!");
    }
    const{id} = req.body;
    await DB.Query("DELETE FROM `eticsites` WHERE id = " + id);
    return res.json({
      msg: "OK!",
    });
  });

  return app.use("/", router);
};
