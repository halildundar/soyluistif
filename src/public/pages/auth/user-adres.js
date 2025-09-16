import { myloc } from "../../main.js";
import { AdresAlanInit, SetAdresData } from "../../util/adres.js";
const Validator = (selector) => {
  let formData = $(`${selector} form`).serializeJSON();
  if (!formData.isim) {
    $(`${selector} .errtxt`).html("Ad alanı boş olamaz!");
    return false;
  } else if (!formData.soyisim) {
    $(`${selector} .errtxt`).html("Soyad alanı boş olamaz!");
    return false;
  } else if (!formData.tc) {
    $(`${selector} .errtxt`).html("TC alanı boş olamaz");
    return false;
  } else if (!formData.telefon) {
    $(`${selector} .errtxt`).html("Telefon alanı boş olamaz");
    return false;
  } else if (!formData.email) {
    $(`${selector} .errtxt`).html("Email alanı boş olamaz");
    return false;
  } else if (!formData.adres) {
    $(`${selector} .errtxt`).html("Adres alanı boş olamaz");
    return false;
  }
  if (!!formData.email) {
    let emailCheck = formData.email.match(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$/
    );
    if (!emailCheck) {
      $(`${selector} .errtxt`).html("Email doğru formatta giriniz");
      return false;
    }
  }
  if (!!formData.tc) {
    let tcCheck = formData.tc.match(/^[0-9]{11,11}$/);
    if (!tcCheck) {
      $(`${selector} .errtxt`).html("TC 11 haneli numara olmalı");
      return false;
    }
  }
  if (!!formData.tc) {
    let telefonCheck = formData.telefon.match(/^\+90\d{10}\s?$/);
    if (!telefonCheck) {
      $(`${selector} .errtxt`).html(
        "Telefonu +90XXXXXXXXXX haneli numara olmalı"
      );
      return false;
    }
  }
  $(`${selector} .errtxt`).html("");
  return true;
};
export const UserAdresInit = async () => {
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

  $(".btn-save-adresdata").on("click", async function (e) {
    e.preventDefault();
    $(".spnarea").css("display", "flex");
    let fatFormData = $(".fat-area form").serializeJSON();
    let karFormData = $(".kar-area form").serializeJSON();
    let adres = {
      fatura: null,
      kargo: null,
    };
    if (!!Validator(".fat-area")) {
      adres.fatura = fatFormData;
    }
    if (!!karFormData.isim && !!Validator(".kar-area")) {
      adres.kargo = karFormData;
    }
    if (!!Validator(".fat-area") && !karFormData.isim) {
      const repupdare = await $.ajax({
        type: "POST",
        url: "/cust/update-useradres",
        data: { adres: adres },
        dataType: "json",
      });
      location.href = location.href;
    }
    if (
      !!Validator(".fat-area") &&
      !!karFormData.isim &&
      Validator(".kar-area")
    ) {
      const repupdare = await $.ajax({
        type: "POST",
        url: "/cust/update-useradres",
        data: { adres: adres },
        dataType: "json",
      });
        location.href = location.href;
    }

    $(".spnarea").css("display", "none");
  });
  $(".fat-area .btn-copy-data").on("click", function () {
    let fatAdresData = $(".fat-area form").serializeJSON();
    $(`.kar-area [name='isim']`).val(fatAdresData.isim);
    $(`.kar-area [name='soyisim']`).val(fatAdresData.soyisim);
    $(`.kar-area [name='tc']`).val(fatAdresData.tc);
    $(`.kar-area [name='telefon']`).val(fatAdresData.telefon);
    $(`.kar-area [name='email']`).val(fatAdresData.email);

    SetAdresData(
      fatAdresData.il_id,
      fatAdresData.ilce_id,
      fatAdresData.mahalle_id,
      ".kar-area"
    );
    $(`.kar-area [name='adres']`).val(fatAdresData.adres);
    $(`.kar-area [name='aciklama']`).val(fatAdresData.aciklama);
  });
};
