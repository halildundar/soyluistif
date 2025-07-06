import { DB } from "../mysql.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getMainMenu} from './dbdata.js';

export const KurumsalRender = async (req, res) => {
    const mainMenus = await getMainMenu();
  const kurumsalviewPath = join(process.cwd(), "/views/pages/website/kurumsal");
  let tempstr = "Not Found";
  let pageurl = "";
  let pagename = '';
  if (req.path === "/hakkimizda") {
    tempstr = readFileSync(join(kurumsalviewPath, "hakkimizda.hbs"));
    pageurl = "hakkimizda";
    pagename = 'Hakkımızda'
  } else if (req.path === "/iletisim") {
    tempstr = readFileSync(join(kurumsalviewPath, "iletisim.hbs"));
    pageurl = "iletisim";
    pagename = 'İletişim'
  } else if (req.path === "/mesafeli-satis-sozlesmesi") {
    tempstr = readFileSync(
      join(kurumsalviewPath, "mesafeli-satis-sozlesmesi.hbs")
    );
    pageurl = "mesafeli-satis-sozlesmesi";
    pagename = 'Mesafeli Satış Sözleşmesi'
  }  else if (req.path === "/siparis-takip") {
    tempstr = readFileSync(join(kurumsalviewPath, "siparis-takip.hbs"));
    pageurl = "siparis-takip";
    pagename = 'Sipariş Takip'
  } else if (req.path === "/havale-bildirimleri") {
    tempstr = readFileSync(join(kurumsalviewPath, "havale-bildirimleri.hbs"));
    pageurl = "havale-bildirimleri";
    pagename = 'Havale Bildirimleri'
  }
  res.render("pages/website/kurumsal/main.hbs", {
    title: "Kurumsal",
    scriptname: `main`,
        scripts:`<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,

    temp: tempstr,
    pagename: pagename,
    pageurl:pageurl,
    menus:mainMenus
  });
};
