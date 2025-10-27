import {
  GetCurrncySym,
  GetUrunlerForSearchArea,
  getUrunlerIncludeKategoriAll,
} from "./dbdata.js";
import { getMainMenu, GetEticLogos, GetSettings } from "./dbdata.js";

const makeUrunler = async () => {
  const mainMenus = await getMainMenu();

  return mainMenus;
};
export const GetSearchMenu = async (req, res) => {
  try {
    if (!req.body) {
      return res.json({ status: false, msg: "Hata!" });
    }
    const { search } = req.body;
    let { urunler } = await GetUrunlerForSearchArea(search);
    urunler = urunler.map((item) => {
      item.resimler = JSON.parse(item.resimler);
      let newItem = {
        ...item,
        currSymb: GetCurrncySym(item),
        resim_on:
          !!item.resimler && item.resimler.length > 0
            ? item.resimler[0]
            : "/assets/urun/resim_yok.webp",
        resim_arka:
          !!item.resimler && item.resimler.length > 1
            ? item.resimler[1]
            : "/assets/urun/resim_yok.webp",
      };
      return newItem;
    });
    res.json(urunler);
  } catch (error) {
    console.log(error);
  }
};

export const KategoriPageRender = async (req, res) => {
  const mainMenus = await makeUrunler();
  const eticSiteler = await GetEticLogos();
  let { search, minfiyat, maxfiyat, stok, birim, other } = req.query;
  let kategori = req.params.kategori;
  let param;
  if (kategori == "all") {
    param = kategori;
  } else if (!!kategori) {
    param = kategori;
  }
  let path = decodeURIComponent(decodeURIComponent(req.path));
  let { urunler, altKategoriler, breadcrumbs, filtreElemanlar } =
    await getUrunlerIncludeKategoriAll(
      param,
      search,
      minfiyat,
      maxfiyat,
      birim,
      stok,
      other
    );
  urunler = urunler.map((item) => {
    item.resimler = JSON.parse(item.resimler);
    let newItem = {
      ...item,
      currSymb: GetCurrncySym(item),
      resim_on:
        !!item.resimler && item.resimler.length > 0
          ? item.resimler[0]
          : "/assets/urun/resim_yok.webp",
      resim_arka:
        !!item.resimler && item.resimler.length > 1
          ?  item.resimler[1]
          : "/assets/urun/resim_yok.webp",
    };
    return newItem;
  });
  let sneddata = {
    title: !!breadcrumbs[breadcrumbs.length - 1] ? breadcrumbs[breadcrumbs.length - 1].name + " | Soylu İstif Makinaları" : "Soylu İstif Makinaları",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urunler: !!urunler ? urunler : [],
    altKategoriler: altKategoriler,
    menus: [...mainMenus],
    breadcrumbs: breadcrumbs,
    dizi1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    eticSiteler: eticSiteler,
    musteri: req.user,
    filtreElemanlar: filtreElemanlar,
    currSymb: birim == "TRY" ? "₺" : birim == "EUR" ? "€" : "$",
  }
  if(!!minfiyat && parseInt(minfiyat) !== 0){
    sneddata = {...sneddata,minfiyat:parseInt(minfiyat)}
  }
  if(!!minfiyat && parseInt(maxfiyat) !== 0){
    sneddata = {...sneddata,maxfiyat:parseInt(maxfiyat)}
  }
  res.render("pages/website/kategori.hbs", sneddata);
};
