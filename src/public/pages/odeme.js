import { myloc } from "../main.js";
import {CreditCardArea} from '../util/fncs.js';
const getUrunler = (ids) => {
  return $.ajax({
    type: "POST",
    url: "/sepet/get-urunler",
    data: { ids: ids },
    dataType: "json",
  });
};
const getTemp = async (temname) => {
  const temp = await $.ajax({
    type: "POST",
    url: "/templates/get-temp",
    data: { folderpath: temname },
  });
  return temp;
};
const getOneTotal = (urun) => {
  let toplamTutar = urun.adet * urun.fiyat;
  let kdvToplam = urun.adet * urun.fiyat * 0.2;
  let inidirimTutar = urun.adet * urun.indirimli_fiyat;
  let indirim = toplamTutar - inidirimTutar;
  indirim = toplamTutar - inidirimTutar;
  let total = inidirimTutar + kdvToplam;
  return {
    toplamTutar,
    kdvToplam,
    indirim,
    total,
  };
};
const getTotal = (urunler) => {
  let toplamTutar = 0;
  let kdvToplam = 0;
  let inidirimTutar = 0;
  let indirim = 0;
  for (let i = 0; i < urunler.length; i++) {
    const urun = urunler[i];
    toplamTutar += urun.adet * urun.fiyat;
    inidirimTutar += urun.adet * urun.indirimli_fiyat;
    kdvToplam += urun.adet * urun.fiyat * 0.2;
  }
  indirim = toplamTutar - inidirimTutar;
  let total = inidirimTutar + kdvToplam;
  return {
    toplamTutar,
    kdvToplam,
    indirim,
    total,
  };
};
const makeTotal = (urunler) => {
  let toplamTutar = 0;
  let kdvToplam = 0;
  let inidirimTutar = 0;
  let indirim = 0;
  for (let i = 0; i < urunler.length; i++) {
    const urun = urunler[i];
    toplamTutar += urun.adet * urun.fiyat;
    inidirimTutar += urun.adet * urun.indirimli_fiyat;
    kdvToplam += urun.adet * urun.fiyat * 0.2;
  }
  indirim = toplamTutar - inidirimTutar;
  let total = inidirimTutar + kdvToplam;
  $(".toplam_tutar").html("+" + toplamTutar + ".00₺");
  $(".total_kdv").html("+" + kdvToplam + ".00₺");
  $(".total_indirim").html("-" + indirim + ".00₺");
  $(".toplam").html(total + ".00₺");
};
export const OdemeInit = async () => {
  const sepet = myloc.getItem("sepet");
  const ids = sepet.map((item) => item.id);
  if (ids.length > 0) {
    let urunler = await getUrunler(ids);
    urunler = urunler.map((urun) => {
      const { adet } = sepet.find((it) => it.id == urun.id);
      let resimler = JSON.parse(urun.resimler);
      return {
        ...urun,
        resim:
          !!resimler && !!resimler[0]
            ? "/uploads" + resimler[0]
            : "/assets/urun/resim_yok.webp",
        adet: adet,
      };
    });
    // Sağ Alan Init
    const strTempRight = await getTemp("odeme.html");
    const rendredRight = Handlebars.compile(strTempRight);
    $(".spetbfyRight").html(rendredRight({ urunler: urunler }));
    CreditCardArea();
    makeTotal(urunler);

    //Ödeme Yap
    $(".btn-check-bin").on("click", async function () {
      let formCard = $(".form-card").serializeJSON();
      formCard["binNumber"] = formCard["cardNumber"].slice(0, 6);
      const res = await $.ajax({
        type: "POST",
        url: "/iyz/bin-check",
        data: { ...formCard },
        dataType: "json",
      });
    });
    $(".btn-3dinit").on("click", async function () {
      let formCard = $(".form-card").serializeJSON();
      formCard["binNumber"] = formCard["cardNumber"].slice(0, 6);
      const fatura = myloc.getItem("fatura");
      const adres = myloc.getItem("adres");
      let { total } = getTotal(urunler);
      let newUrunler = urunler.map((urun) => {
        let price = getOneTotal(urun);
        let newItem = {
          id: urun.id,
          name: urun.name,
          category1: urun.parents,
          category2: "",
          itemType: "PHYSICAL", // 'VIRTUAL'
          price: price.total,
          adet:urun.adet,
          indirimli_fiyat:urun.indirimli_fiyat,
          fiyat:urun.fiyat,
          indirim:urun.indirim
        };
        return newItem;
      });
      let billingAddress = {
        contactName: `${fatura.isim} ${fatura.soyisim}`,
        city: `${fatura.isim}`,
        country: "Türkiye",
        address: `${fatura.mahalle} ${fatura.adres} ${fatura.ilce} / ${fatura.il}`,
        zipCode: `${fatura.pk}`,
      };
      let shippingAddress = {};
      if (!adres) {
        shippingAddress = billingAddress;
      } else {
        shippingAddress = {
          contactName: `${adres.isim} ${adres.soyisim}`,
          city: `${adres.isim}`,
          country: "Türkiye",
          address: `${adres.mahalle} ${adres.adres} ${adres.ilce} / ${adres.il}`,
          zipCode: `${adres.pk}`,
        };
      }
      let requestData = {
        // locale: Iyzipay.LOCALE.TR,
        conversationId: "123456789",
        price: total,
        paidPrice: total,
        // currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67832",
        // paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        // paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: "http://localhost:3000/iyz/3ds-pay",
        paymentCard: {
          cardHolderName: formCard.cardHolderName,
          cardNumber: formCard.cardNumber,
          expireMonth: formCard.expireMonth,
          expireYear: formCard.expireYear,
          cvc: formCard.cvc,
          registerCard: "0",
        },
        buyer: {
          id: "BY789",
          name: fatura.isim,
          surname: fatura.soyisim,
          gsmNumber: fatura.telefon, //"+905350000000",
          email: fatura.email,
          identityNumber: fatura.tc,
          lastLoginDate: "2015-10-05 12:43:35",
          registrationDate: "2013-04-21 15:12:09",
          registrationAddress: `${fatura.mahalle} ${fatura.adres} ${fatura.ilce} / ${fatura.il}`,
          ip: "85.34.78.112",
          city: fatura.il,
          country: "Turkey",
          zipCode: fatura.pk,
        },
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: [
          ...newUrunler,
          // {
          //   id: "BI101",
          //   name: "Binocular",
          //   category1: "Collectibles",
          //   category2: "Accessories",
          //   itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          //   price: "0.3",
          // },
          // {
          //   id: "BI102",
          //   name: "Game code",
          //   category1: "Game",
          //   category2: "Online Game Items",
          //   itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          //   price: "0.5",
          // },
          // {
          //   id: "BI103",
          //   name: "Usb",
          //   category1: "Electronics",
          //   category2: "Usb / Cable",
          //   itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          //   price: "0.2",
          // },
        ],
      };
      const res = await $.ajax({
        type: "POST",
        url: "/iyz/3ds-init",
        data: { ...requestData },
        dataType: "json",
      });
      if (res.status) {
        if (!!res.html) {
          window.location =
            "http://localhost:3000/iyz/3ds-verify?ulre=" +
            encodeURIComponent(res.html);
        }
      } else {
        $(".errmsg").remove();
        $(".btn-3dinit")
          .parent()
          .after(
            `<div class="errmsg text-red-500 text-center font-semibold py-2">${res.msg}</div>`
          );
      }
    });
  } else {
    window.location = "/";
  }
};
