import { getUrunlerIncludeKategori } from "./dbdata.js";
import {
  getMainMenu,
} from "./dbdata.js";
const makeUrunler = async () => {
  const mainMenus = await getMainMenu();

  return mainMenus
};
export const KategoriPageRender = async (req, res) => {
    const mainMenus = await makeUrunler();
  let {urunler,altKategoriler,breadcrumbs} = await getUrunlerIncludeKategori(req.path);
  urunler = urunler.map(item=>{
    item.resimler = JSON.parse(item.resimler);
    let newItem = {
      ...item,
      resim_on:!!item.resimler && item.resimler.length > 0 ? '/uploads' + item.resimler[0] : '/assets/urun/resim_yok.webp',
            resim_arka:!!item.resimler && item.resimler.length > 1 ? '/uploads' + item.resimler[1] : '/assets/urun/resim_yok.webp',

    }
    return newItem;
  })
  res.render("pages/website/kategori.hbs", {
    title: "Kategori",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urunler:!!urunler ? urunler : [],
    altKategoriler:!!altKategoriler ? altKategoriler : [],
    menus: [...mainMenus],
    breadcrumbs:breadcrumbs,
    dizi1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  });
};
