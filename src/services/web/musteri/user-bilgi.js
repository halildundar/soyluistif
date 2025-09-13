import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
export const UserBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  return res.render("pages/website/auth/user-bilgi.hbs", {
    title: "Üye ol",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri:req.user
  });
};