import express from "express";
let router = express.Router({ mergeParams: true });
import { DB } from "./mysql.js";
import { HomePageRender } from "./web/home.js";
import { KurumsalRender } from "./web/kurumsal.js";
import { UrunPageRender } from "./web/urun.js";
import { KategoriPageRender } from "./web/kategori.js";
import { SepetPageRender } from "./web/sepet.js";
import { UrunApi } from "./ctrlpanel/urun.js";
import { SlaytApi } from "./ctrlpanel/slaytlar.js";
import {
  CtrlPanelDashboardRender,
  CtrlPanelUrunRender,
  CtrlPanelSlaytRender,
} from "./ctrlpanel/main.js";
export const HomePageApi = (app) => {
  router.get("/", HomePageRender);
  return app.use("/", router);
};
export const KurumsalPageApi = (app) => {
  router.get("/hakkimizda", KurumsalRender);
  router.get("/iletisim", KurumsalRender);
  router.get("/kullanici-sozlesmesi", KurumsalRender);
  router.get("/mesafeli-satis-sozlesmesi", KurumsalRender);
  router.get("/siparis-takip", KurumsalRender);
  router.get("/havale-bildirimleri", KurumsalRender);
  return app.use("/", router);
};

export const UrunPageApi = (app) => {
  router.get("/urun/:urunurl", UrunPageRender);
  router.get("/urun", (req, res) => res.redirect("/urun/"));
  return app.use("/", router);
};
export const KategoriPageApi = (app) => {
  router.get("/kategori/*", KategoriPageRender);
  router.get("/kategori", (req, res) => res.redirect("/kategori/"));
  return app.use("/", router);
};

export const MenuApi = (app) => {
  router.post("/get-menu", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id, parent_length } = data;
    // const resp = await DB.Query("SELECT * FROM `kategori` WHERE JSON_CONTAINS(parents,?,'$')", [id]);
    let index = parent_length - 1;
    const resp = await DB.Query(
      "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
      [index, id, parent_length]
    );
    return res.json(resp);
  });
  return app.use("/", router);
};
export const SepetPageApi = (app) => {
  router.get("/sepet*", SepetPageRender);
  router.post("/sepet/get-urunler", async (req, res) => {
    const data = req.body;
    if(!data){
      return
    }
    const {ids} = data;
    const items = await DB.Query("SELECT * FROM `urun`  WHERE id IN ?", [[ids]]);
    return res.json(items);
  });
  router.get("/sepet", (req, res) => res.redirect("/sepet/"));
  return app.use("/", router);
};
//Kontrol Panel Router
export const CtrlPanelPageApi = (app) => {
  router.get("/ctrlpanel/", CtrlPanelDashboardRender);
  router.get("/ctrlpanel/urunler", CtrlPanelUrunRender);
  router.get("/ctrlpanel/slaytlar", CtrlPanelSlaytRender);
  router.get("/ctrlpanel*", (req, res) => res.redirect("/ctrlpanel/"));
  UrunApi(app);
  SlaytApi(app);
  return app.use("/", router);
};
