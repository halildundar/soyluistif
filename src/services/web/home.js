import {
  getBanners,
  getCokSatanlar,
  getMainMenu,
  getOneCikanlar,
  getYeniler,
  GetEticLogos,
  GetSettings,
  GetCurrncySym,
} from "./dbdata.js";
const makeBannerAndUrunler = async () => {
  const bannerHomeLeft = await getBanners("homeleft");
  const bannerHomeRight = await getBanners("homeright");
  const imagesBg = bannerHomeLeft.map((item) => item.img_url);
  const imagesSm = bannerHomeRight.map((item) => item.img_url);
  const mainMenus = await getMainMenu();
  let onecikanlar = await getOneCikanlar();
  onecikanlar = onecikanlar.map((item) => {
    let imgs = !!item["resimler"] ? JSON.parse(item["resimler"]) : [];
    let yorumlar = item.yorumlar;
    let oran = 0;
    if (!!yorumlar) {
      oran = Math.floor(
        JSON.parse(yorumlar)
          .map((a) => Number(a.oran))
          .reduce((acc, curr) => acc + curr, 0) / JSON.parse(yorumlar).length
      );
    }
    let newItem = {
      ...item,
      kalan_stok: item.stok - item.alinan,
      resimler: imgs,
      oran:oran
    };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return {
      ...newItem,
      symbcurr: GetCurrncySym(newItem),
    };
  });
  let coksatanlar = await getCokSatanlar();
  coksatanlar = coksatanlar.map((item) => {
    let imgs = !!item["resimler"] ? JSON.parse(item["resimler"]) : [];
      let yorumlar = item.yorumlar;
     let oran = 0;
    if (!!yorumlar) {
      oran = Math.floor(
        JSON.parse(yorumlar)
          .map((a) => Number(a.oran))
          .reduce((acc, curr) => acc + curr, 0) / JSON.parse(yorumlar).length
      );
    }
    let newItem = {
      ...item,
      kalan_stok: item.stok - item.alinan,
      resimler: imgs,
      oran:oran
    };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return {
      ...newItem,
      symbcurr: GetCurrncySym(newItem),
    };
  });
  let enyeniler = await getYeniler();
  enyeniler = enyeniler.map((item) => {
    let imgs = !!item["resimler"] ? JSON.parse(item["resimler"]) : [];
    let oran = 0;
          let yorumlar = item.yorumlar;
    if (!!yorumlar) {
      oran = Math.floor(
        JSON.parse(yorumlar)
          .map((a) => Number(a.oran))
          .reduce((acc, curr) => acc + curr, 0) / JSON.parse(yorumlar).length
      );
    }
    let newItem = {
      ...item,
      kalan_stok: item.stok - item.alinan,
      resimler: imgs,
      oran:oran
    };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return {
      ...newItem,
      symbcurr: GetCurrncySym(newItem),
    };
  });

  return {
    enyeniler,
    coksatanlar,
    onecikanlar,
    imagesBg,
    imagesSm,
    mainMenus,
  };
};

export const HomePageRender = async (req, res) => {
  const { enyeniler, coksatanlar, onecikanlar, imagesBg, imagesSm, mainMenus } =
    await makeBannerAndUrunler();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
  // console.log(process.env.IYZICO_API_KEY);
  // console.log(process.env.WEBSCRIPTNAME)
  res.render("pages/website/home/main.hbs", {
    title: "Anasayfa | Soylu İstif Makinaları",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    imagesBg: [
      ...imagesBg,
      // "assets/banner1/banner1.webp",
      // "assets/banner1/banner2.webp",
      // "assets/banner1/banner3.webp",
      // "assets/banner1/banner4.webp",
    ],
    imagesSm: [
      ...imagesSm,
      // "assets/banner2/banner1.webp",
      // "assets/banner2/banner2.webp",
      // "assets/banner2/banner3.webp",
      // "assets/banner2/banner4.webp",
    ],
    dizi: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    menus: [...mainMenus],
    onecikanlar: onecikanlar,
    coksatanlar: coksatanlar,
    enyeniler: enyeniler,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
    musteri: req.user,
  });
};
