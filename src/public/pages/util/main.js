import { myloc } from "../../main.js";
const scrollChangeItems = (scrollPos) => {
  // Top Click Button Display status
  if (scrollPos > 200) {
    $(".btntop").css("display", "block");
  } else {
    $(".btntop").css("display", "none");
  }
};
export const TopBtnAndScrollPosInit = () => {
  $(window).on("scroll", function () {
    var scrollPos = $(document).scrollTop();
    scrollChangeItems(scrollPos);
  });
  $(".btntop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    // ('html,body').animate({scrollTop: $('#top').offset().top},'slow');
  });
  $("html, body").animate({ scrollTop: 0 }, 10);
};
export const RandomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const BannerFnc = (selector, time, animespeed) => {
  let slideCount = $(selector + " .wrap .slide").length;
  let slideWidth = $(selector + " .wrap .slide").width();
  let slideWidth1 = $(selector + "").width();
  let slideHeight = $(selector + " .wrap .slide").height();
  let slideHeight1 = $(selector).height();
  // $(selector + " .wrap .slide").css("height", slideHeight1);
  $(selector + " .wrap .slide img").css("height", slideHeight1);
  let sliderUIWidth = slideCount * slideWidth1;
  $(selector).css({ width: slideWidth1, height: slideHeight1 });
  $(selector + " .wrap").css({
    width: sliderUIWidth,
    marginLeft: -slideWidth1,
  });
  $(selector + " .wrap .slide").css({
    width: slideWidth1,
    height: slideHeight1,
  });
  $(selector + " .wrap .slide:last-child").prependTo(selector + " .wrap");
  function moveLeft() {
    $(selector + " .wrap").animate(
      {
        left: +slideWidth1,
      },
      animespeed,
      function () {
        $(selector + " .wrap .slide:last-child").prependTo(selector + " .wrap");
        $(selector + " .wrap").css("left", "");
      }
    );
  }
  function moveRight() {
    $(selector + " .wrap").animate(
      {
        left: -slideWidth1,
      },
      animespeed,
      function () {
        $(selector + " .wrap .slide:first-child").appendTo(selector + " .wrap");
        $(selector + " .wrap").css("left", "");
      }
    );
  }
  let timer = 0;
  $(selector + " .btn-prev").on("click", function () {
    moveLeft();
  });
  $(selector + " .btn-next").on("click", function () {
    moveRight();
  });
  $(selector).on({
    mouseenter: function () {
      clearInterval(timer);
    },
    mouseleave: function () {
      setTimer();
    },
  });
  function setTimer() {
    timer = setInterval(() => {
      moveRight();
    }, time);
  }
  setTimer();
};
export const UrunThumbnailFnc = (selector, time) => {
  const resimler = ["/assets/urun/urun1.webp", "/assets/urun/urun2.webp"];
};
export class LocalData {
  _favIndex = 0;
  get favIndex() {
    return this._favIndex;
  }
  set favIndex(prevIndex) {
    this._favIndex = prevIndex;
    if (this._favIndex > 0) {
      $(".favind").css("display", "flex");
      $(".favind").html(this._favIndex);
    } else {
      $(".favind").css("display", "none");
    }
  }
  _sepetIndex = 0;
  get sepetIndex() {
    return this._sepetIndex;
  }
  set sepetIndex(index) {
    this._sepetIndex = index;
    if (this._sepetIndex > 0) {
      $(".sepetind").css("display", "flex");
      $(".sepetind").html(this._sepetIndex);
    } else {
      $(".sepetind").css("display", "none");
    }
  }
  _siparisIndex = 0;
  get siparisIndex() {
    return this._siparisIndex;
  }
  set siparisIndex(index) {
    this._siparisIndex = index;
    if (this._siparisIndex > 0) {
      $(".siparisind").css("display", "flex");
      $(".siparisind").html(this._siparisIndex);
    } else {
      $(".siparisind").css("display", "none");
    }
  }

  _seeprod = 0;
  get seeprod() {
    return this._seeprod;
  }
  set seeprod(index) {
    this._seeprod = index;
  }

  _filters = 0;
  get filters() {
    return this._filters;
  }
  set filters(index) {
    this._filters = index;
  }

