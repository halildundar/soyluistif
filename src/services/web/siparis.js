import { getMainMenu, GetEticLogos,GetSettings } from "./dbdata.js";
import { SiparisByiIyzIDGet } from "./dbdata.js";
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
export const SiparişBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
      const sett = await GetSettings();
       let user = {...req.user,adres:JSON.parse(req.user.adres)}
  res.render("pages/website/sepet/siparis-bilgi.hbs", {
    title: "Siparişler",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno:sett.whatsappno,
    musteri:user
  });
};

export const SiparişlerPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
    const sett = await GetSettings();
  const query = req.query;
  let user = {...req.user,adres:JSON.parse(req.user.adres)}
  let data = {
    title: "Siparişler",
    scriptname:process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: mainMenus,
    eticSiteler: eticSiteler,
    wpno:sett.whatsappno,
    musteri:user
  };
  if (!!query && !!query["crp"]) {
    const [siparis] = await SiparisByiIyzIDGet([query.crp]);
    let urunlerStr = '';
    let urunler = JSON.parse(siparis.basketItems);
    for (let i = 0; i < urunler.length; i++) {
      const urun = urunler[i];
      urunlerStr += `${urun.adet} x ${urun.name}\n\r`
    }
    let billingAddress = JSON.parse(siparis.billingAddress).address;
    let shippingAddress = JSON.parse(siparis.shippingAddress).address;
    const date = new Date(parseInt(siparis.systemTime));
    let time = `${pad(date.getDate(), 2)}.${pad(
      date.getMonth() - 1,
      2
    )}.${date.getFullYear()} ${pad(date.getHours(), 2)}:${pad(
      date.getMinutes()
    )}`;
    return res.render("pages/website/siparis/main query.hbs", {
      ...data, siparis,
      tarih: time,
      shippingAddress,billingAddress,
      urunlerStr,
      wpno:sett.whatsappno,
       musteri:user
    });
  }
  return res.render("pages/website/siparis/main.hbs", data);
};
