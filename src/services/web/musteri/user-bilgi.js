import { DB } from "../../mysql.js";
import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
export const UserBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  return res.render("pages/website/auth/user-bilgi.hbs", {
    title: "Müşteri Genel Bilgiler",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri: req.user,
  });
};
export const UserDataUpdatAdres = async (req, res) => {
  if (!req.body) {
    return res.json({ status: false, msg: "Gerekli bilgiler eksik" });
  }
  try {
    const { adres } = req.body;
    console.log(adres, req.user);
    const rep = await DB.Query("UPDATE `musteriler` SET ? WHERE id = ?", [
      { adres: JSON.stringify(adres) },
      req.user.id,
    ]);
    return res.json({ status: true, msg: "Ok!" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Hata!" });
  }
};
export const UserDataUpdate = async (req, res) => {
  if (!req.body) {
    return res.json({ status: false, msg: "Gerekli bilgiler eksik" });
  }
  try {
    let { newpassw1, newpassw2, ...others } = req.body;
    let newItem = { ...others, passw: newpassw1 };
    const rep = await DB.Query("UPDATE `musteriler` SET ? WHERE id =?", [
      { ...newItem },
      req.user.id,
    ]);
    return res.json({ status: true, msg: "Ok!" });
  } catch (error) {
    return res.json({ status: false, msg: "Hata!" });
  }
};
export const UserAdresBilgiPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  let user = { ...req.user, adres: JSON.parse(req.user.adres) };
  return res.render("pages/website/auth/user-adresbilgi.hbs", {
    title: "Müşteri Adres Bilgileri",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri: user,
  });
};

function creditCardMask(number, character = "*") {
  if (typeof number !== "string") {
    number = number.toString();
  }
  number = number.replace(/[^0-9]+/g, ""); /*ensureOnlyNumbers*/
  let len = number.length;
  return (
    number.substring(0, 3) +
    character.repeat(len - 6) +
    number.substring(len - 3, len)
  );
}
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
function getTarih(time) {
  const mydate = new Date(parseInt(time));
  const day = pad(mydate.getDate(), 2);
  const month = pad(mydate.getMonth() + 1, 2);
  const year = mydate.getFullYear();
  const hour = mydate.getHours();
  const minutes = mydate.getMinutes();
  return `${day}.${month}.${year} ${hour}:${minutes}`;
}
export const UserSiparisPageRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  let siparisler = await DB.Query("SELECT * FROM `siparis` WHERE userid = ?", [
    req.user.id,
  ]);
  siparisler = siparisler.sort((a, b) =>
    a.systemTime < b.systemTime ? 1 : -1
  );
  siparisler = siparisler.map((a) => {
    let paymentCard = JSON.parse(a.paymentCard);
    paymentCard.cardNumber = creditCardMask(paymentCard.cardNumber, "*");
    let buyer = JSON.parse(a.buyer);
    buyer.identityNumber = creditCardMask(buyer.identityNumber, "*");
    let itemTransactions = JSON.parse(a.itemTransactions);
    let basketItems = JSON.parse(a.basketItems);
    for (let i = 0; i < basketItems.length; i++) {
      basketItems[i] = {
        ...basketItems[i],
        fiyat: parseFloat(basketItems[i].fiyat).toFixed(2),
        indirimli_fiyat: parseFloat(basketItems[i].indirimli_fiyat).toFixed(2),
        price: parseFloat(basketItems[i].price).toFixed(2),
      };
    }
    return {
      ...a,
      price: parseFloat(a.price).toFixed(2),
      basketItems: basketItems,
      paymentCard: paymentCard,
      shippingAddress: JSON.parse(a.shippingAddress),
      billingAddress: JSON.parse(a.billingAddress),
      itemTransactions: itemTransactions,
      buyer: buyer,
      systemTimeStr: getTarih(a.systemTime),
    };
  });
  let basketItems = siparisler.map((a) => a.basketItems);

  return res.render("pages/website/auth/user-siparis.hbs", {
    title: "Siparişlerim",
    scriptname: `main`,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri: req.user,
    siparisler: siparisler,
    basketItems: basketItems,
  });
};

