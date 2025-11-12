import { SepetBtn, SepetStatus } from "./util/main.js";
import { myloc } from "../main.js";
import { pad, OptimizePhoto, GetFileExt, Upload } from "./util/main.js";
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
  margin: 0,
  merge: false,
  // Responsive
  responsive: true,
  items: 1,
  itemsDesktop: [1199, 1],
  itemsDesktopSmall: [980, 1],
  itemsTablet: [768, 1],
  itemsMobile: [479, 1],
};
let settingsCaro2 = { ...settingsCaro1 };
settingsCaro2.slideSpeed = 600;
settingsCaro2.goToFirstSpeed = 1500;
settingsCaro2.paginationSpeed = 1400;
settingsCaro2.items = 5;

let settingsCaro3 = { ...settingsCaro1 };
settingsCaro3.items = 1;
let yorumlar = [];

const getTemps = async (folderpath) => {
  return await $.ajax({
    type: "POST",
    url: "/templates/get-temp",
    data: { folderpath: folderpath },
  });
};
const getYorumlar = async (urunid) => {
  let gelenStrYorumlar = await $.ajax({
    type: "POST",
    url: "/urun/get-yorumlar",
    data: { id: urunid },
    dataType: "json",
  });
  yorumlar = JSON.parse(!!gelenStrYorumlar ? gelenStrYorumlar : []);
  if (!!yorumlar && yorumlar.length > 0) {
    yorumlar = yorumlar.sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
  }
  const strHtml = await getTemps("yorum.hbs");
  const rend = Handlebars.compile(strHtml);
  $(".yorum-area").remove();
  $(".yorum-ack").prepend(
    rend({
      yorumlar: [
        ...yorumlar.map((item) => {
          let newItem = { ...item };
          const date = new Date(newItem.tarih);
          const tarih =
            pad(date.getDate(), 2) +
            "." +
            pad(date.getMonth() - 1, 2) +
            "." +
            date.getFullYear() +
            " " +
            pad(date.getHours(), 2) +
            ":" +
            pad(date.getMinutes(), 2);

          return { ...newItem, tarih: tarih };
        }),
      ],
    })
  );
};
const AltButonArea = () => {
  $("[ro]").css("color", "#4b5563");
  $("[ro='urun']").css("color", "blue");
  $("[ro='urun']").on("click", async function () {
    $("[ro]").css("color", "#4b5563");
    $("[ro='urun']").css("color", "blue");
    $(".urun-ack").css("display", "block");
    $(".garanti-ack").css("display", "none");
    $(".yorum-ack").css("display", "none");
  });
  $("[ro='garanti']").on("click", function () {
    $("[ro]").css("color", "#4b5563");
    $("[ro='garanti']").css("color", "blue");
    $(".urun-ack").css("display", "none");
    $(".garanti-ack").css("display", "block");
    $(".yorum-ack").css("display", "none");
  });
  $("[ro='yorum']").on("click", async function () {
    $("[ro]").css("color", "#4b5563");
    $("[ro='yorum']").css("color", "blue");
    $(".urun-ack").css("display", "none");
    $(".garanti-ack").css("display", "none");
    $(".yorum-ack").css("display", "block");
  });
};
const FavStatus1 = () => {
  let favs = myloc.getItem("favs");
  $(`.btn-fav1`).on("click", function () {});
  let favElParentId = $(`.btn-fav1`).attr("data-ur");
  let isFind = favs.some((item) => {
    return item == favElParentId;
  });

  if (isFind) {
    $(`.btn-fav1`)
      .html(`      <span class="tio text-[1.6rem] text-red-500">heart</span>
                        <span class="text-red-500">Favorilerimden Çıkar</span>`);
  } else {
    $(`.btn-fav1`)
      .html(`      <span class="tio text-[1.6rem] text-orange-500">heart_outlined</span>
                        <span class="text-orange-500">Favorilerime ekle</span>`);
  }

  favs = myloc.getItem("favs");
  myloc.favIndex = favs.length;
};
const makeSeeProd = async (id) => {
  let items = myloc.getItem("seeprod");
  const goruntulenme = parseInt($(".goruntulenme").attr("data-say"));
  let isFind =
    !!items && items.length > 0 ? items.find((a) => a.id == id) : false;
  if (!isFind) {
    let data = { id, goruntulenme: goruntulenme + 1 };
    await $.ajax({
      type: "POST",
      url: "/urun/update-urun-goruntu",
      data: { ...data },
      dataType: "json",
    });
    myloc.setItem("seeprod", { id: id });
  }
};
export const UrunInit = async () => {
  urunId = $("[ro='yorum']").attr("data-ur");

  $(".caro3.owl-carousel").owlCarousel(settingsCaro1);
  AltButonArea();

  $(".btn-fav1").on("click", function (ev) {
    ev.stopPropagation();
    let selectId = $(this).attr("data-ur");
    let favs = myloc.getItem("favs");
    let isFind = favs.some((item) => item == selectId);
    if (isFind) {
      myloc.deleteItem("favs", selectId);
    } else {
      myloc.setItem("favs", selectId);
    }
    FavStatus1();
  });
  FavStatus1();

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

  $(".btn-yrm-yapp").on("click", async function (e) {
    e.preventDefault();
    $(".yrmfrma-area").show();
    $("body").css("overflow-y", "hidden");
    $("#resimler").val("");
    $(".resim-list").html("");
  });
  $(".btn-yrmyapp-close").on("click", async function (e) {
    e.preventDefault();
    $(".yrmfrma-area").hide();
    $("body").css("overflow-y", "auto");
    let urunid = $(this).attr("data-ur");
    let yorumlgnt = parseInt($(this).attr("data-yrmlnghth")) + 1;
    const result = await $.ajax({
      type: "POST",
      url: "/stat/folderdelete",
      data: { folderpath: `/uploads/yorumphoto/${urunid}/${yorumlgnt}/` },
      dataType: "json",
    });
  });
  $(".stars button").on("click", function (e) {
    e.preventDefault();
    let oran = $(this).attr("data-ur");
    for (let index = 1; index <= 5; index++) {
      if (parseInt(oran) >= index) {
        $(`.stars button[data-ur=${index}]`)
          .removeClass("text-gray-500")
          .addClass("text-orange-500");
      } else {
        $(`.stars button[data-ur=${index}]`)
          .addClass("text-gray-500")
          .removeClass("text-orange-500");
      }
    }
    $("[name='oran'").val(oran);
  });
  $(".btn-yrm-gondeer").on("click", async function (e) {
    e.preventDefault();
    $(".spinrea1").show();
    let formData = $(".yrmform").serializeJSON();
    formData["resimler"] = !!formData["resimler"] ? JSON.parse(formData["resimler"]) : '';
    let urunid = $(this).attr("data-ur");
    let gelenStrYorumlar = await $.ajax({
      type: "POST",
      url: "/urun/get-yorumlar",
      data: { id: urunid },
      dataType: "json",
    });
    yorumlar = JSON.parse(!!gelenStrYorumlar ? gelenStrYorumlar : []);
    if (!!yorumlar && yorumlar.length > 0) {
      yorumlar = yorumlar.sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
    }
    // $(".spinrea1").show();
    await $.ajax({
      type: "POST",
      url: "/urun/update-urun",
      data: {
        id: urunid,
        yorumlar: JSON.stringify([
          ...yorumlar,
          { ...formData, tarih: new Date().getTime(),dogru_kullan:$(".mstsig").length > 0 },
        ]),
      },
      dataType: "json",
    });
    setTimeout(() => {
      location.href = location.href;
      $(".spinrea1").hide();
    }, 1000);
  });
  $(".btn-res-sec").on("click", function (e) {
    e.preventDefault();
    $("#resimler").val("");
    $("#resimler").trigger("click");
    $(".btn-res-sec").show();
  });
  $("#resimler").on("change", async function () {
    $(".spinrea").show();
    // $(".btn-res-sec").hide();
    let urunid = $(this).attr("data-ur");
    let yorumlgnt = parseInt($(this).attr("data-yrmlnghth")) + 1;
    let files = $(this).get(0).files;
    let fileurls = [];
    $(".resim-list").html("");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileext = GetFileExt(file.name);
      let filepurename = file.name.replace(`.${fileext}`, "");
      fileurls.push(`/uploads/yorumphoto/${urunid}/${yorumlgnt}/${file.name}`);
      let img = await OptimizePhoto(file, 450, 0.9);
      const upld = new Upload(img);
      upld.doUpload(
        `/uploads/yorumphoto/${urunid}/${yorumlgnt}`,
        filepurename,
        (data) => {
          let imgTagHtml = `<img src="/uploads/yorumphoto/${urunid}/${yorumlgnt}/${file.name}" class="w-[100px] h-[100px] object-cover">`;
          $(".resim-list").append(imgTagHtml);
        }
      );
      $("[name='resimler']").val(JSON.stringify(fileurls));
    }
    setTimeout(() => {
      $(".spinrea").hide();
    }, 2000);
  });

  $(".popsinglimgbtn").on("click", function (e) {
    e.preventDefault();
    $(".popsinglimg").show();
  });
  $(".popsinglimg button").on("click", function (e) {
    e.preventDefault();
    $(".popsinglimg").hide();
  });

  $(".resim-list").on("click", function (e) {
    e.preventDefault();
    // $(".photocar .owl-carousel").trigger('remove.owl.carousel', 0);
    // $(".photocar .owl-carousel.owl-theme").html("");
     $(".photocar .owl-carousel.owl-theme").remove();
    $(".photocar .tlear").html(`<div class="owl-carousel owl-theme"></div>`);
    // let resim
    $.each($(".resim-list img"), (index, el) => {
      console.log(el);
      let url = $(el).attr("src");
      console.log(url);
      $(".photocar .owl-carousel.owl-theme").append(`
    <div class="h-[90vh] ">
                    <img src="${url}" class="h-full w-full object-contain " alt="">
                </div>`);
    });
    $(".photocar .owl-carousel").owlCarousel(settingsCaro3);
    $(".photocar").show();
  });
  $(".urunyrmpic").on("click", function (e) {
    e.preventDefault();

    $(".photocar .owl-carousel.owl-theme").remove();
    $(".photocar .tlear").html(`<div class="owl-carousel owl-theme"></div>`);
    // let resim
    $.each($(".urun_ytrm_resim img"), (index, el) => {
      let url = $(el).attr("src");
      $(".photocar .owl-carousel.owl-theme").append(`
        <div>
    <div class="h-[90vh] ">
                    <img src="${url}" class="h-full w-full object-contain " alt="">
                </div>`);
    });
    $(".photocar .owl-carousel").owlCarousel(settingsCaro3);
    $(".photocar").show();
  });
  $(".popcorbtncls").on("click", function (e) {
    e.preventDefault();
    $(".photocar").hide();
  
  });
  // $(".photocar .owl-carousel").owlCarousel(settingsCaro3);
  await makeSeeProd(urunId);
  // await getYorumlar(urunId);
};
