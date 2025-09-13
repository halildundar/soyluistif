import { myloc } from "../../main.js";
const Validator = () => {
  let formData = $("form").serializeJSON();
  if (!formData.name) {
    $(".errtxt").html("Ad alanı boş olamaz!");
    return false;
  } else if (!formData.surname) {
    $(".errtxt").html("Soyad alanı boş olamaz!");
    return false;
  } else if (!formData.email) {
    $(".errtxt").html("Email alanı boş olamaz");
    return false;
  } else if (!formData.telefon) {
    $(".errtxt").html("Telefon alanı boş olamaz");
    return false;
  } else if (!formData.newpassw1) {
    $(".errtxt").html("Şifre alanı boş olamaz");
    return false;
  } else if (!formData.newpassw2) {
    $(".errtxt").html("Şifre alanı boş olamaz");
    return false;
  }
  if (!!formData.email) {
    let emailCheck = formData.email.match(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,}$/
    );
    if (!emailCheck) {
      $(".errtxt").html("Email doğru formatta giriniz");
      return false;
    }
  }
  if (!!formData.newpassw1 && !!formData.newpassw2) {
    if (formData.newpassw1 != formData.newpassw2) {
      $(".errtxt").html("Şifreler Uyuşmuyor");
      return false;
    }
    let passwCheck = formData.newpassw1.match(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    );
    if (!passwCheck) {
      $(".errtxt").html("En az 6 karakter, en az bir harf ve bir rakam olmalı");
      return false;
    }
  }
  $(".errtxt").html("");
  return true;
};
export const UyeOlInit = () => {
  console.log("Üye ol init");

  $(".btn-pass-sea-toggle").on("click", function (e) {
    e.preventDefault();
    if ($(this).html() == "password") {
      $(this).html("password_open");
      $(this).css("color", "green");
      $(`#${$(this).attr("data-cls")}`).attr("type", "text");
    } else {
      $(this).html("password");
      $(this).css("color", "#6b7280");
      $(`#${$(this).attr("data-cls")}`).attr("type", "password");
    }
  });
  let timer;
  $(".pasw").on("keydown", function () {
    let passw1 = "";
    let passw2 = "";
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log($("#newpassw1").val(), $("#newpassw2").val());
      passw1 = $("#newpassw1").val();
      passw2 = $("#newpassw2").val();
      if (passw1 == passw2) {
        let isOk = passw1.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        console.log(
          "Minimum eight characters, at least one letter and one number:",
          isOk
        );
      } else {
        console.log("Şifreler Eşit Değil");
      }
    }, 200);
  });

  $(".btn-uyeol").on("click", async function (e) {
    e.preventDefault();
    $(".spnarea").css("display", "flex");
    if (Validator()) {
      console.log($("form").serializeJSON());
      const resp = await $.ajax({
        type: "POST",
        url: "/uye-ol",
        data: {...$("form").serializeJSON()},
        dataType: "json"
      });
      console.log(resp);
      if(resp.status){
        
      }
      $('.onaymsg').css('display','flex');
    }

    $(".spnarea").css("display", "none");
  });
};
