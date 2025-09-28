import { verifyPassword, hashPassword, RandomId } from "../../crypt.js";
import { getMainMenu, GetEticLogos, GetSettings } from "../dbdata.js";
import {
  SendActivationMail,
  SendSifreDegistirmeMail,
} from "../../mail/main.js";
import { DB } from "../../mysql.js";
export const MusteriActivation = async (req, res) => {
  const mainMenus = await getMainMenu();
  const eticSiteler = await GetEticLogos();
  const sett = await GetSettings();
  const { urn, cdn } = req.query;
  let respData = { status: false, msg: "Aktivasyon sağlanamadı" };
  if (!!urn && !!cdn) {
    let item = verifyPassword(cdn, urn);
    let isAkitf = await DB.Query("SELECT id FROM `musteriler` WHERE onay_kod = ?", [cdn]);
    if (!!item) {
      if (isAkitf.length == 1) {
        respData = {
          status: true,
          msg: "Kullanıcı hesabınız aktifleştirildi. Lütfen giriş Yapınız",
        };
        await DB.Query("UPDATE `musteriler` SET ? WHERE onay_kod = ?", [
          { onay_kod: "-" },
          cdn,
        ]);
      } else {
        respData = {
          status: true,
          msg: "Kullanıcı hesabınız daha önce aktifleştirilmiş",
        };
      }
    }
  }
  return res.render("pages/website/auth/activasyononay.hbs", {
    title: "Not Activation User",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    altKategoriler: mainMenus,
    menus: [...mainMenus],
    dizi1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    eticSiteler: eticSiteler,
    wpno: sett.whatsappno,
    respData: respData,
  });
};

export const SendActvCode = async (req, res) => {
  try {
    if (!req.body) {
      return res.json({ status: false, msg: "Hata!" });
    }
    const { email } = req.body;
    let onay_kod = RandomId(6);
    let onayhsh = hashPassword(onay_kod);
    let password = RandomId(10);
    let dbdata = { passw: password, onay_kod: onay_kod };
    const isEmailRegistered = await DB.Query(
      "SELECT * FROM `musteriler` WHERE email = ?",
      [email]
    );
    if (!!isEmailRegistered && isEmailRegistered.length === 1) {
      const resa = await DB.Query("UPDATE `musteriler` SET ? WHERE email = ?", [
        { ...dbdata },
        email,
      ]);
      await SendActivationMail(onay_kod, onayhsh, email);
      return res.json({ status: true, msg: "OK!" });
    }

    return res.json({
      status: false,
      msg: `${email} ile kayıtlı bir kullanıcı bulunamadı`,
    });
  } catch (error) {
    console.log(error);
  }
};
export const SendActvCodeRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  return res.render("pages/website/auth/sifre-unutma.hbs", {
    title: "Şifre Değiştir",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri: req.user,
  });
};
export const SendChangePasswRender = async (req, res) => {
  const mainMenus = await getMainMenu();
  const sett = await GetSettings();
  return res.render("pages/website/auth/sifre-degistir.hbs", {
    title: "Şifre Değiştir",
    scriptname:process.env.WEBSCRIPTNAME,
    scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
    menus: [...mainMenus],
    wpno: sett.whatsappno,
    musteri: req.user,
  });
};
export const SendChangePassw = async (req, res) => {
  try {
    if (!req.body) {
      return res.json({ status: false, msg: "Hata!" });
    }
    let respData = { status: false, msg: "Şifre değişikliği yapılamadı!" };
    const { newpassw1, urn, cdn } = req.body;
    if (!!urn && !!cdn) {
      let item = verifyPassword(cdn, urn);
      if (!!item) {
        await DB.Query("UPDATE `musteriler` SET ? WHERE onay_kod = ?", [
          { passw: newpassw1, onay_kod: "-" },
          cdn,
        ]);
        respData = {
          status: true,
          msg: "Şifre Değiştirildi. Lütfen giriş Yapınız",
        };
      }
    }
    return res.json({ ...respData });
  } catch (error) {
    console.log(error);
  }
};

export const SendPassChangeActvCode = async (req, res) => {
  try {
    if (!req.body) {
      return res.json({ status: false, msg: "Hata!" });
    }
    const { email } = req.body;
    let onay_kod = RandomId(6);
    let onayhsh = hashPassword(onay_kod);
    let password = RandomId(10);
    let dbdata = { passw: password, onay_kod: onay_kod };
    const isEmailRegistered = await DB.Query(
      "SELECT * FROM `musteriler` WHERE email = ?",
      [email]
    );
    if (!!isEmailRegistered && isEmailRegistered.length === 1) {
      const resa = await DB.Query("UPDATE `musteriler` SET ? WHERE email = ?", [
        { ...dbdata },
        email,
      ]);
      await SendSifreDegistirmeMail(onay_kod, onayhsh, email);
      return res.json({ status: true, msg: "OK!" });
    }

    return res.json({
      status: false,
      msg: `${email} ile kayıtlı bir kullanıcı bulunamadı`,
    });
  } catch (error) {
    console.log(error);
  }
};
