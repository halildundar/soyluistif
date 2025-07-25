import { FavsBtn, FavStatus, SepetBtn, SepetStatus } from "./util/main.js";
const settingsCaro1 = {
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
let settingsCaro2 = { ...settingsCaro1 };
settingsCaro2.slideSpeed = 600;
settingsCaro2.goToFirstSpeed = 1500;
settingsCaro2.paginationSpeed = 1400;
// settingsCaro2.items = 5;
let settingsCaroBig = { ...settingsCaro1 };
settingsCaroBig.items = 1;
let settingsCaroSma = { ...settingsCaro1 };
settingsCaroSma.items = 1;
export const HomeInit = () => {
  $(".caroBig.owl-carousel").owlCarousel(settingsCaroBig);
  $(".caroSma.owl-carousel").owlCarousel(settingsCaroSma);
  $(".caro1.owl-carousel").owlCarousel(settingsCaro1);
  $(".caro2.owl-carousel").owlCarousel(settingsCaro2);
  // makeMenuItems();

  $(".owl-carousel a").on("click", function () {
    location.href = $(this).attr("route");
  });
  $(".cok-satan a").on("click", function () {
    location.href = $(this).attr("route");
  });
  $(".btn-fav").on("click", function (ev) {
    ev.stopPropagation();
    FavsBtn(this);
  });
  FavStatus();

  $(".btn-subsepet").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = $(`.in-adetsepet[data-ur='${id}']`).val();
    let res = Number(adetVal) - 1;
    if (res <= 0) {
      res = 1;
    }
    $(`.in-adetsepet[data-ur='${id}']`).val(res);
  });
  $(".btn-addsepet").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = $(`.in-adetsepet[data-ur='${id}']`).val();
    let res = Number(adetVal) + 1;
    $(`.in-adetsepet[data-ur='${id}']`).val(res);
  });
  $(".btn-sepete-ekle").on("click", function (e) {
    e.stopPropagation();
    const id = $(this).attr("data-ur");
    let adetVal = Number($(`.in-adetsepet[data-ur='${id}']`).val());
    SepetBtn(this, adetVal);
  });
  SepetStatus();
};
