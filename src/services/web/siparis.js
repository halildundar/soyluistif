import {getMainMenu,GetEticLogos} from "./dbdata.js";
export const SiparişBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
    const eticSiteler = await GetEticLogos();
  res.render("pages/website/sepet/siparis-bilgi.hbs", {
    title: "Siparişler",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus:mainMenus,
    eticSiteler:eticSiteler
  });
};
export const SiparişlerPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
    const eticSiteler = await GetEticLogos();
  res.render("pages/website/siparis/main.hbs", {
    title: "Siparişler",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus:mainMenus,
    eticSiteler:eticSiteler
  });
};

