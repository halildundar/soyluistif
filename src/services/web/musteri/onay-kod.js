import { verifyPassword } from "../../crypt.js";
import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
export const OnayKodPageRender = async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  console.log(url);
  let urn = url.searchParams.get("urn");
  let cde = url.searchParams.get("cde");
  if (!!urn && !!cde) {
    let item = verifyPassword(cde, "soyluistifleemakin", urn);
    return res.redirect("/");
  }
 

  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  return res.render("pages/website/auth/onay-kod.hbs", {
    title: "Üye ol",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
  });
};
// export const OnayKodVerify = async (req, res) => {
//   res.render;
// };
