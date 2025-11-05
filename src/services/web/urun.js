import {
  getUrunByUrl,
  makeBredCrump,
  getMainMenu,
  GetEticLogos,
  GetSettings,
  GetCurrncySym,
} from "./dbdata.js";
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
export const UrunPageRender = async (req, res) => {
  const { urunurl } = req.params;
  let urun;
  let parents = [];
  let lastkategori;
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
  if (!!urunurl) {
    urun = await getUrunByUrl(urunurl);
    urun.currSymb = GetCurrncySym(urun);
    urun.resimler = !!urun.resimler ? JSON.parse(urun.resimler) : urun.resimler;
    urun.aciklama = !!urun.aciklama ? JSON.parse(urun.aciklama) : urun.aciklama;
    urun.garanti_aciklama = !!urun.garanti_aciklama
      ? JSON.parse(urun.garanti_aciklama)
      : urun.garanti_aciklama;
    urun.youmlar = !!urun.youmlar ? JSON.parse(urun.youmlar) : urun.youmlar;
    parents = JSON.parse(urun.parents);
    parents = await makeBredCrump(parents);
    lastkategori = parents[parents.length - 1];
    parents = parents.map((item, index) => {
      return { ...item, last: index + 1 };
    });
    parents.push({
      name: urun.name,
      url: "/urun/" + urun.url,
      last: 0,
    });
  }
  let yorumlar = !!urun && !!urun.yorumlar ? JSON.parse(urun.yorumlar) : null;
  let yorumTotal = 5;
  let totalStars = "";
  let yorumlength = 0;
  let oran = 0;
  if (!!yorumlar) {
    oran = yorumlar.map(a=>Number(a.oran)).reduce((acc,curr)=>acc + curr,0) / yorumlar.length;
    oran = Math.floor(oran);
    yorumlar = yorumlar
      .sort((a, b) => b.tarih - a.tarih)
      .map((a) => {
        return {
          ...a,
          oran:Number(a.oran),
          resimler: a.resimler,
          first_resim: a.resimler[0],
          tarih:
            pad(new Date(a.tarih).getDate(), 2) +
            "." +
            pad(new Date(a.tarih).getMonth() - 1, 2) +
            "." +
            new Date(a.tarih).getFullYear(),
        };
      });
    yorumTotal = yorumlar.reduce((acc, curr) =>acc + curr.oran, 0) / yorumlar.length;
    yorumTotal = Math.floor(yorumTotal);
    yorumTotal = yorumTotal.toFixed(1);
    yorumlength = yorumlar.length;
  }
  let urunresimler = !!urun && !!urun.resimler ? urun.resimler : null;
  res.render("pages/website/urun.hbs", {
    title: !!urun
      ? urun.kod + " | Soylu İstif Makinaları"
      : "Soylu İstif Makinaları",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urun: urun,
    breadcrumbs: parents,
    lastkategori: lastkategori,
    menus: [...mainMenus],
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
    musteri: req.user,
    weblink: req.protocol + "://" + req.get("host"),
    yorumlar: yorumlar,
    yorumlenght: !!yorumlar ? yorumlar.length : 0,
    yorumTotal: yorumTotal,
    totalStars: totalStars,
    yorumlength: yorumlength,
    firsturunresim:!!urunresimler ? urunresimler[0] : '/assets/urun/resim_yok.webp',
    oran:oran
    // urunyorum_imgs:!!urunresimler ? !!urunresimler  : ["/assets/urun/resim_yok.webp"]
  });
};
