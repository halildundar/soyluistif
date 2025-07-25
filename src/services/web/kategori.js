import {
  getUrunlerIncludeKategori,
  getUrunlerIncludeKategori1,
} from "./dbdata.js";
import { getMainMenu, GetEticLogos } from "./dbdata.js";
const makeUrunler = async () => {
  const mainMenus = await getMainMenu();

  return mainMenus;
};
export const KategoriPageRenderAll = async (req, res) => {
  const mainMenus = await makeUrunler();
    const eticSiteler = await GetEticLogos();
  const { search } = req.query;
  let { urunler, altKategoriler, breadcrumbs } =
    await getUrunlerIncludeKategori1(search);
  urunler = urunler.map((item) => {
    item.resimler = JSON.parse(item.resimler);
    let newItem = {
      ...item,
      resim_on:
        !!item.resimler && item.resimler.length > 0
          ? "/uploads" + item.resimler[0]
          : "/assets/urun/resim_yok.webp",
      resim_arka:
        !!item.resimler && item.resimler.length > 1
          ? "/uploads" + item.resimler[1]
          : "/assets/urun/resim_yok.webp",
    };
    return newItem;
  });
  res.render("pages/website/kategori.hbs", {
    title: "Kategori",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urunler: !!urunler ? urunler : [],
    altKategoriler: mainMenus,
    menus: [...mainMenus],
    breadcrumbs: breadcrumbs,
    dizi1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    eticSiteler: eticSiteler,
  });
};
export const KategoriPageRender = async (req, res) => {
  const mainMenus = await makeUrunler();
     const eticSiteler = await GetEticLogos();
  if (req.path == "/kategori/") {
    return res.redirect("/kategori/all");
  }
  const { search } = req.query;
  let { urunler, altKategoriler, breadcrumbs } =
    await getUrunlerIncludeKategori(req.path, search);
  urunler = urunler.map((item) => {
    item.resimler = JSON.parse(item.resimler);
    let newItem = {
      ...item,
      resim_on:
        !!item.resimler && item.resimler.length > 0
          ? "/uploads" + item.resimler[0]
          : "/assets/urun/resim_yok.webp",
      resim_arka:
        !!item.resimler && item.resimler.length > 1
          ? "/uploads" + item.resimler[1]
          : "/assets/urun/resim_yok.webp",
    };
    return newItem;
  });
  res.render("pages/website/kategori.hbs", {
    title: "Kategori",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urunler: !!urunler ? urunler : [],
    altKategoriler: !!altKategoriler ? altKategoriler : [],
    menus: [...mainMenus],
    breadcrumbs: breadcrumbs,
    dizi1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    eticSiteler: eticSiteler,
  });
};
