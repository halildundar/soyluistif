import { getMainMenu, GetEticLogos, GetSettings } from "./dbdata.js";
export const SepetPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();

  res.render("pages/website/sepet/main.hbs", {
    title: "Sepet",
    scriptname: `main`,
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
  res.render("pages/website/sepet/odeme.hbs", {
    title: "Ödeme",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
  });
};

export const SiparişBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
  res.render("pages/website/sepet/siparis-bilgi.hbs", {
    title: "Sipariş Bilgi",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
  });
};
