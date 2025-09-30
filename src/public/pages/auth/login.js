import { myloc } from "../../main.js";
const Validator = (formData) => {
  if (!formData.email) {
    $(".errtxt").html("Email alanı boş olamaz!");
    return false;
  } else if (!formData.passw) {
    $(".errtxt").html("Şifre Alanı boş olamaz");
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
  if (!!formData.passw) {
    let passwCheck = formData.passw.match(
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
export const LoginInit = () => {

  $(".btn-pass-sea-toggle").on("click", async function (e) {
    e.preventDefault();
    if ($(this).html() == "password") {
      $(this).html("password_open");
      $(this).css("color", "green");
      $("[name='passw']").attr("type", "text");
    } else {
      $(this).html("password");
      $(this).css("color", "#6b7280");
      $("[name='passw']").attr("type", "password");
    }
  });
  $(".btn-giris").on("click", async function (e) {
    e.preventDefault();
    let formData = $("form").serializeJSON();
    const isValid = Validator(formData);
    if (isValid) {
      const formData = $("form").serializeJSON();
      try {
        const respp = await $.ajax({
        type: "POST",
        url: "/login",
        data: { ...formData },
        dataType: "json",
      });
      location.href = '/';
       $('.errtxt').html("");
      } catch ({responseJSON}) {
        const {msg} = responseJSON;
        $('.errtxt').html(msg);
      }
    }
  });
};
