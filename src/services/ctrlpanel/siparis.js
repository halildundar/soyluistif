import express from "express";
import { DB } from "../mysql.js";
let router = express.Router({ mergeParams: true });
export const CtrlPanelSiparisRender = async (req, res) => {
  res.render("pages/ctrlpanel/siparisler.hbs", {
    title: "Siparişler",
    scriptname: `ctrlpanel-main`,
    styles: ``,
    scripts: `  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
  });
};

export const SiparisApi = (app) => {
  router.get("/ctrlpanel/siparisler", CtrlPanelSiparisRender);
  router.post("/ctrlpanel/siparisler/get-all", async (req, res) => {
     const resp = await DB.Query(
      "SELECT * FROM `siparis`"
    );
    return res.json(resp);
  });
   router.post("/ctrlpanel/siparisler/update", async (req, res) => {
    if(!req.body){
      return;
    }
    const  {siparis_id,...others} = req.body;
     const resp = await DB.Query("UPDATE `siparis` SET ? WHERE id = " + siparis_id,[others]);
    return res.json({
      msg:'OK!'
    });
  });
  return app.use("/", router);
};
