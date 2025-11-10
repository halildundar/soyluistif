import express from "express";
import { DB } from "../mysql.js";
let router = express.Router({ mergeParams: true });
import { checkLoggedIn } from "../auth/auth.js";
export const CtrlPanelYorumRender = async (req, res) => {
  console.log("Yorum area");
  res.render("pages/ctrlpanel/yorum.hbs", {
    title: "Ürün Yorumları",
    scriptname: process.env.CTRLPANELSCRIPTNAME,
    styles: `<link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css"> <link
  href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.bubble.css"
  rel="stylesheet"
/>`,
    scripts: `  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js"></script>`,
    user: req.user,
  });
};
export const YorumApi = async (app) => {
  router.post("/ctrlpanel/yorumlar", checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const items = await DB.Query(
      "SELECT id,name,kod,yorumlar FROM `urun` WHERE yorumlar IS NOT NULL"
    );
    return res.json(items);
  });
  router.post("/ctrlpanel/yorumlar/update", checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let {id,yorumlar} = data;
    yorumlar = !!yorumlar ? yorumlar : null;
    const items = await DB.Query(
      "UPDATE `urun` SET ? WHERE `id` = ?",[{yorumlar:yorumlar},id]
    );
    return res.json(items);
  });
  router.get("/ctrlpanel/yorumlar", checkLoggedIn, CtrlPanelYorumRender);
  return app.use("/", router);
};
