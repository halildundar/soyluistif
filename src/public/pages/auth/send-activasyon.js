const Validator = () => {
  let formData = $("form").serializeJSON();
  if (!formData.email) {
    $(".errtxt").html("email alanı boş olamaz!");
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
  $(".errtxt").html("");
  return true;
};
export const SendAktivasyonInit = () => {

  $(".btn-gonder").on("click", async function () {
    $(".spnarea").css("display", "flex");
    if (Validator()) {
      let formData = $("form").serializeJSON();
      const resp = await $.ajax({
        type: "POST",
        url: "/cust/chngepasswactiv",
        data: formData,
        dataType: "json",
      });
      $(".onaymsg").css("display", "flex");
      if (!!resp.status) {
        $(".onaymsg").css("display", "flex");
      } else {
        $(".onaymsg")
          .html(`<div class="text-center text-red-600 text-[1rem] py-2 font-bold itelic">
                ${resp.msg}
            </div>`);
      }
    }
    $(".spnarea").css("display", "none");
  });
};
