import express from "express";
let router = express.Router({ mergeParams: true });
import { DB } from "./mysql.js";
import { HomePageRender } from "./web/home.js";
import { KurumsalRender } from "./web/kurumsal.js";
import { UrunPageRender } from "./web/urun.js";
import {
  KategoriPageRender,
  KategoriPageRenderAll,
  GetSearchMenu,
} from "./web/kategori.js";
import {
  SepetPageRender,
  SiparişBilgiPageRender,
  OdemePageRender,
} from "./web/sepet.js";
import { UrunApi } from "./ctrlpanel/urun.js";
import { SlaytApi } from "./ctrlpanel/slaytlar.js";
import { SiparisApi } from "./ctrlpanel/siparis.js";
import { EticaretApi } from "./ctrlpanel/eticaret.js";
import { SiparişlerPageRender } from "./web/siparis.js";
import {
  SiparisAdd,
  SiparisDelete,
  SiparisUpdate,
  SiparisByiIyzIDGet,
  SiparisGetBYID,
} from "./web/dbdata.js";
import { FavorilerPageRender } from "./web/favoriler.js";
import { RaporUrunApi } from "./ctrlpanel/rapor-urunler.js";
import { checkMusteriLoggedIn, checkMusteriLoggedOut } from "./auth/auth.js";
import { Uyeol, UyeOlPageRender } from "./web/musteri/uye-ol.js";
import {
  MusteriActivation,
  SendActvCode,
  SendActvCodeRender,
  SendChangePasswRender,
  SendChangePassw,
  SendPassChangeActvCode,
} from "./web/musteri/onay-kod.js";
import {
  UserBilgiPageRender,
  UserAdresBilgiPageRender,
  UserSiparisPageRender,
  UserDataUpdate,
  UserDataUpdatAdres,
} from "./web/musteri/user-bilgi.js";
import { YorumApi } from "./ctrlpanel/yorumlar.js";
export const HomePageApi = (app) => {
  router.get("/", HomePageRender);
  return app.use("/", router);
};
export const KurumsalPageApi = (app) => {
  router.get("/hakkimizda", KurumsalRender);
  router.get("/iletisim", KurumsalRender);
  router.get("/kullanici-sozlesmesi", KurumsalRender);
  router.get("/mesafeli-satis-sozlesmesi", KurumsalRender);
  router.get("/teslimat-iade-sartlar", KurumsalRender);
  router.get("/siparis-takip", KurumsalRender);
  router.get("/havale-bildirimleri", KurumsalRender);
  return app.use("/", router);
};
export const UrunPageApi = (app) => {
  router.post("/urun/get-urunlerforgorlen", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { ids } = data;
    const result = await DB.Query("SELECT * FROM `urun` WHERE id IN  ?", [
      [ids],
    ]);
    return res.json(result);
  });
  router.post("/urun/update-urun", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id, ...others } = data;
    await DB.Query("UPDATE `urun` SET ? WHERE id =" + id, [others]);
    return res.json({ msg: "OK!" });
  });
  router.post("/urun/get-yorumlar", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id } = data;
    const dataYorum = await DB.Query(
      "SELECT yorumlar FROM `urun` WHERE id =" + id
    );
    return res.json(
      !!dataYorum[0].yorumlar ? dataYorum[0].yorumlar : JSON.stringify([])
    );
  });
  router.get("/urun/:urunurl", UrunPageRender);
  router.get("/urun", (req, res) => res.redirect("/urun/"));
  return app.use("/", router);
};
export const KategoriPageApi = (app) => {
  router.post("/kategori/search", GetSearchMenu);
  router.get("/kategori/:kategori", KategoriPageRender);
  // router.get("/kategori*", KategoriPageRender);

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
export const SiparisPageApi = (app) => {
  router.post("/siparis/add", async (req, res) => {
    if (!req.body) {
      return;
    }
    await SiparisAdd(req.body);
    return res.json({ msg: "OK!" });
  });
  router.post("/siparis/delete", async (req, res) => {
    if (!req.body) {
      return;
    }
    const { id } = req.body;
    await SiparisDelete(id);
    return res.json({ msg: "OK!" });
  });
  router.post("/siparis/update", async (req, res) => {
    if (!req.body) {
      return;
    }
    await SiparisUpdate(req.body);
    return res.json({ msg: "OK!" });
  });
  router.post("/siparis/get", async (req, res) => {
    if (!req.body) {
      return;
    }
    const result = await SiparisGetBYID(req.body);
    return res.json(result);
  });
  router.post("/siparis/getbysipid", async (req, res) => {
    if (!req.body) {
      return;
    }
    const { ids } = req.body;
    const result = await SiparisByiIyzIDGet(ids);
    return res.json(result);
  });
  router.get("/siparis*", checkMusteriLoggedIn, SiparişlerPageRender);
  router.get("/siparis", (req, res) => res.redirect("/siparis/"));
  return app.use("/", router);
};
export const SepetPageApi = (app) => {
  router.get("/sepet*", SepetPageRender);
  router.get("/siparis-bilgi*", checkMusteriLoggedIn, SiparişBilgiPageRender);
  router.get("/odeme*", checkMusteriLoggedIn, OdemePageRender);
  router.post("/sepet/get-urunler", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { ids } = data;
    const items = await DB.Query("SELECT * FROM `urun`  WHERE id IN ?", [
      [ids],
    ]);
    return res.json(items);
  });
  router.get("/sepet", (req, res) => res.redirect("/sepet/"));
  return app.use("/", router);
};
export const FavoriPageApi = (app) => {
  router.get("/favori*", FavorilerPageRender);
  router.post("/favori/get-urunler", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { ids } = data;
    const items = await DB.Query("SELECT * FROM `urun`  WHERE id IN ?", [
      [ids],
    ]);
    return res.json(items);
  });
  router.get("/sepet", (req, res) => res.redirect("/sepet/"));
  return app.use("/", router);
};
export const MusteriApi = (app) => {
  router.get("/cust/chngepassw", SendChangePasswRender);
  router.post("/cust/chngepasswactiv", SendPassChangeActvCode);
  router.post("/cust/chngepassw", SendChangePassw);
  router.get("/cust/sendactivation", SendActvCodeRender);
  router.post("/cust/sendactivation", SendActvCode);
  router.get("/cust/activation", MusteriActivation);
  router.get("/uye-ol", UyeOlPageRender);
  router.post("/uye-ol", Uyeol);
  router.get("/cust/info", checkMusteriLoggedIn, UserBilgiPageRender);
  router.get("/cust/adress", checkMusteriLoggedIn, UserAdresBilgiPageRender);
  router.get("/cust/order", checkMusteriLoggedIn, UserSiparisPageRender);
  router.post("/cust/update-info", UserDataUpdate);
  router.post("/cust/update-useradres", UserDataUpdatAdres);
  router.get("/cust*", (req, res) => res.redirect("/cust/info"));
  return app.use("/", router);
};

//Kontrol Panel Router
export const CtrlPanelPageApi = (app) => {
  UrunApi(app);
  SlaytApi(app);
  SiparisApi(app);
  EticaretApi(app);
  RaporUrunApi(app);
  YorumApi(app);
  return app.use("/", router);
};
