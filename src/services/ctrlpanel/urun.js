import express from "express";
import { DB } from "../mysql.js";
import { existsSync, rmdirSync } from "fs";
let router = express.Router({ mergeParams: true });
import {checkLoggedIn} from '../auth/auth.js';
export const CtrlPanelUrunRender = async (req, res) => {
  res.render("pages/ctrlpanel/urun.hbs", {
    title: "Ürünler",
    scriptname: `ctrlpanel-main`,
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
    user:req.user
  });
};
export const UrunApi = async (app) => {
  router.post("/ctrlpanel/kategori/add-item",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const items = await DB.Query("INSERT INTO `kategori` SET ?", [data]);
    return res.json({
      msg: "Ok!",
    });
  });
  router.post("/ctrlpanel/kategori/update-item",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id, ...others } = data;
    others.parents = !!others.parents ? JSON.stringify(others.parents) : null;
    const items = await DB.Query("UPDATE `kategori` SET ? where id = " + id, [
      others,
    ]);
    return res.json({
      msg: "Ok!",
    });
  });
  router.post("/ctrlpanel/kategori/get-all-items", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const items = await DB.Query("SELECT * FROM `kategori`");
    return res.json(items);
  });
  router.post("/ctrlpanel/kategori/delete-items",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { ids } = data;
    await DB.Query("START TRANSACTION");
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      await DB.Query("DELETE FROM `kategori` WHERE id = " + id);
    }
    await DB.Query("COMMIT");
    // return res.json(items);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/urun/add-urun",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    await DB.Query("INSERT INTO `urun` SET ?", [data]);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/urun/update-urun",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id, ...others } = data;
    await DB.Query("UPDATE `urun` SET ? WHERE id =" + id, [others]);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/urun/delete-urun-from-kategori",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { ids } = data;
    // ids = ids.replace(/[\[\]]/g,'');
    await DB.Query("START TRANSACTION");
    const deletedUrunler = await DB.Query(
      "SELECT id,resimler FROM `urun` WHERE JSON_CONTAINS(parents,?,'$')",
      [[ids]]
    );
    for (let i = 0; i < deletedUrunler.length; i++) {
      const id = deletedUrunler[i].id;
      let resimler = !!deletedUrunler[i].resimler
        ? JSON.parse(deletedUrunler[i].resimler)
        : [];
      for (let j = 0; j < resimler.length; j++) {
        let imgurl = "/uploads" + resimler[j];
        let filename = imgurl.split("/").pop();
        imgurl = imgurl.replace(filename, "");
        let new_path = process.cwd() + "/public" + imgurl;
        const isExist = existsSync(new_path);
        if (isExist) {
          rmdirSync(new_path, { recursive: true });
        }
      }
      await DB.Query("DELETE FROM `urun` WHERE id = " + id);
    }
    await DB.Query("COMMIT");
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/urun/delete-urun",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { id } = data;
    await DB.Query("DELETE FROM `urun` WHERE id =" + id);
    return res.json({ msg: "OK!" });
  });
  router.post("/ctrlpanel/urun/get-urunler", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { kategori_ids } = data; // kategori_ids is string and structure of this parameter is "14,35,22"
    // const ids = JSON.parse(kategori_ids);
    // kategori_ids = kategori_ids.replace(/[\[\]]/g, "");
    // if (ids.length == 1) {
    //   kategori_ids += ",";
    // }
    kategori_ids = kategori_ids.replace(/[\[\]]/g, "");
    const resp = await DB.Query(
      "SELECT * FROM `urun` WHERE `parents` LIKE  '%" + kategori_ids + "%'"
    );
    return res.json(resp);
  });
  router.post("/ctrlpanel/urun/get-urun-resimler", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id } = data;
    const resp = await DB.Query("SELECT resimler FROM `urun` WHERE id = ?", [
      id,
    ]);
    return res.json(resp[0].resimler);
  });
  router.post("/ctrlpanel/urun/get-urun", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id } = data;
    const resp = await DB.Query("SELECT * FROM `urun` WHERE id = ?", [id]);
    return res.json(resp[0]);
  });
  router.get("/ctrlpanel/urunler",checkLoggedIn, CtrlPanelUrunRender);
  router.post("/urun/update-urun-goruntu", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id, ...others } = data;
    await DB.Query("UPDATE `urun` SET ? WHERE id = " + id, [others]);
    return res.json({ msg: "Ok!" });
  });
  router.post("/urun/update-stok",checkLoggedIn, async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let { id, alinan } = data;
    const resp = await DB.Query("SELECT alinan,stok_dusme_durum FROM `urun` WHERE id = " + id);
    let stok_dusme_durum = 'düşürülmedi';
    if(resp[0].stok_dusme_durum == 'düşürülmedi'){
      alinan = parseInt(alinan) + resp[0].alinan;
      stok_dusme_durum = "düşürüldü";
        await DB.Query("UPDATE `urun` SET `alinan` = ?,`stok_dusme_durum` = ? WHERE id = " + id, [alinan,stok_dusme_durum]);
    }
  
    return res.json({ msg: "Ok!" });
  });
    router.post("/ctrlpanel/urun/insert-multiple-urun", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let {arrayData} = data;
    // let promises = [];
    const rs = await  DB.Query("START TRANSACTION");
    for (const element of arrayData) {
          await DB.Query("INSERT INTO `urun` set ?",[{...element}])
    }
    const re1 = await  DB.Query("COMMIT");
    return res.json({status:true,msg:'Ok!'});
  });
  return app.use("/", router);
};
