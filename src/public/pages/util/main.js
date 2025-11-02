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

export const OptimizePhoto = async (photo, MAX_VAL, QUALITY) => {
  const readPhoto = async (photo) => {
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");

    // create img element from File object
    img.src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(photo);
    });
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // draw image in canvas element
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.backgroundColor = "transparent";
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  };
  const scaleCanvas = (canvas, scale) => {
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    scaledCanvas.style.backgroundColor = "transparent";
    scaledCanvas
      .getContext("2d")
      .drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    return scaledCanvas;
  };
  let canvas = await readPhoto(photo);
  while (canvas.width >= 2 * MAX_VAL) {
    canvas = scaleCanvas(canvas, 0.5);
  }
  if (canvas.width >= canvas.height) {
    canvas = scaleCanvas(canvas, MAX_VAL / canvas.height);
  } else {
    canvas = scaleCanvas(canvas, MAX_VAL / canvas.width);
  }
  console.log(photo.type);
  const newOptimazedBlob = await new Promise((resolve) => {
    canvas.toBlob(resolve, photo.type, QUALITY);
  });
  return new File([newOptimazedBlob], photo.name, {
    lastModified: new Date().getTime(),
    type:photo.type
  });
};
export const GetFileExt = (fname) => {
  return fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
};
export class Upload {
  file;
  container;
  index;
  folderpath = "/uploads";
  newNameFile;
  constructor(file, container, index, folderpath, newNameFile) {
    this.file = file;
    this.container = container;
    this.index = index;
    this.folderpath += folderpath;
    this.newNameFile = newNameFile;
  }
  getType() {
    return this.file.type;
  }
  getSize() {
    return this.file.size;
  }
  getName() {
    return this.file.name;
  }
  isValidSize(maxFileSize, cb) {
    // maxFileSize for mb
    const { name, type, size } = this.file;
    let newFileData = {
      size: "0 Kb",
      name,
      type,
    };

    if (size / 1024 / 1024)
      if (size / 1024 / 1024 > 1) {
        newFileData["size"] = (size / 1024 / 1024).toFixed(2) + " mb";
      } else if (size / 1024 / 1024 < 1) {
        newFileData["size"] = (size / 1024).toFixed(2) + " kb";
      }
    const isFileBig = size / 1024 / 1024 <= maxFileSize;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (!isFileBig) {
        $(this.container).append(`<div class="flex flex-col space-y-1">
                    <img src="${reader.result}" class="w-full  object-fill h-[150px]" >
                    <label class="text-red-600 text-[0.8rem]">Max.${maxFileSize}mb</label>
                </div>`);
      } else {
        $(this.container)
          .append(`<div class="all-new-${this.index} flex flex-col space-y-1 " >
                    <img src="${reader.result}" class="w-full h-[150px] object-fill" >
                    <div class="prog${this.index} progress-wrp w-full !bg-white">
                <div class="progress-bar"></div>
                <div class="status">0%</div>
            </div>
            <button class="btn-prog-yukle${this.index} px-2 py-[0.5] text-[0.7rem] bg-blue-600 text-white"> Yükle</button>
                </div>`);
        $(`.btn-prog-yukle${this.index}`).on("click", () => {
          this.doUpload(this.folderpath, this.newNameFile, (item) => cb(item));
        });
      }
    });
    reader.readAsDataURL(this.file);
    // if (!isFileBig) {
    //   return {
    //     status: false,
    //     msg: "Max.dosya boyutu " + maxFileSize + " mb olabilir",
    //     size: newFileData["size"],
    //   };
    // }
    // return {
    //   status: true,
    //   size: newFileData["size"],
    // };
  }
  doUpload(dest_path, filename, cb) {
    filename = !!filename ? filename : this.file.name.split(".")[0];
    // const progressStr = `<div class="prog${this.index} progress-wrp w-full !bg-white">
    //             <div class="progress-bar"></div>
    //             <div class="status">0%</div>
    //         </div>`;

    // $(this.container).append(progressStr);
    var formData = new FormData();
    formData.append("dest_path", dest_path);
    formData.append("filename", filename);
    formData.append("file", this.file, this.getName());
    const progressHandling = (event) => {
      var percent = 0;
      var position = event.loaded || event.position;
      var total = event.total;
      if (event.lengthComputable) {
        percent = Math.ceil((position / total) * 100);
      }
      $(`.prog${this.index}.progress-wrp .progress-bar`).css(
        "width",
        +percent + "%"
      );
      $(`.prog${this.index}.progress-wrp .status`).text(percent + "%");
      if (percent == 100) {
        setTimeout(() => {
          $(`.prog${this.index}.progress-wrp`).remove();
          $(`.btn-prog-yukle${this.index}`).remove();
          $(`.all-new-${this.index}`).remove();
          cb("Ok! : " + this.index);
        }, 1000);
      }
    };
    return $.ajax({
      type: "POST",
      url: "/stat/fileupload",
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener("progress", progressHandling, false);
        }
        return myXhr;
      },
      // success:  function(data){
      //   // your callback here

      // },
      // error: function (error) {
      //   // handle error
      // },
      async: true,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000,
    });
  }

  async asyncDoUpload(dest_path, filename, progressBarId) {
    var formData = new FormData();
    formData.append("dest_path", dest_path);
    formData.append("filename", filename);
    formData.append("file", this.file, this.getName());
    const progressHandling = function (event) {
      var percent = 0;
      var position = event.loaded || event.position;
      var total = event.total;
      if (event.lengthComputable) {
        percent = Math.ceil((position / total) * 100);
      }
      $(progressBarId + " .file-area").addClass("hidden");
      $(progressBarId + " .progress-wrp").removeClass("hidden");
      $(progressBarId + " .progress-wrp .progress-bar").css(
        "width",
        +percent + "%"
      );
      $(progressBarId + " .progress-wrp .status").text(percent + "%");
      if (percent == 100) {
        $(progressBarId + " .progress-wrp").addClass("hidden");
        $(progressBarId + " .file-area").removeClass("hidden");
      }
    };
    return await $.ajax({
      type: "POST",
      url: "/stat/fileupload",
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener("progress", progressHandling, false);
        }
        return myXhr;
      },
      // success:  function(data){
      //   // your callback here

      // },
      // error: function (error) {
      //   // handle error
      // },
      async: true,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000,
    });
  }
}
export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
