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
const Validator = (formData, classname) => {
  for (let i = 0; i < Object.keys(formData).length; i++) {
    const key = Object.keys(formData)[i];
    // console.log(key,!!$(`.${classname} [name='${key}']`).attr('required'));
    if (!formData[key] && !!$(`.${classname} [name='${key}']`).attr('required')) {
      $(`.errtxt`).html(
        $(`.${classname} [name='${key}']`).prev().text() + " alanı boş olamaz!"
      );
      return false;
    } else if(!!$(`.${classname} [name='${key}']`).attr('required')) {
       console.log(key,!!$(`.${classname} [name='${key}']`).attr('required'));
      if (key == "email") {
        let emailCheck = formData[key].match(
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$/
        );
        if (!emailCheck) {
          $(`.errtxt`).html("Email doğru formatta giriniz");
          return false;
        }
      } else if (key == "passw") {
        let passwCheck = formData[key].match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        );
        if (!passwCheck) {
          $(`.${classname} .errtxt`).html(
            "En az 6 karakter, en az bir harf ve bir rakam olmalı"
          );
          return false;
        }
      } else if (key == "telefon") {
        let telefonCheck = formData[key].match(
          /^\+90\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/
        );
        if (!telefonCheck) {
          $(`.errtxt`).html(
            "+90 XXX XXX XXXX,+90XXXXXXXXXX telefon alanına şeklinde giriş sağlayın"
          );
          return false;
        }
      } else if (key == "tc") {
        let tcnoCheck = formData[key].match(/^\d{11}$/);
        if (!tcnoCheck) {
          $(`.errtxt`).html(
            $(`.${classname} [name='${key}']`).prev().text() +
              " 11 Haneli olmalı rakam"
          );
          return false;
        }
      } else if (key == "vergi_no") {
        let verginoCheck = formData[key].match(/^\d{10}$/);
        if (!verginoCheck) {
          $(`.${classname} .errtxt`).html(
            $(`.${classname} [name='${key}']`).prev().text() +
              " 10 Haneli olmalı rakam"
          );
          return false;
        }
      }
    }
  }

  $(`.errtxt`).html("");
  return true;
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
      // myloc.setAllItem("adres",  $("#isOtherAdres").prop('checked') ? adresData : faturaData);
      let adres = {
        fatura: faturaData,
        kargo: adresData,
      };
      console.log(adres);
      const res = Validator(adres.fatura,'fat-area');
      console.log(res);
      if(res){
        myloc.setAllItem("adres",  $("#isOtherAdres").prop('checked') ? adresData : faturaData);
        window.location = "/odeme";
      }
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
