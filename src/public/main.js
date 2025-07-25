import "./main.scss";
import "./jqform-serialize.js";
import "./owl.carousel.js";
import { TopBtnAndScrollPosInit } from "./pages/util/main.js";
import { HomeInit } from "./pages/home.js";
import { UrunInit } from "./pages/urun.js";
import { KategoriInit } from "./pages/kategori.js";
import { LocalData } from "./pages/util/main.js";
import { SepetInit } from "./pages/sepet.js";
import { SiparisBilgiInit } from "./pages/siparis-bilgi.js";
import { SiparisInit } from "./pages/siparis.js";
import { OdemeInit } from "./pages/odeme.js";
import { OdemeResultInit } from "./pages/odeme-result.js";
import { FavorilerInit } from "./pages/favoriler.js";

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
  } else if (pathname.includes("/odeme")) {
    OdemeInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname.includes("/siparis-bilgi")) {
    SiparisBilgiInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname.includes("/iyz/3ds-pay")) {
    OdemeResultInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname == "/siparis") {
    SiparisInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else if (pathname == "/favori") {
    FavorilerInit();
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  } else {
    $("body").css("overflow", "auto");
    $(".all-spinn").css("display", "none");
  }
  makeMenuItems();
  SearchHeaderItems();
  Goruntulenenler();
  InitMobilTree();
});
const Goruntulenenler = async () => {
  const settingsCaroson = {
    //Basic Speeds
    slideSpeed: 200,
    paginationSpeed: 800,
    //Autoplay
    autoPlay: true,
    goToFirst: true,
    goToFirstSpeed: 1000,
    // Navigation
    navigation: true,
    navigationText: [
      "<i class='tio'>arrow_backward</i>",
      "<i class='tio'>arrow_forward</i>",
    ],
    pagination: false,
    paginationNumbers: false,
    autoHeight: false,
    // Responsive
    responsive: true,
    items: 6,
    itemsDesktop: [1199, 4],
    itemsDesktopSmall: [980, 3],
    itemsTablet: [768, 2],
    itemsMobile: [479, 1],
  };
  let ids = myloc.getItem("seeprod");
  if (!!ids && ids.length > 0) {
    ids = ids.map((item) => item.id);
    const rsult = await $.ajax({
      type: "POST",
      url: "/urun/get-urunlerforgorlen",
      data: { ids: ids },
      dataType: "json",
    });

    $(".caro-son").html(`
      <div class="owl-carousel owl-theme"></div>
    `);
    $(".caro-son .owl-carousel.owl-theme").css({
      display: "block",
      opacity: 1,
    });
    let urunlet = rsult.map((item) => {
      let resimler = !!item.resimler ? JSON.parse(item.resimler) : null;
      return {
        ...item,
        resimler: resimler,
        adet: 1,
        img_on:
          !!resimler && resimler.length > 0
            ? "/uploads" + resimler[0]
            : "/assets/urun/resim_yok.webp",
        img_arka:
          !!resimler && resimler.length > 1
            ? "/uploads" + resimler[1]
            : "/assets/urun/resim_yok.webp",
      };
    });
    for (let i = 0; i < urunlet.length; i++) {
      let urun = urunlet[i];
      $(".caro-son .owl-carousel.owl-theme").append(`
       <a class="pr-2  cursor-pointer relative block z-0" route="/urun/${urun.url}" data-ur="${urun.id}">
        <div
          class="btn-fav z-10 absolute top-4 right-5  text-[2rem] tio text-orange-500 hover:text-orange-700 duration-200">
          heart_outlined</div>
        <div class=" border border-gray-300 rounded-lg overflow-hidden pb-2">
          <div class="group h-[200px] overflow-hidden ">
            <img src="${urun.img_on}" class="group-hover:hidden w-full h-full" alt="">
            <img src="${urun.img_arka}" class="hidden group-hover:block w-full h-full" alt="">
          </div>
          <div class="py-2">
            <div class="title text-[--koyu-dark] text-[0.8rem] text-center font-bold px-5 line-clamp-1">
             ${urun.name}
            </div>
          </div>
          <div class="py-2">
            <div class="urun-kod text-center text-[0.8rem]">${urun.kod}</div>
            <div class="stok text-[--koyu] text-[0.8rem] text-center"><strong>Stok:</strong>${urun.kalan_stok} adet
            </div>
          </div>
          <div class="flex items-center w-1/2 mx-auto space-x-3">
            <div class="bg-[red] text-white text-[0.8rem] p-2 flex items-center justify-center rounded-md font-bold">
              %${urun.indirim}
            </div>
            <div>
              <div class="line-through text-[0.8rem] text-[--koyu]">${urun.fiyat}.00₺</div>
              <div class="text-[1rem] leading-tight"><strong>${urun.indirimli_fiyat}.00₺</strong>
              </div>
            </div>
          </div>
          <div class="btn-sepet-area py-2 flex items-center flex-col justify-center" data-ur="${urun.id}">
            <div class="inline-flex border border-gray-200">
              <div data-ur="${urun.id}"
                class="btn-subsepet tio text-[1rem] p-2   font-bold bg-gray-200 select-none cursor-pointer hover:bg-gray-300">
                remove</div>
              <input type="number" data-ur="${urun.id}"
                class="in-adetsepet text-[0.9rem] w-[50px] border-r border-l border-gray-200 text-center" value="1">
              <div data-ur="${urun.id}"
                class="btn-addsepet tio text-[1rem] p-2 font-bold bg-gray-200 select-none cursor-pointer hover:bg-gray-300">
                add</div>
            </div>
            <div class="flex items-center justify-center py-2">
              <button data-ur="${urun.id}"
                class="btn-sepete-ekle px-2 py-1 text-white bg-blue-900  font-bold hover:bg-blue-950 active:bg-blue-700 rounded-md flex items-center space-x-2">
                <i class="tio text-[1rem]">shopping_cart_add</i>
                <div class="text-[0.9rem]"> <span>Sepete ekle</span></div>
              </button>
            </div>
          </div>
        </div>
      </a>
      `);
    }

    $(".caro-son .owl-carousel").owlCarousel(settingsCaroson);
  }
};
const SearchHeaderItems = () => {
  $(".btn-srch").on("click", function () {
    let searchLink =
      $("#srch-kat-sel").val() + "?search=" + $(".intxt-sserch").val().trim();
    window.location = searchLink;
  });
};
const getMenuList = async (id, parent_length) => {
  return $.ajax({
    type: "POST",
    url: "/get-menu",
    data: { id: id, parent_length: parent_length },
    dataType: "json",
  });
};