  _storage;
  set storage(cust) {
    this._storage = cust;
    for (let i = 0; i < Object.entries(cust).length; i++) {
      const [key, val] = Object.entries(cust)[i];
      localStorage.setItem(key, JSON.stringify(val));
    }
  }
  get storage() {
    return localStorage;
  }
  constructor() {
    let favs = this.getItem("favs");
    if (favs == null) {
      this.setAllItem("favs", []);
    }
    favs = this.getItem("favs");
    this.favIndex = favs.length;

    let sepet = this.getItem("sepet");
    if (sepet == null) {
      this.setAllItem("sepet", []);
    }
    sepet = this.getItem("sepet");
    this.sepetIndex = sepet.length;

    let siparis = this.getItem("siparis");
    if (siparis == null) {
      this.setAllItem("siparis", []);
    }
    siparis = this.getItem("siparis");
    this.siparisIndex = siparis.length;

    let seeprod = this.getItem("seeprod");
    if (seeprod == null) {
      this.setAllItem("seeprod", []);
    }
    seeprod = this.getItem("seeprod");

    let filters = this.getItem("filters");
    if (filters == null) {
      this.setAllItem("filters", {
        minfiyat: 0,
        maxfiyat: 0,
        stok: 1,
        birim: "USD",
        search: "",
        other: "urun_a_z",
      });
    }
    filters = this.getItem("filters");
    if (!filters.birim) {
      this.setAllItem("filters", {
        ...filters,
        birim: "USD",
      });
    }
    filters = this.getItem("filters");
    if (!filters.search) {
      this.setAllItem("filters", {
        ...filters,
        search: "",
      });
    }
    filters = this.getItem("filters");
    if (!filters.other) {
      this.setAllItem("filters", {
        ...filters,
        other: "urun_a_z",
      });
    }
    filters = this.getItem("filters");
  }
  getItem(key) {
    return JSON.parse(this.storage.getItem(key));
  }
  appendItem(key, data) {
    let newItemDatas = this.getItem(key);
    newItemDatas.push(data);
    this.storage[key] = JSON.stringify(newItemDatas);
    if (key === "favs") {
      const favs = this.getItem("favs");
      this.favIndex = favs.length;
    } else if (key === "sepet") {
      const sepet = this.getItem("sepet");
      this.sepetIndex = sepet.length;
    }
  }
  setItem(key, data) {
    let newItemDatas = this.getItem(key);
    let isFind;
    if (typeof data === "string") {
      isFind = newItemDatas.some((item) => item == data);
    } else {
      isFind = newItemDatas.some((item) => item.id == data.id);
    }
    if (isFind) {
      newItemDatas = newItemDatas.map((a) => {
        if (typeof data === "string") {
          if (a === data) {
            return data;
          }
        } else {
          if (a.id === data.id) {
            return data;
          }
        }

        return a;
      });
      this.storage[key] = JSON.stringify(newItemDatas);
    } else {
      this.appendItem(key, data);
    }
  }
  deleteItem(key, data) {
    let newItemDatas = this.getItem(key);
    if (typeof data == "string") {
      newItemDatas = newItemDatas.filter((a) => a != data);
    } else {
      newItemDatas = newItemDatas.filter((a) => a.id != data.id);
    }
    this.storage[key] = JSON.stringify(newItemDatas);
    if (key === "favs") {
      const favs = this.getItem("favs");
      this.favIndex = favs.length;
    } else if (key === "sepet") {
      const sepet = this.getItem("sepet");
      this.sepetIndex = sepet.length;
    }
  }
  setAllItem(key, data) {
    this.storage.setItem(key, JSON.stringify(data));
  }
  deleteAllItem(key) {
    this.storage.removeItem(key);
  }
}

export const FavStatus = (classn) => {
  let favs = myloc.getItem("favs");
  $.each($(`${!!classn ? "." + classn : ""} .btn-fav`), function () {
    let favElParentId = $(this).parent().attr("data-ur");
    let isFind = favs.some((item) => {
      return item == favElParentId;
    });
    if (isFind) {
      $(this).html("heart");
    } else {
      $(this).html("heart_outlined");
    }
  });

  favs = myloc.getItem("favs");
  myloc.favIndex = favs.length;
};
export const FavsBtn = (el, classn) => {
  let selectId = $(el).parent().attr("data-ur");
  let favs = myloc.getItem("favs");
  let isFind = favs.some((item) => item == selectId);
  if (isFind) {
    myloc.deleteItem("favs", selectId);
  } else {
    myloc.setItem("favs", selectId);
  }
  FavStatus(!!classn ? classn : "");
};
export const SepetStatus = (classn) => {
  let sepet = myloc.getItem("sepet");
  $.each($(`${!!classn ? "." + classn : ""} .btn-sepete-ekle`), function () {
    let sepetEltId = $(this).attr("data-ur");
    let isFind = sepet.some((item) => {
      return item.id == sepetEltId;
    });
    if (isFind) {
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}'] span`).html(
        "Sepeti güncelle"
      );
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}'] i`).html(
        "shopping_cart_outlined"
      );
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}']`).removeClass(
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-500"
      );
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}']`).addClass(
        "bg-orange-600 hover:bg-orange-700 active:bg-orange-500"
      );
    } else {
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}'] span`).html("Sepete ekle");
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}'] i`).html(
        "shopping_cart_add"
      );
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}']`).addClass(
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-500"
      );
      $(`.btn-sepete-ekle[data-ur='${sepetEltId}']`).removeClass(
        "bg-orange-600 hover:bg-orange-700 active:bg-orange-500"
      );
    }
  });
  sepet = myloc.getItem("sepet");
  myloc.sepetIndex = sepet.length;
};
export const SepetBtn = (el, adet, classn) => {
  let selectId = $(el).attr("data-ur");
  myloc.setItem("sepet", { id: selectId, adet: adet });
  SepetStatus(!!classn ? classn : "");
};
export const SiparisStatus = (classn) => {
  let siparis = myloc.getItem("siparis");
  myloc.siparisIndex = siparis.length;
};

export const GetTemp = async (htmlpath) => {
  const str = await $.ajax({
    type: "POST",
    url: "/template/get-txt",
    data: { filepath: htmlpath },
  });
  let rendered = Handlebars.compile(str);
  return rendered;
};
export const SpinnerPop = async (action) => {
  if (action == "open") {
    const render = await GetTemp("spiner.hbs");
    $("body").append(render({}));
  }

  if (action == "close") {
    $(".genel-spinner").remove();
  }
};

export const GetCurrncySym = (item) => {
  return item.currency == "USD" ? "$" : item.currency == "EUR" ? "€" : "₺";
};
