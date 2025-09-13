import { getMainMenu, GetEticLogos,GetSettings } from "./dbdata.js";

export const FavorilerPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
  res.render("pages/website/favori/main.hbs", {
    title: "Favoriler",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno:sett.whatsappno,
     musteri:req.user
  });
};
