import {getMainMenu} from "./dbdata.js";
export const SepetPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  res.render("pages/website/sepet/main.hbs", {
    title: "Sepet",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus:mainMenus
  });
};