export const makeMenuItems = () => {
  function initMenuEvent() {
    $("a[href*='/kategori/']").on("mouseenter", async function () {
      $(this).off("mouseenter");
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
          $("a[href*='/kategori/']").off("mouseenter");
          initMenuEvent();
        });
      }
      $(`[data-index="2"]`).off("mouseenter");
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
          $(this).off("mouseleave");
          $(this).on("mouseleave", async function () {
            $(".indexMenu2").remove();
          });
        }
      });
    });
  }
  initMenuEvent();
};

let kategoriler;
let selectedKategori;
const GetKategoriler = async () => {
  kategoriler = await GetAllKategoriler();
  kategoriler = kategoriler.map((item) => {
    if (!!item.parents) {
      item.parents = JSON.parse(item.parents);
    } else {
      item.parents = [];
    }
    return item;
  });
};
const GetAllKategoriler = async () => {
  return await $.ajax({
    type: "POST",
    url: "/ctrlpanel/kategori/get-all-items",
    data: {},
    dataType: "json",
  });
};
function getSubKateg(parentid, length) {
  const filteredItem =
    parentid == 0
      ? (item) => item.parents.length == length
      : (item) =>
          item.parents.length == length && item.parents[length - 1] == parentid;
  return kategoriler.filter(filteredItem);
}
function getMakeSubKat(kateg, id) {
  let subkateg = getSubKateg(kateg.id, kateg.parents.length);
  if (id != 0) {
    subkateg = getSubKateg(kateg.id, kateg.parents.length + 1);
  }

  for (let j = 0; j < subkateg.length; j++) {
    const sub = subkateg[j];
    let subsubkateg = getSubKateg(sub.id, sub.parents.length + 1);
    $(`.sublink[data-pur='${id}']`).append(`<div class="link"  data-ur="${
      sub.id
    }">
             <div class=" flex items-center space-x-1 pb-2 ">
               <span class="select-none tio text-[1.8rem] cursor-default text-gray-600">chevron_right</span>
                <a route="${
                  sub.url
                }" class="kateglin cursor-pointer select-none leading-none block flex-1 py-0.5 px-1 text-gray-700 hover:text-red-400">${
      sub.name
    } <i class="font-semibold text-red-400 !text-[1rem]">${
      subsubkateg.length == 0 ? "" : `( ${subsubkateg.length} )`
    }</i></a>
             
             </div>
              <div class="sublink" data-pur="${sub.id}" style="padding-left:${
      8 * (kateg.parents.length + 1)
    }px"></div>
            </div>
            `);
    $(`.link[data-ur='${sub.id}'] span`).on("click", function () {
      const txtStr = $(this).html();
      if (txtStr == "chevron_right") {
        getMakeSubKat(sub, sub.id);
        $(this).html("chevron_down");
      } else {
        $(this).html("chevron_right");
        $(`.sublink[data-pur='${sub.id}']`).html("");
      }
    });
    $(`.link[data-ur='${sub.id}'] a`).on("click", function () {
      $(".kateglin").css("color", "black");
      $(this).css("color", "red");
      $(".sel-area").css("display", "block");
      $("[name='kategori-edit']").val(sub.name);
      $(".eklelbl").html("Alt Kategori Ekle");
      IsSelectKategori(sub, kategoriler);
      selectedKategori = sub;
      window.location = sub.url;
    });
  }
}
const IsSelectKategori = async (kategori, kate) => {
  selectedKategori = kategori;
  kategoriler = kate;
  $(`.btn-urun-temizle`).trigger("click");
  if (!selectedKategori) {
    $(".urun-area .kat-sec").css("display", "block");
    $(".urun-area table").css("display", "none");
    $(".bread-area").html("");
    $(".btn-area-urun").css("display", "none");
  } else {
    $(".urun-area .kat-sec").css("display", "none");
    $(".btn-area-urun").css("display", "block");
    if (!!selectedKategori.parents) {
      parents = [...selectedKategori.parents, selectedKategori.id];
    } else {
      parents = [selectedKategori.id];
    }
  }
};

const InitMobilTree = async () => {

  $('.btn-srcee ').on('click',function(){
    window.location = '/kategori/all?search=' + $('.intt-serc ').val()
  })
  $(".btn-men-clos").on("click", function () {
    $(".mob-sde-mn").animate({
      width: "0",
      overflow:"hidden",
      opacity:0
    },200);
      $('body').css({overflow:'auto'});

  });
  console.log($(".mob-sid-men-op")[0])
  $(".mob-sid-men-op").on("click", function () {
      $('body').css({overflow:'hidden'});

    $(".mob-sde-mn").animate({
      width: "100vw",
      opacity:1
    },200);
  });
  await GetKategoriler();
  // let TopKateogirler = getSubKateg(0, kategoriler.length);
  $(".kategori1-area .sublink[data-pur='0']").html("");
  getMakeSubKat({ id: 0, parents: [] }, 0);
};
