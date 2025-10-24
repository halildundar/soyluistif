import { getUrunByUrl, makeBredCrump,getMainMenu,GetEticLogos,GetSettings, GetCurrncySym } from "./dbdata.js";

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
    urun.currSymb= GetCurrncySym(urun)
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
  res.render("pages/website/urun.hbs", {
    title: !!urun ? urun.name + " | Soylu İstif Makinaları" : "Soylu İstif Makinaları",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    urun: urun,
    breadcrumbs: parents,
    lastkategori: lastkategori,
    menus:[...mainMenus],
    eticSiteler:eticSiteler,
    wpno:sett.whatsappno,
     musteri:req.user,
     weblink:req.protocol + '://' + req.get('host')
  });
};
