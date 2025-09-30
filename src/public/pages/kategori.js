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
      filters[key] = !!searchItem[key] ? searchItem[key] : 0;
    } else if (key == "minfiyat") {
      filters[key] = !!searchItem[key] ? searchItem[key] : 0;
    } else if (key == "stok") {
      filters["stok"] = !!searchItem["stok"] ? searchItem["stok"] : 1;
    } else if (key == "birim") {
      filters[key] = !!searchItem["birim"] ? searchItem["birim"] : "USD";
    } else if (key == "search") {
      filters[key] = !!searchItem["search"] ? searchItem["search"] : "";
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
    filters = {
      ...filters,
      minfiyat: $("[name='minfiyat']").val(),
      maxfiyat: $("[name='maxfiyat']").val(),
    };
    sendFilter(filters);
  });
  $(`#fiyat_${filters.minfiyat}-${filters.maxfiyat}`).trigger("click");

  let initbirim = false;
  $("[name='para_birim']").on("change", function () {
    filters = {
      ...filters,
      birim: $(this).val(),
    };
    if (initbirim) {
      sendFilter(filters);
    }
  });
  $(`#${filters.birim}`).trigger("click");
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
    }else{
      $(".errfyat").html("min.fiyat alanı daha küçük olmalı")
    }

  });
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
};

const sendFilter = (filters) => {
  let link = `?birim=${filters.birim}&minfiyat=${filters.minfiyat}&maxfiyat=${filters.maxfiyat}&stok=${filters.stok}`;
  location.href = link;
};
