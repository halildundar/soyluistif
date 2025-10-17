import { myloc } from "../main.js";
import { FavsBtn, FavStatus, SepetBtn, SepetStatus } from "./util/main.js";
let filters;
export const KategoriInit = () => {
  $(".urunler a").on("click", function () {
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
  filterInit();
};

const filterInit = () => {
  filters = myloc.getItem("filters");
  let searchItem = Object.fromEntries(new URLSearchParams(location.search));
  for (const key in filters) {
    if (key == "minfiyat") {
      filters[key] = !!searchItem["minfiyat"] ? searchItem["minfiyat"] : 0;
    } else if (key == "maxfiyat") {
      filters[key] = !!searchItem["maxfiyat"] ? searchItem["maxfiyat"] : 0;
    } else if (key == "stok") {
      filters["stok"] = !!searchItem["stok"] ? searchItem["stok"] : 1;
    } else if (key == "birim") {
      filters[key] = !!searchItem["birim"] ? searchItem["birim"] : "USD";
    } else if (key == "search") {
      filters[key] = !!searchItem["search"] ? searchItem["search"] : "";
    } else if (key == "other") {
      filters[key] = !!searchItem["other"] ? searchItem["other"] : "urun_a_z";
    }
  }
  myloc.setAllItem("filters", filters);
  filters = myloc.getItem("filters");

  let checkInitStat = false;
  $("[name='stoktakiler']").on("change", function () {
    let status = 0;
    if ($(this).prop("checked")) {
      status = 1;
    } else {
      status = 0;
    }
    filters = {
      ...filters,
      stok: status,
    };
    if (checkInitStat) {
      sendFilter(filters);
    }
  });
  if (filters.stok === 1) {
    $("[name='stoktakiler']").trigger("click");
  }
  checkInitStat = true;

  $("[name='minmax']").on("change", function () {
    let deger = $(this).val();
    deger = deger.replaceAll("`", "").split("-");
    let min = deger[0];
    let max = deger[1];
    $("[name='minfiyat']").val(min);
    $("[name='maxfiyat']").val(max);
    $("[name='minfiyat1']").val(min);
    $("[name='maxfiyat1']").val(max);
    filters = {
      ...filters,
      minfiyat: $("[name='minfiyat']").val(),
      maxfiyat: $("[name='maxfiyat']").val(),
    };
    sendFilter(filters);
  });
  $("[name='minmax1']").on("change", function () {
    let deger = $(this).val();
    deger = deger.replaceAll("`", "").split("-");
    let min = deger[0];
    let max = deger[1];
    $("[name='minfiyat']").val(min);
    $("[name='maxfiyat']").val(max);
    $("[name='minfiyat1']").val(min);
    $("[name='maxfiyat1']").val(max);
    filters = {
      ...filters,
      minfiyat: $("[name='minfiyat']").val(),
      maxfiyat: $("[name='maxfiyat']").val(),
    };
    sendFilter(filters);
  });
  // $(`#fiyat_${filters.minfiyat}-${filters.maxfiyat}`).trigger("click");

  let initbirim = false;
  $("[name='para_birim']").on("change", function () {
    filters = {
      ...filters,
      birim: $(this).val(),
    };
    if (initbirim) {
      sendFilter({
        ...filters,
        minfiyat: 0,
        maxfiyat: 0,
      });
    }
    $("[name='para_birim_seclt']").val($(this).val());
  });
  $("[name='para_birim_seclt']").on("change", function () {
    filters = {
      ...filters,
      birim: $(this).val(),
    };
    if (initbirim) {
      sendFilter({
        ...filters,
        minfiyat: 0,
        maxfiyat: 0,
      });
    }
  });
  $(`#${filters.birim}`).trigger("click");
  $("[name='para_birim_seclt']").val(filters.birim);
  initbirim = true;
  $(".errfyat").html("");
  $(".btn-go-fiyat").on("click", function () {
    let minFiyat = $("[name='minfiyat']").val();
    let maxfiyat = $("[name='maxfiyat']").val();
    minFiyat = !!minFiyat ? parseInt(minFiyat) : 0;
    maxfiyat = !!maxfiyat ? parseInt(maxfiyat) : 0;

    if (minFiyat < maxfiyat) {
      let link = `?birim=${filters.birim}&minfiyat=${minFiyat}&maxfiyat=${maxfiyat}&stok=${filters.stok}`;
      location.href = link;
    } else {
      $(".errfyat").html("min.fiyat alanı daha küçük olmalı");
    }
  });

  $("body").on("click", function () {
    $(".btnfiytslist").hide();
  });

  $(".btn-showfiyats ").on("click", function (e) {
    e.stopPropagation();
    $(".btnfiytslist").toggle();
  });

  let initFilter2 = false;
  $("#filter2").on("change", function () {
    filters = {
      ...filters,
      other: $(this).val(),
    };
    if (initFilter2) {
      sendFilter(filters);
    }
  });
  $(`#filter2`).val(filters.other);
  initFilter2 = true;

  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  $(".ikili").on("click", function () {
    $(".uclu div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".ikili div").removeClass("bg-gray-200").addClass("bg-gray-500");
    $(".dortlu div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".runrea")
      .removeClass("md:grid-cols-4")
      .removeClass("md:grid-cols-3")
      .addClass("md:grid-cols-2");
    $(".runrea .imgrea")
      .removeClass("lg:h-[275px]")
      .removeClass("lg:h-[375px]")
      .addClass("lg:h-[375px]");
  });
  $(".uclu").on("click", function () {
    $(".uclu div").removeClass("bg-gray-200").addClass("bg-gray-500");
    $(".ikili div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".dortlu div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".runrea")
      .removeClass("md:grid-cols-4")
      .removeClass("md:grid-cols-2")
      .addClass("md:grid-cols-3");
    $(".runrea .imgrea")
      .removeClass("lg:h-[275px]")
      .removeClass("lg:h-[375px]")
      .addClass("lg:h-[325px]");
  });
  $(".dortlu").on("click", function () {
    $(".uclu div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".ikili div").removeClass("bg-gray-500").addClass("bg-gray-200");
    $(".dortlu div").removeClass("bg-gray-200").addClass("bg-gray-500");

    $(".runrea")
      .addClass("md:grid-cols-4")
      .removeClass("md:grid-cols-3")
      .removeClass("md:grid-cols-2");
    $(".runrea .imgrea")
      .removeClass("lg:h-[375px]")
      .removeClass("lg:h-[325px]")
      .addClass("lg:h-[275px]");
  });
};

const sendFilter = (filters) => {
  let link = `?birim=${filters.birim}&minfiyat=${filters.minfiyat}&maxfiyat=${filters.maxfiyat}&stok=${filters.stok}&other=${filters.other}`;
  location.href = link;
};
