import "./main.scss";
import "./jqform-serialize.js";
import "./owl.carousel.js";
import { TopBtnAndScrollPosInit } from "./pages/util/main.js";
import { HomeInit } from "./pages/home.js";
import { UrunInit } from "./pages/urun.js";
import { KategoriInit } from "./pages/kategori.js";
import { LocalData } from "./pages/util/main.js";
import { SepetInit } from "./pages/sepet.js";
export let myloc;
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
  myloc = new LocalData();
  let pathname = this.location.pathname;
  TopBtnAndScrollPosInit();
  if (pathname == "/") {
    // for (var i = 1; i < 99; i++) {
    //   window.clearInterval(i);
    // }
    HomeInit();
    setTimeout(() => {
      $("body").css("overflow", "auto");
      $(".all-spinn").css("display", "none");
    }, 500);
  } else if (pathname.includes("/urun/")) {
    UrunInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname.includes("/kategori/")) {
    KategoriInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname.includes("/sepet")) {
    SepetInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else {
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  }
  makeMenuItems();
});
const getMenuList = async (id, parent_length) => {
  return $.ajax({
    type: "POST",
    url: "/get-menu",
    data: { id: id, parent_length: parent_length },
    dataType: "json",
  });
};
export const makeMenuItems = () => {
  $("a[href*='/kategori/']").on("mouseenter", async function () {
    const alt_menus = await getMenuList(
      $(this).attr("data-id"),
      $(this).attr("data-index")
    );
    let str = `<div class="indexMenu1 absolute top-full left-0 w-[300px] h-auto shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] rounded-md flex flex-col bg-white z-[50]">`;
    for (let i = 0; i < alt_menus.length; i++) {
      const menu = alt_menus[i];
      str += `
        <a href="${menu.url}" data-id="${menu.id}" data-index="2" class="text-[0.8rem] font-semibold block w-full hover:bg-black/10 duration-300 text-black px-3 py-2 relative">
${menu.name}
        </a>
        `;
    }
    str += "</div>";
    if (alt_menus.length > 0) {
      $(this).append(str);
      $(this).on("mouseleave", async function () {
        $(".indexMenu1").remove();
      });
    }
    $(`[data-index="2"]`).on("mouseenter", async function () {
      const alt_menus = await getMenuList(
        $(this).attr("data-id"),
        $(this).attr("data-index")
      );
      let str = `<div class="indexMenu2 absolute top-0 left-full w-[300px] h-auto shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] rounded-md flex flex-col bg-white z-[50]">`;
      for (let i = 0; i < alt_menus.length; i++) {
        const menu = alt_menus[i];
        str += `
        <a href="${menu.url}" data-id="${menu.id}" data-index="2" class="text-[0.8rem] font-semibold block w-full hover:bg-black/10 duration-300 text-black px-3 py-2 relative">
${menu.name}
        </a>`;
      }
      str += "</div>";
      if (alt_menus.length > 0) {
        $(this).append(str);
        $(this).on("mouseleave", async function () {
          $(".indexMenu2").remove();
        });
      }
    });
  });
};


