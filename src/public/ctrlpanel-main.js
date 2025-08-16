import "./ctrlpanel-main.scss";
import "./jqform-serialize.js";
import "./owl.carousel.js";
import { AjaxPromise } from "./pages/auth/signin.js";
// import "./socket.js";
import { DashboardInit,KategorilerInit,SlaytlarInit,SiparislerInit,EticaretInit,RaporlarInit } from "./pages/ctrlpanel/main.js";

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
Handlebars.registerHelper("IsEq", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
const usrPnlArea = () => {
  $(".btn-user").on("click", function () {
    if ($(".usr-sm-pnl").css("display") === "none") {
      $(".usr-sm-pnl").css("display", "flex");
    } else {
      $(".usr-sm-pnl").css("display", "none");
    }
  });
  $(".allusrt").on("click", function (e) {
    e.stopPropagation();
  });
  $(".btn-signout").on("click", async function () {
    try {
      const resp = await AjaxPromise("post", "/signout", {});
      if (!!resp && resp.ok) {
        location.reload();
      }
    } catch ({ responseJSON }) {
      console.log("err", responseJSON);
      const { msg } = responseJSON;
      $(".err-txt").html(msg);
    }
  });
};
$(async function () {
  let pathname = this.location.pathname;
  if (pathname == "/ctrlpanel") {
    DashboardInit();
  }else if(pathname.includes("/ctrlpanel/urunler")){
    KategorilerInit();
  }else if(pathname.includes("/ctrlpanel/slaytlar")){
    SlaytlarInit();
  }else if(pathname.includes("/ctrlpanel/siparisler")){
    SiparislerInit();
  }else if(pathname.includes("/ctrlpanel/etic-siteler")){
    EticaretInit();
  }else if(pathname.includes("/ctrlpanel/rapor-")){
    RaporlarInit();
  }

usrPnlArea();
   
});