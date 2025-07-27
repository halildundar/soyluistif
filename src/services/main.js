import express from "express";
let router = express.Router({ mergeParams: true });
import { readFileSync } from "node:fs";
import { UplaodFileApi } from "./upload-service.js";
import {
  HomePageApi,
  KurumsalPageApi,
  UrunPageApi,
  KategoriPageApi,
  CtrlPanelPageApi,
  MenuApi,
  SepetPageApi,
  SiparisPageApi,
  FavoriPageApi
} from "./router.js";
import {IyzicoApi} from './iyzipay.js';
import {AdresApi} from './adres.js';
import { getMainMenu } from "./web/dbdata.js";
// initPassportLocal();
export const HOST_NAME = "https://crazy-noyce.89-250-72-218.plesk.page" //"http://localhost:3000";

// export const HOST_NAME = "http://localhost:3000" //"https://crazy-noyce.89-250-72-218.plesk.page";
export let appRoutes = (app) => {
  IyzicoApi(app);
  AdresApi(app);
  UplaodFileApi(app);
  HomePageApi(app);
  KurumsalPageApi(app);
  UrunPageApi(app);
  KategoriPageApi(app);
  CtrlPanelPageApi(app);
  MenuApi(app);
  SepetPageApi(app);
  SiparisPageApi(app);
  FavoriPageApi(app);
  router.post("/templates/get-temp", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { folderpath } = data;
    const tempUrl = process.cwd() + "/public/templates/" + folderpath;
    const strText = readFileSync(tempUrl, "utf-8");
    res.set("Content-Type", "text/plain");
    return res.send(strText);
  });
  router.get("/ctrlpanel", async (req, res) => {
    return res.render("pages/ctrlpanel/dashboard.hbs", {
      title: "Anasayfa",
      scriptname: `ctrlpanel-main`,
      scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    });
  });
  router.get("/ctrlpanel**", (req, res) => res.redirect("/ctrlpanel/"));
  router.get("**", async (req, res) => {
    const mainMenus = await getMainMenu();
    res.status(404).render("pages/404.hbs", {
      title: "404 Not Found",
      scriptname: `main`,
      scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      menus: mainMenus,
    });
  });
  return app.use("/", router);
};
