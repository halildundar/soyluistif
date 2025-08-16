import express from "express";
import { DB } from "../mysql.js";
import { existsSync, rmdirSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
let router = express.Router({ mergeParams: true });
import { checkLoggedIn} from '../auth/auth.js';
const RaporUrunRender = async (req, res) => {
  res.render("pages/ctrlpanel/rapor-urunler.hbs", {
    title: "Ürün Listesi",
    scriptname: `ctrlpanel-main`,
    styles: ``,
    scripts: `  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      user:req.user
  });
};

const RaporUrunler = async (req, res) => {
  if (!req.body) {
    return res.json([]);
  }
  let urunler = await getAllUrunler();
  return res.json(urunler);
};
const RaporExportCSV = async (req, res) => {
  if (!req.body) {
    return res.json([]);
  }
  let { urunler } = req.body;
  urunler = urunler.map((item) => {
    return {
      ...item,
      kategoristr: item.kategoristr.replaceAll("<br>", ","),
    };
  });

  let dest_folder = process.cwd() + "/public/uploads/raporlar/urun-raporlar/";
  if (!existsSync(dest_folder)) {
    mkdirSync(dest_folder, { recursive: true });
  }
  let allStr =
    "\uFEFFNo;ÜrünKodu;Ürün Adı;Kategorler;İndirim(%);Fiyat(₺);İndirimli Fiyat(₺);Kdv(%);Beğenilme;Görüntülenme;Stok;Kalan\n";
  for (let i = 0; i < urunler.length; i++) {
    const urun = urunler[i];
    let rowStr = `${i+1};${urun.kod};${urun.name};"${urun.kategoristr}";${urun.indirim};${urun.fiyat};${urun.indirimli_fiyat};${urun.kdv};${urun.begenilme};${urun.goruntulenme};${urun.stok};${urun.kalan}\n`;
    allStr += rowStr;
  }

  let filenamr = "rapor_" + new Date().getTime() + ".csv";
  writeFileSync(dest_folder + filenamr, allStr, { encoding: "utf-8" });
  return res.json({
    url: "/uploads/raporlar/urun-raporlar/" + filenamr,
    filename: filenamr,
  });
};
export const RaporUrunApi = async (app) => {
  router.get("/ctrlpanel/rapor-urunler",checkLoggedIn, RaporUrunRender);
  router.post("/ctrlpanel/rapor-urunler",checkLoggedIn, RaporUrunler);
  router.post("/ctrlpanel/rapor-exportcsv",checkLoggedIn, RaporExportCSV);
  router.post("/ctrlpanel/rapor-deletecsv",checkLoggedIn, (req, res) => {
    if (!req.body) {
      return res.json({ status: false, msg: "Failure" });
    }
    const {url} = req.body;
    unlinkSync(process.cwd() + '/public' +url);
    return res.json({ status: true, msg: "Ok!" });
  });
  return app.use("/", router);
};

const getAllUrunler = async () => {
  let rows = await DB.Query("SELECT * from `urun`");
  rows = rows.sort((a, b) => (a.name < b.name ? -1 : 1));
  rows = rows.map((item) => {
    return {
      ...item,
      kalan: item.stok - item.alinan,
      resimler: JSON.parse(item.resimler),
      parents: JSON.parse(item.parents),
    };
  });
  let promises = [];
  for (let i = 0; i < rows.length; i++) {
    const urun = rows[i];
    promises.push(makeParents(urun));
  }

  return Promise.all(promises);
};
const makeParents = async (urun) => {
  let promises = [];
  let strKategori = ``;
  for (let ic = 0; ic < urun.parents.length; ic++) {
    const parentId = urun.parents[ic];
    promises.push(getKategoriName(parentId));
  }
  let names = await Promise.all(promises);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    strKategori += name + "<br>";
  }
  return { ...urun, kategoristr: strKategori };
};
const getKategoriName = async (id) => {
  let kategori = await DB.Query("SELECT * from `kategori` WHERE id = ?", [id]);
  return kategori[0].name;
};
