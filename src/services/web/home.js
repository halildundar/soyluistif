import {
  getBanners,
  getCokSatanlar,
  getMainMenu,
  getOneCikanlar,
  getYeniler,
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
    let newItem = { ...item, resimler: imgs };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? "/uploads" + newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? "/uploads" + newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return newItem;
  });
  let coksatanlar = await getCokSatanlar();
  coksatanlar = coksatanlar.map((item) => {
    let imgs = !!item["resimler"] ? JSON.parse(item["resimler"]) : [];
    let newItem = { ...item, resimler: imgs };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? "/uploads" + newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? "/uploads" + newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return newItem;
  });
  let enyeniler = await getYeniler();
  enyeniler = enyeniler.map((item) => {
    let imgs = !!item["resimler"] ? JSON.parse(item["resimler"]) : [];
    let newItem = { ...item, resimler: imgs };
    newItem["img_on"] =
      newItem.resimler.length > 0
        ? "/uploads" + newItem.resimler[0]
        : "/assets/urun/resim_yok.webp";
    newItem["img_arka"] =
      newItem.resimler.length > 1
        ? "/uploads" + newItem.resimler[1]
        : "/assets/urun/resim_yok.webp";
    return newItem;
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
  const { enyeniler, coksatanlar, onecikanlar, imagesBg, imagesSm, mainMenus } = await makeBannerAndUrunler();
 
  res.render("pages/website/home/main.hbs", {
    title: "Anasayfa",
    scriptname: `main`,
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
  });
};
