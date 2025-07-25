import express from "express";
let router = express.Router({ mergeParams: true });
import { getMainMenu, SiparisAdd } from "./web/dbdata.js";
const Iyzipay = require("iyzipay");
import { utils } from "./utilsiyzico.js";
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

const verifySignature = (params, secretKey, signature) => {
  const calculatedSignature = utils.calculateHmacSHA256Signature(
    params,
    secretKey
  );
  const verified = signature === calculatedSignature;
  return verified;
};
export const IyzicoApi = (app) => {
  router.post("/iyz/bin-check", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      binNumber: data.binNumber,
    };
    const iyzResult = await new Promise((res, rej) => {
      iyzipay.binNumber.retrieve(request, function (err, result) {
        if (err) {
          rej(err);
        }
        res(result);
      });
      // iyzipay.payment.create(request, function (err, result) {
      //   if (!!err) {
      //     rej(err);
      //   }
      //   res(result);
      // });
    });
    return res.json(iyzResult);
  });
  router.get("/iyz/3ds-verify", async (req, res) => {
    let strar = req.query.ulre;
    if (!strar) {
      return res.send("not Found");
    }
    const buff = Buffer.from(strar, "base64");
    return res.send(buff.toString("utf8"));
  });
  router.post("/iyz/3ds-init", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    let request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      price: "1",
      paidPrice: "1.2",
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: "http://localhost:3000/iyz/3ds-pay",
      paymentCard: {
        cardHolderName: data.cardHolderName,
        cardNumber: data.cardNumber,
        expireMonth: data.expireMonth,
        expireYear: data.expireYear,
        cvc: data.cvc,
        registerCard: "0",
      },
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101",
          name: "Binocular",
          category1: "Collectibles",
          category2: "Accessories",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "0.3",
        },
        {
          id: "BI102",
          name: "Game code",
          category1: "Game",
          category2: "Online Game Items",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: "0.5",
        },
        {
          id: "BI103",
          name: "Usb",
          category1: "Electronics",
          category2: "Usb / Cable",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "0.2",
        },
      ],
    };
    request = {...request,...data};
    iyzipay.threedsInitialize.create(request, async function (err, result) {
      if (err) {
        return res.json({ status: false, msg: err });
      }
      if (result.status === "success") {
        const {
          paymentId,
          conversationId,
          signature,
          threeDSHtmlContent,
          systemTime,
        } = result;
        await SiparisAdd({ ...request, paymentId, systemTime });
        return res.json({
          status: true,
          html: threeDSHtmlContent,
        });
      } else if (result.status == "failure") {
        return res.json({
          status: false,
          msg: result.errorMessage,
        });
      }
    });
    // return res.json({...request});
  });
  router.get("/iyz/3ds-pay", async (req, res) => {
    return res.redirect("/");
  });
  router.post("/iyz/3ds-pay", async (req, res) => {
    const data = req.body;
    if (!data) {
      return;
    }
    const { status, paymentId, conversationId, conversationData, mdStatus } =
      data;
    const mainMenus = await getMainMenu();
    let resparea = {
      title: "Ödeme Başarısız",
      scriptname: `main`,
      scripts: `<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      menus: mainMenus,
      odemeStatus: "",
    };
    if (mdStatus == 1) {
      const request = {
        conversationId: conversationId,
        locale: Iyzipay.LOCALE.TR,
        paymentId: paymentId,
        conversationData: conversationData,
      };
      return iyzipay.threedsPayment.create(request, async (err, result) => {
        if (err) {
          return res.render("pages/website/sepet/odeme-result.hbs", resparea);
        }
        const {
          paymentId,
          currency,
          basketId,
          conversationId,
          paidPrice,
          price,
          signature,
        } = result;
        if (result.status === "success") {
          // verifySignature([paymentId, currency, basketId, conversationId, paidPrice, price], secretKey, signature);
          //mail gönder ve siparişlr bölümüne kaydet.
          return res.render("pages/website/sepet/odeme-result.hbs", {
            ...resparea,
            odemestatus: "Success",
            odememesaj: "Ödeme Başarılı",
            paymentId: paymentId,
          });
        } else if (result.status == "failure") {
          if (!!paymentId) {
            await SiparisDelete(paymentId);
          }

          return res.render("pages/website/sepet/odeme-result.hbs", {
            ...resparea,
            odemestatus: "Error",
            odememesaj: result.errorMessage,
          });
        }
      });
    } else if (mdStatus == -1) {
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      //mdStatus = 0 ile aynıdır. QNB Finansbank'a özel dönüştür.
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "3-D Secure imzası geçersiz veya doğrulama.",
      });
    } else if (mdStatus == 0) {
      //3-D Secure imzası geçersiz veya doğrulama.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "3-D Secure imzası geçersiz veya doğrulama.",
      });
    } else if (mdStatus == 2) {
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      //Kart sahibi veya bankası sisteme kayıtlı değil.
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "Kart sahibi veya bankası sisteme kayıtlı değil.",
      });
    } else if (mdStatus == 3) {
      //Kartın bankası sisteme kayıtlı değil.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "Kartın bankası sisteme kayıtlı değil.",
      });
    } else if (mdStatus == 4) {
      //Doğrulama denemesi, kart sahibi sisteme daha sonra kayıt olmayı seçmiş
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj:
          "Doğrulama denemesi, kart sahibi sisteme daha sonra kayıt olmayı seçmiş",
      });
    } else if (mdStatus == 5) {
      //Doğrulama yapılamıyor.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "Doğrulama yapılamıyor.",
      });
    } else if (mdStatus == 6) {
      //3-D Secure hatası.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "3-D Secure hatası.",
      });
    } else if (mdStatus == 7) {
      //Sistem hatası.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "Sistem hatası.",
      });
    } else if (mdStatus == 7) {
      //Bilinmeyen kart no.
      if (!!paymentId) {
        await SiparisDelete(paymentId);
      }
      return res.render("pages/website/sepet/odeme-result.hbs", {
        ...resparea,
        odemestatus: "Error",
        odememesaj: "Bilinmeyen kart no.",
      });
    }
  });

  return app.use("/", router);
};
