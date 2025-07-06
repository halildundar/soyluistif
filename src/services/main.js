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
  SepetPageApi
} from "./router.js";
// initPassportLocal();
export let appRoutes = (app) => {
  UplaodFileApi(app);
  HomePageApi(app);
  KurumsalPageApi(app);
  UrunPageApi(app);
  KategoriPageApi(app);
  CtrlPanelPageApi(app);
  MenuApi(app);
  SepetPageApi(app);
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
  router.get("/*", (req, res) => {
    res.render("pages/404.hbs", {
      title: "Kontrol Panel",
      scriptname: `main`,
    });
  });
  return app.use("/", router);
};
