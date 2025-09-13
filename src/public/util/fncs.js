export const GetTemp = async (folderpath) => {
  try {
    const resp = await fetch("/templates/get-temp", {
      method: "POST",
      body: JSON.stringify({ folderpath: folderpath }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.text();
  } catch (error) {
    console.log(error);
  }
};
export const StringToUrl = (str) => {
  let newItem = TrToEnChar(str);
  newItem = newItem.trim().toLocaleLowerCase();
  newItem = newItem.replace(/[*?,.^!$₺@\/]/gi, "");
  newItem = newItem.replace(/\s/g, "-");
  return newItem;
};
export const TrToEnChar = (str) => {
  const charMap = {
    Ç: "C",
    Ö: "O",
    Ş: "S",
    İ: "I",
    I: "i",
    Ü: "U",
    Ğ: "G",
    ç: "c",
    ö: "o",
    ş: "s",
    ı: "i",
    ü: "u",
    ğ: "g",
  };

  str_array = str.split("");

  for (var i = 0, len = str_array.length; i < len; i++) {
    str_array[i] = charMap[str_array[i]] || str_array[i];
  }

  str = str_array.join("");

  var clearStr = str.replace(/[çöşüğı]/gi, "");
  return clearStr;
};
export const SerializeArrayToObject = (data) => {
  let newItem = {};
  $.each($("form").serializeArray(), function (index, item) {
    newItem[item["name"]] = item["value"];
  });

  return {
    ...newItem,
  };
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
export class UploadSlayt {
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
export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export const FileValidation = (file, maxFileSize) => {
  // maxFileSize for mb
  const { name, type, size } = file;
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
  if (!isFileBig) {
    return {
      status: false,
      msg: "Max.dosya boyutu " + maxFileSize + " mb olabilir",
      size: newFileData["size"],
    };
  }
  return {
    status: true,
    file,
    size: newFileData["size"],
  };
};
export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
export function push(data, obj) {
  max = Object.keys(data).reduce(
    (acc, val) => (acc > Number(val) ? acc : Number(val)),
    0
  );
  data[max + 1] = obj;
  return data;
}
export function getDayName(year, month, day) {
  var date = new Date(year, month - 1, day);
  return date.toLocaleDateString("tr-TR", { weekday: "long" });
}
export function getAyGunuHesapla(year, month) {
  return new Date(year, month, 0).getDate();
}
export function getMonthName(year, month, day) {
  var date = new Date(year, month - 1, day);
  return date.toLocaleDateString("tr-TR", { month: "long" });
}

export function CreditCardArea() {
  let ccNumberInput = document.querySelector("[name='cardNumber']"),
    ccNumberPattern = /^\d{0,16}$/g,
    ccNumberSeparator = " ",
    ccNumberInputOldValue,
    ccNumberInputOldCursor,
    ccExpiryInput = document.querySelector(".cc-expiry-input"),
    ccExpiryPattern = /^\d{0,4}$/g,
    ccExpirySeparator = "/",
    ccExpiryInputOldValue,
    ccExpiryInputOldCursor,
    ccCVCInput = document.querySelector(".cc-cvc-input"),
    ccCVCPattern = /^\d{0,3}$/g,
    mask = (value, limit, separator) => {
      var output = [];
      for (let i = 0; i < value.length; i++) {
        if (i !== 0 && i % limit === 0) {
          output.push(separator);
        }

        output.push(value[i]);
      }

      return output.join("");
    },
    unmask = (value) => value.replace(/[^\d]/g, ""),
    checkSeparator = (position, interval) =>
      Math.floor(position / (interval + 1)),
    ccNumberInputKeyDownHandler = (e) => {
      let el = e.target;
      ccNumberInputOldValue = el.value;
      ccNumberInputOldCursor = el.selectionEnd;
    },
    ccNumberInputInputHandler = (e) => {
      let el = e.target,
        newValue = unmask(el.value),
        newCursorPosition;

      if (newValue.match(ccNumberPattern)) {
        newValue = mask(newValue, 4, ccNumberSeparator);

        newCursorPosition =
          ccNumberInputOldCursor -
          checkSeparator(ccNumberInputOldCursor, 4) +
          checkSeparator(
            ccNumberInputOldCursor +
              (newValue.length - ccNumberInputOldValue.length),
            4
          ) +
          (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

        el.value = newValue !== "" ? newValue : "";
      } else {
        el.value = ccNumberInputOldValue;
        newCursorPosition = ccNumberInputOldCursor;
      }

      el.setSelectionRange(newCursorPosition, newCursorPosition);

      highlightCC(el.value);
    },
    highlightCC = (ccValue) => {
      let ccCardType = "",
        ccCardTypePatterns = {
          amex: /^3/,
          visa: /^4/,
          mastercard: /^5/,
          disc: /^6/,

          genric: /(^1|^2|^7|^8|^9|^0)/,
        };

      for (const cardType in ccCardTypePatterns) {
        if (ccCardTypePatterns[cardType].test(ccValue)) {
          ccCardType = cardType;
          break;
        }
      }

      let activeCC = document.querySelector(".cc-types__img--active"),
        newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

      if (activeCC) activeCC.classList.remove("cc-types__img--active");
      if (newActiveCC) newActiveCC.classList.add("cc-types__img--active");
    },
    ccExpiryInputKeyDownHandler = (e) => {
      let el = e.target;
      ccExpiryInputOldValue = el.value;
      ccExpiryInputOldCursor = el.selectionEnd;
    },
    ccExpiryInputInputHandler = (e) => {
      let el = e.target,
        newValue = el.value;

      newValue = unmask(newValue);
      if (newValue.match(ccExpiryPattern)) {
        newValue = mask(newValue, 2, ccExpirySeparator);
        el.value = newValue;
      } else {
        el.value = ccExpiryInputOldValue;
      }
    };

  ccNumberInput.addEventListener("keydown", ccNumberInputKeyDownHandler);
  ccNumberInput.addEventListener("input", ccNumberInputInputHandler);

  // ccExpiryInput.addEventListener("keydown", ccExpiryInputKeyDownHandler);
  // ccExpiryInput.addEventListener("input", ccExpiryInputInputHandler);
}

