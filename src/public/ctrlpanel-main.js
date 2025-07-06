import "./ctrlpanel-main.scss";
import "./jqform-serialize.js";
import "./owl.carousel.js";
import { DashboardInit,KategorilerInit,SlaytlarInit } from "./pages/ctrlpanel/main.js";

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
Handlebars.registerHelper("IsEq", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

$(async function () {
  let pathname = this.location.pathname;
  if (pathname == "/ctrlpanel") {
    DashboardInit();
  }else if(pathname.includes("/ctrlpanel/urunler")){
    KategorilerInit();
  }else if(pathname.includes("/ctrlpanel/slaytlar")){
    SlaytlarInit();
  }
   
});