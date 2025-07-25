import { SepetBtn, SepetStatus } from "./util/main.js";
import { myloc } from "../main.js";
import { pad } from "../util/fncs.js";
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
    await getYorumlar($(this).attr("data-ur"));
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
  const goruntulenme = parseInt($(".goruntulenme").attr('data-say'));
  let isFind = !!items && items.length > 0 ? items.find((a) => a.id == id) : false;
  if (!isFind) {
    let data = { id,  goruntulenme: goruntulenme + 1 };
    await $.ajax({
      type: "POST",
      url: "/urun/update-urun-goruntu",
      data: {...data},
      dataType: "json"
    });
    myloc.setItem("seeprod", {id:id});
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

  $(".yrmfrma-rea button").on("click", async function () {
    $(".yrmfrma-rea [name='ad_soyad']").val();
    $(".yrmfrma-rea [name='msg_area']").val();
    if (!$(".yrmfrma-rea [name='ad_soyad']").val()) {
      $(".err-adsyd").html("Bu alan boş olamaz");
    } else {
      $(".err-adsyd").html("");
    }
    if (!$(".yrmfrma-rea [name='msg_area']").val()) {
      $(".err-msgra").html("Bu alan boş olamaz");
    } else {
      $(".err-msgra").html("");
    }

    if (
      !!$(".yrmfrma-rea [name='ad_soyad']").val() &&
      !!$(".yrmfrma-rea [name='msg_area']").val()
    ) {
      const urunid = $("[ro='yorum']").attr("data-ur");

      await $.ajax({
        type: "POST",
        url: "/urun/update-urun",
        data: {
          id: urunid,
          yorumlar: JSON.stringify([
            ...yorumlar,
            {
              ad_soyad: $(".yrmfrma-rea [name='ad_soyad']").val(),
              msg_area: $(".yrmfrma-rea [name='msg_area']").val(),
              tarih: new Date().getTime(),
            },
          ]),
        },
        dataType: "json",
      });
      await getYorumlar(urunid);
      $(".yrmfrma-rea [name='ad_soyad']").val("");
      $(".yrmfrma-rea [name='msg_area']").val("");
    }
  });
 await makeSeeProd(urunId);
  await getYorumlar(urunId);
};
