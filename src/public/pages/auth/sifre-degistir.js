const Validator = () => {
  let formData = $("form").serializeJSON();
  if (!formData.newpassw1) {
    $(".errtxt").html("Şifre alanı boş olamaz");
    return false;
  } else if (!formData.newpassw2) {
    $(".errtxt").html("Şifre alanı boş olamaz");
    return false;
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
export const SendSifreDegistirInit = () => {
  const params = new URL(location.href).searchParams;
  const urn = params.get("urn");
  const cdn = params.get("cdn");
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
      passw1 = $("#newpassw1").val();
      passw2 = $("#newpassw2").val();
      if (passw1 == passw2) {
        let isOk = passw1.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
      } else {
        // console.log("Şifreler Eşit Değil");
      }
    }, 200);
  });

  $(".btn-gonder").on("click", async function (e) {
    e.preventDefault();
    $(".spnarea").css("display", "flex");
    if (Validator()) {
      let formData = $("form").serializeJSON();
      const resp = await $.ajax({
        type: "POST",
        url: "/cust/chngepassw",
        data: { newpassw1: formData.newpassw1,urn:urn,cdn:cdn  },
        dataType: "json",
      });
      $(".onaymsg").css("display", "flex");
      if (!!resp.status) {
        $(".onaymsg").css("display", "flex");
      }else{
         $(".onaymsg").html(`<div class="text-center text-orange-600 text-[1.4rem] py-2 font-bold">
                ${resp.msg}
            </div>`)
      }
    }

    $(".spnarea").css("display", "none");
  });
};
