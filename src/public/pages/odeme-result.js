import { myloc } from "../main.js";
import { SepetStatus,SiparisStatus } from "./util/main.js";
export const OdemeResultInit = async () => {
  console.log("İnclude");
  if (!!$(".sip-kod span").html()) {
    let siparisId = $(".sip-kod span").html();
    // $.ajax({
    //   type: "POST",
    //   url: "/siparis/get",
    //   data: { siparisId: siparisId },
    //   dataType: "json",
    // });
    if (!!siparisId) {
      myloc.setAllItem("sepet", []);
      myloc.setItem("siparis", {id:siparisId});
      SepetStatus();
        SiparisStatus();
    }
  } else {
    let index = 5;
    let time = setInterval(() => {
      if (index <= 0) {
        $(".inde").html(0);
      } else {
        $(".inde").html(index);
      }

      index -= 1;
      if (index == -2) {
        window.location = "/odeme";
        clearInterval(time);
      }
    }, 1000);
  }
};
