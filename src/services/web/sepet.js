import { getMainMenu, GetEticLogos, GetSettings } from "./dbdata.js";
export const SepetPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();

  res.render("pages/website/sepet/main.hbs", {
    title: "Sepet",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
    musteri: req.user,
  });
};

export const OdemePageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
    let user = {...req.user,adres:JSON.parse(req.user.adres)}
  res.render("pages/website/sepet/odeme.hbs", {
    title: "Ödeme",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
    musteri:user
  });
};

export const SiparişBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
    let user = {...req.user,adres:JSON.parse(req.user.adres)}
  res.render("pages/website/sepet/siparis-bilgi.hbs", {
    title: "Sipariş Bilgi",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
     musteri:user
  });
};
