import { myloc } from "../main.js";
import {
  AdresAlanInit,
  GetIl,
  GetIlce,
  GetMahalle,
  SetAdresData,
} from "../util/adres.js";
import { GetCurrncySym } from "./util/main.js";
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
const makeTotal = (urunler) => {
  let toplamTutar = 0;
  let kdvToplam = 0;
  let inidirimTutar = 0;
  let indirim = 0;
  let currSymb = "$"
  for (let i = 0; i < urunler.length; i++) {
    if (i == 0) {
      currSymb = GetCurrncySym(urunler[i]);
    }
    const urun = urunler[i];
    toplamTutar += urun.adet * urun.fiyat;
    inidirimTutar += urun.adet * urun.indirimli_fiyat;
    kdvToplam +=
      urun.adet *
      urun.fiyat *
      (!urun.kdv || urun.kdv == 0 ? 0 : urun.kdv / 100);
  }
  indirim = toplamTutar - inidirimTutar;
  indirim = toplamTutar - inidirimTutar;
  let total = inidirimTutar + kdvToplam;

  $(".toplam_tutar").html("+" + toplamTutar.toFixed(2) + currSymb);
  $(".total_kdv").html("+" + kdvToplam.toFixed(2) + currSymb);
  $(".total_indirim").html("-" + indirim.toFixed(2) + currSymb);
  $(".toplam").html(total.toFixed(2) + currSymb);
};
export const SiparisBilgiInit = async () => {
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

    // Sol Alan Init
    // const strTempLeft = await getTemp("siparis-bilgi-left.html");
    // const rendredLeft = Handlebars.compile(strTempLeft);
    // $(".spetbfyLeft").html(rendredLeft({ urunler: urunler }));
    await AdresAlanInit(".fat-area");
    if (!!$(".fat-area [name='il_id']").attr("data-ur")) {
      SetAdresData(
        $(".fat-area [name='il_id']").attr("data-ur"),
        $(".fat-area [name='ilce_id']").attr("data-ur"),
        $(".fat-area [name='mahalle_id']").attr("data-ur"),
        ".fat-area"
      );
    } else {
      SetAdresData(1, 1, 1, ".fat-area");
    }
    await AdresAlanInit(".kar-area");
    if (!!$(".kar-area [name='il_id']").attr("data-ur")) {
      SetAdresData(
        $(".kar-area [name='il_id']").attr("data-ur"),
        $(".kar-area [name='ilce_id']").attr("data-ur"),
        $(".kar-area [name='mahalle_id']").attr("data-ur"),
        ".kar-area"
      );
    } else {
      SetAdresData(1, 1, 1, ".kar-area");
    }

    // Sağ Alan Init
    const strTempRight = await getTemp("siparis-bilgi-right.html");
    const rendredRight = Handlebars.compile(strTempRight);
    urunler = urunler.map(it=>{
      return {...it,
        fiyatStr:it.fiyat.toFixed(2) + GetCurrncySym(it)
      }
    })
    $(".spetbfyRight").html(rendredRight({ urunler: urunler }));
    makeTotal(urunler);

    //Checkbox adres area show or hide
    $("#isOtherAdres").on("change", function () {
      const status = $(this).prop("checked");
      $(".kar-area").css("display", !status ? "none" : "block");
      if (!status) {
        $(".kar-area input[type='text']").val("");
        $(".kar-area textarea").html("");
        SetAdresData(1, 1, 1, ".kar-area");
      }
    });
    if (!!$(".kar-area [name='isim']").val()) {
      $("#isOtherAdres").trigger("click");
    }

    // const fatura = myloc.getItem("fatura");
    // const adres = myloc.getItem("adres");
    // if (!!fatura) {
    //   $("form.fat-area [name='isim']").val(fatura["isim"]);
    //   $("form.fat-area [name='soyisim']").val(fatura["soyisim"]);
    //   $("form.fat-area [name='email']").val(fatura["email"]);
    //   $("form.fat-area [name='tc']").val(fatura["tc"]);
    //   $("form.fat-area [name='telefon']").val(fatura["telefon"]);
    //   SetAdresData(
    //     fatura["il_id"],
    //     fatura["ilce_id"],
    //     fatura["mahalle_id"],
    //     ".fat-area"
    //   );
    //   $("form.fat-area [name='adres']").val(fatura["adres"]);
    //   $("form.fat-area [name='aciklama']").val(fatura["aciklama"]);
    //   if (!!adres) {
    //     $("#isOtherAdres").prop("checked", true);
    //     $("#isOtherAdres").trigger("change");
    //     $("form.kar-area [name='isim']").val(adres["isim"]);
    //     $("form.kar-area [name='soyisim']").val(adres["soyisim"]);
    //     $("form.kar-area [name='email']").val(adres["email"]);
    //     $("form.kar-area [name='telefon']").val(adres["telefon"]);
    //     SetAdresData(
    //       adres["il_id"],
    //       adres["ilce_id"],
    //       adres["mahalle_id"],
    //       ".kar-area"
    //     );
    //     $("form.kar-area [name='adres']").val(adres["adres"]);
    //     $("form.kar-area [name='aciklama']").val(adres["aciklama"]);
    //   } else {
    //     if ($("#isOtherAdres").attr("checked")) {
    //       $(".btn-save-to-pay").css({
    //         "pointer-events": "none",
    //         "background-color": "#dbdbdb",
    //         color: "#00000080",
    //       });
    //     }
    //   }
    // } else {
    //   $(".btn-save-to-pay").css({
    //     "pointer-events": "none",
    //     "background-color": "#dbdbdb",
    //     color: "#00000080",
    //   });
    // }

    $(".btn-save-to-pay").on("click", async function () {
      let faturaData = $(".fat-area").serializeJSON();
      const mahFat = await $.ajax({
        type: "POST",
        url: "/get-mahalle",
        data: { mahalle_id: faturaData["mahalle_id"] },
        dataType: "json",
      });
      faturaData["mahalle"] = mahFat[0].mahalle_adi;
      faturaData["pk"] = mahFat[0].posta_kodu;
      const ilceFat = await $.ajax({
        type: "POST",
        url: "/get-ilce",
        data: { ilce_id: faturaData["ilce_id"] },
        dataType: "json",
      });
      faturaData["ilce"] = ilceFat[0].ilce_adi;
      const ilFat = await $.ajax({
        type: "POST",
        url: "/get-il",
        data: { il_id: faturaData["il_id"] },
        dataType: "json",
      });
      faturaData["il"] = ilFat[0].il_adi;
      myloc.setAllItem("fatura", faturaData);
      let adresData = $(".kar-area").serializeJSON();
      const mahAdres = await $.ajax({
        type: "POST",
        url: "/get-mahalle",
        data: { mahalle_id: adresData["mahalle_id"] },
        dataType: "json",
      });
      adresData["mahalle"] = mahAdres[0].mahalle_adi;
      adresData["pk"] = mahAdres[0].posta_kodu;
      const ilceAdres = await $.ajax({
        type: "POST",
        url: "/get-ilce",
        data: { ilce_id: adresData["ilce_id"] },
        dataType: "json",
      });
      adresData["ilce"] = ilceAdres[0].ilce_adi;
      const ilAdres = await $.ajax({
        type: "POST",
        url: "/get-il",
        data: { il_id: adresData["il_id"] },
        dataType: "json",
      });
      adresData["il"] = ilAdres[0].il_adi;
      myloc.setAllItem("adres",  $("#isOtherAdres").prop('checked') ? adresData : faturaData);
      let adres = {
        fatura: faturaData,
        kargo: adresData,
      };
      console.log(adres);
      window.location = "/odeme";
    });

    $(".btn-adres-clear").on("click", function () {
      SetAdresData(1, 1, 1, ".fat-area");
      SetAdresData(1, 1, 1, ".kar-area");
      $("input[type='text']").val("");
      $("textarea").html("");

      if (!!$("#isOtherAdres").prop("checked")) {
        $("#isOtherAdres").trigger("click");
      }
      // myloc.deleteAllItem("adres");
      // myloc.deleteAllItem("fatura");
      $(".btn-save-to-pay").css({
        "pointer-events": "none",
        "background-color": "#dbdbdb",
        color: "#00000080",
      });
    });

    $(".fat-area input").on("keydown", function () {
      setTimeout(() => {
        const fatData = $(".fat-area").serializeJSON();
        const isEmpty = Object.values(fatData).some((ite) => !ite);
        if (isEmpty) {
          $(".btn-save-to-pay").css({
            "pointer-events": "none",
            "background-color": "#dbdbdb",
            color: "#00000080",
          });
        } else {
          $(".btn-save-to-pay").css({
            "pointer-events": "auto",
            "background-color": "",
            color: "",
          });
        }
      }, 10);
    });
    $(".fat-area textarea").on("keydown", function () {
      setTimeout(() => {
        const fatData = $(".fat-area").serializeJSON();
        const isEmpty = Object.values(fatData).some((ite) => !ite);
        if (isEmpty) {
          $(".btn-save-to-pay").css({
            "pointer-events": "none",
            "background-color": "#dbdbdb",
            color: "#00000080",
          });
        } else {
          $(".btn-save-to-pay").css({
            "pointer-events": "auto",
            "background-color": "",
            color: "",
          });
        }
      }, 10);
    });
  } else {
    window.location = "/";
  }
};
