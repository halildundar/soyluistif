import express from "express";
import { DB } from "../mysql.js";
let router = express.Router({ mergeParams: true });
import {checkLoggedIn} from '../auth/auth.js';
export const CtrlPanelSlaytRender = async (req, res) => {
  res.render("pages/ctrlpanel/slaytlar.hbs", {
    title: "Slaytlar",
    scriptname:process.env.CTRLPANELSCRIPTNAME,
    styles:`<link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">`,
    scripts:`  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      user:req.user
  });
};

export const SlaytApi = (app) => {
  
  router.post("/ctrlpanel/slaytlar/add-item",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const items = await DB.Query("INSERT INTO `slayt` SET ?", [data]);
    return res.json({
      msg: "Ok!",
    });
  });
  router.post("/ctrlpanel/slaytlar/delete-item",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id } = data;
    await DB.Query("DELETE FROM `slayt` WHERE id =" + id);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/slaytlar/get-items", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { tur } = data;
    const items = await DB.Query(
      "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC ",
      [tur]
    );
    return res.json(items);
  });
  router.post("/ctrlpanel/slaytlar/update-item",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id, ...others } = data;
    await DB.Query("UPDATE `slayt` SET ?  WHERE id = " + id, [others]);
    return res.json({
      msg: "Ok!",
    });
  });
  router.get("/ctrlpanel/slaytlar",checkLoggedIn, CtrlPanelSlaytRender);
  
  return app.use("/", router);
};
