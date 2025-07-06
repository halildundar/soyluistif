let homeLeftSlaytlar;
let homeRightSlaytlar;
const makeHomeLeftSlayts = async () => {
  $("#sortable").html("");
  homeLeftSlaytlar = await getSlaytlar("homeleft");
  for (let I = 0; I < homeLeftSlaytlar.length; I++) {
    const slaytlar = homeLeftSlaytlar[I];
    $("#sortable").append(`
    <div  data-sira="${I + 1}" data-id="${slaytlar.id}"
                            class="mnwrap  p-2 border border-gray-200 flex items-center space-x-2 cursor-move  bg-white pr-2">
                            <a href="${slaytlar.img_url}" target="_blank">
                              <img src="${slaytlar.img_url}"
                                  class="h-[75px] min-w-[135px] rounded-md overflow-hidden cursro-pointer shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] "
                                  alt="">
                                </a>
                            <div class="flex-1 text-[1rem]">
                                <strong>Sıra:</strong>
                                <span class="text-red-600">${
                                  slaytlar.sira
                                }</span>
                            </div>
                            <button class="btn-slyt-remove${
                              slaytlar.id
                            } tio text-white bg-red-600 rounded-full shadow-md p-1 text-[1.4rem]" title="Sil">clear</button>
                        </div> 
    `);
    $(`#sortable .btn-slyt-remove${slaytlar.id}`).on("click", async (e) => {
      e.stopPropagation();
      await deleteSlayt({ id: slaytlar.id });
      await DeleteFile(slaytlar.img_url);
      makeHomeLeftSlayts();
    });
  }
  if (homeLeftSlaytlar.length > 0) {
    $(".not-slaytekle").css("display", "none");
  } else {
    $(".not-slaytekle").css("display", "block");
  }
};
const makeHomeRightSlayts = async () => {
  $("#sortable1").html("");
  homeRightSlaytlar = await getSlaytlar("homeright");
  for (let I = 0; I < homeRightSlaytlar.length; I++) {
    const slaytlar = homeRightSlaytlar[I];
    $("#sortable1").append(`
    <div   data-sira="${I + 1}" data-id="${slaytlar.id}"
                            class="mnwrap p-2 border border-gray-200 flex items-center space-x-2 cursor-move  bg-white">
                            <a href="${slaytlar.img_url}" target="_blank">
                            <img src="${slaytlar.img_url}"
                                class="h-[75px] min-w-[135px] rounded-md overflow-hidden cursro-pointer shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] "
                                alt="">
                                </a>
                            <div class="flex-1 text-[0.8rem]">
                                <strong>Sıra:</strong>
                                <span class="text-red-600">${
                                  slaytlar.sira
                                }</span>
                            </div>
                            <button class="btn-slyt-remove${
                              slaytlar.id
                            } tio text-white bg-red-600 rounded-full shadow-md p-1 text-[1.4rem]" title="Sil">clear</button>
                        </div> 
    `);
    $(`#sortable1 .btn-slyt-remove${slaytlar.id}`).on("click", async (e) => {
      e.stopPropagation();
      await deleteSlayt({ id: slaytlar.id });
      await DeleteFile(slaytlar.img_url);
      makeHomeRightSlayts();
    });
  }
  if (homeRightSlaytlar.length > 0) {
    $(".not-slaytekle1").css("display", "none");
  } else {
    $(".not-slaytekle1").css("display", "block");
  }
};
const updateRightOrder = async () => {
  let siralist = [];
  $.each($("#sortable1 .mnwrap"), function (index) {
    let data = {
      sira: index + 1,
      id: $(this).attr("data-id"),
    };
    siralist.push(data);
  });
  let promises = [];
  for (let I = 0; I < siralist.length; I++) {
    const item = siralist[I];
    promises.push(
      updateSlayt({
        id: item.id,
        sira: item.sira,
      })
    );
  }
  await Promise.all(promises);
  setTimeout(() => {
    makeHomeRightSlayts();
  }, 500);
};
export const InitSlaytHomeRight = async () => {
  $("#sortable1").sortable({
    revert: false,
    update: async (e) => {
      updateRightOrder();
    },
  });
  $(".btn-anaslayt1").on("click", () => {
    $("[name='anaslaytfile1']").val("");
    $("[name='anaslaytfile1']").trigger("click");
  });
  let files = [];
  $("[name='anaslaytfile1']").on("change", async function () {
    const file = $(this).get(0).files[0];
    const bse64 = await readFile(file);
    const validData = isValidSize(file, 1);
    if (validData.status) {
      files.push(file);
      $("#sortable1").prepend(`
                    <a  target="_blank"
                            class="prog${files.length} p-2 border border-gray-200 flex items-center   bg-green-500/20 relative">
                            <img src="${bse64}"
                                class="h-[75px] min-w-[135px] rounded-md overflow-hidden shadow-[0_0_3px_1px_rgba(0,0,0,0.3)]"
                                alt="">
                            <div class="flex-1 text-[0.8rem]">
                                <strong>Dosya:</strong>
                                <span class="msj-area">${file.name} - ${validData.size}</span>
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center px-14">
                                <div class="progress-wrp w-full !bg-white">
                                    <div class="progress-bar"></div>
                                    <div class="status">0%</div>
                                </div>
                            </div>
                        </a> 
      `);
    } else {
      $("#sortable1").prepend(`
      <a  target="_blank"
                            class="nonvalid1 p-2 border border-gray-200 flex items-center space-x-2  bg-red-500/20">
                            <img src="${bse64}"
                                class="h-[75px] min-w-[135px] rounded-md overflow-hidden shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] "
                                alt="">
                            <div class="flex-1 text-[0.8rem]">
                                <strong>Mesaj:</strong>
                                <span class="text-red-600">${validData.msg} - ${validData.size}</span>
                            </div>
                        </a> 
      `);
    }
    if (files.length > 0) {
      $(".btn-anaslaytyukle1").css("display", "inline-block");
    } else {
      $(".btn-anaslaytyukle1").css("display", "none");
    }
  });
  $(`.btn-anaslaytyukle1`).on("click", async () => {
    let promises = [];
    let i = 0;
    for (let I = 0; I < files.length; I++) {
      const file = files[I];
      i = I + 1;
      const filename = file.name.split(".")[0] + new Date().getTime();
      promises.push(doUpload("/uploads/slaytlar", filename, file, I + 1));
      promises.push(
        addSlayt({
          name: "",
          img_url:
            "/uploads/slaytlar/" + filename + "." + file.name.split(".")[1],
          url: "/",
          sira: I + 1,
          tur: "homeright",
        })
      );
    }
    await Promise.all(promises);
    $(".btn-anaslaytyukle1").css("display", "none");
    $(".nonvalid1").remove();
    for (let I = 0; I < homeRightSlaytlar.length; I++) {
      const slayt = homeRightSlaytlar[I];
      await updateSlayt({ ...slayt, sira: i + 1 + I });
    }
    makeHomeRightSlayts();
    files = [];
  });
  makeHomeRightSlayts();
};
const updateLeftOrder = async () => {
  let siralist = [];
  $.each($("#sortable .mnwrap"), function (index) {
    let data = {
      sira: index + 1,
      id: $(this).attr("data-id"),
    };
    siralist.push(data);
  });
  let promises = [];
  for (let I = 0; I < siralist.length; I++) {
    const item = siralist[I];
    promises.push(
      updateSlayt({
        id: item.id,
        sira: item.sira,
      })
    );
  }
  await Promise.all(promises);
  setTimeout(() => {
    makeHomeLeftSlayts();
  }, 500);
};
export const InitSlaytHomeLeft = async () => {
  $("#sortable").sortable({
    revert: false,
    update: async (e) => {
      updateLeftOrder();
    },
  });
  $(".btn-anaslayt").on("click", () => {
    $("[name='anaslaytfile']").val("");
    $("[name='anaslaytfile']").trigger("click");
  });
  let files = [];
  $("[name='anaslaytfile']").on("change", async function () {
    const file = $(this).get(0).files[0];
    const bse64 = await readFile(file);
    const validData = isValidSize(file, 1);
    if (validData.status) {
      files.push(file);
      $("#sortable").prepend(`
                    <a  target="_blank"
                            class="prog${files.length} p-2 border border-gray-200 flex items-center   bg-green-500/20 relative">
                            <img src="${bse64}"
                                class="h-[75px] min-w-[135px] rounded-md overflow-hidden shadow-[0_0_3px_1px_rgba(0,0,0,0.3)]"
                                alt="">
                            <div class="flex-1 text-[0.8rem]">
                                <strong>Dosya:</strong>
                                <span class="msj-area">${file.name} - ${validData.size}</span>
                            </div>
                            <div class="absolute top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center px-14">
                                <div class="progress-wrp w-full !bg-white">
                                    <div class="progress-bar"></div>
                                    <div class="status">0%</div>
                                </div>
                            </div>
                        </a> 
      `);
    } else {
      $("#sortable").prepend(`
      <a  target="_blank"
                            class="nonvalid p-2 border border-gray-200 flex items-center space-x-2  bg-red-500/20">
                            <img src="${bse64}"
                                class="h-[75px] min-w-[135px] rounded-md overflow-hidden shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] "
                                alt="">
                            <div class="flex-1 text-[0.8rem]">
                                <strong>Mesaj:</strong>
                                <span class="text-red-600">${validData.msg} - ${validData.size}</span>
                            </div>
                        </a> 
      `);
    }
    if (files.length > 0) {
      $(".btn-anaslaytyukle").css("display", "inline-block");
    } else {
      $(".btn-anaslaytyukle").css("display", "none");
    }
  });
  $(`.btn-anaslaytyukle`).on("click", async () => {
    let promises = [];
    let i = 0;
    for (let I = 0; I < files.length; I++) {
      const file = files[I];
      i = I + 1;
      const filename = file.name.split(".")[0] + new Date().getTime();
      promises.push(doUpload("/uploads/slaytlar", filename, file, I + 1));
      promises.push(
        addSlayt({
          name: "",
          img_url:
            "/uploads/slaytlar/" + filename + "." + file.name.split(".")[1],
          url: "/",
          sira: I + 1,
          tur: "homeleft",
        })
      );
    }
    await Promise.all(promises);
    $(".btn-anaslaytyukle").css("display", "none");
    $(".nonvalid").remove();
    for (let I = 0; I < homeLeftSlaytlar.length; I++) {
      const slayt = homeLeftSlaytlar[I];
      await updateSlayt({ ...slayt, sira: i + 1 + I });
    }
    makeHomeLeftSlayts();
    files = [];
  });
  makeHomeLeftSlayts();
};
const readFile = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      res(reader.result);
    });
    reader.readAsDataURL(file);
  });
};
const isValidSize = (file, maxFileSize) => {
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
    size: newFileData["size"],
  };
};
const doUpload = async (dest_path, filename, file, index) => {
  return new Promise((res, rej) => {
    filename = !!filename ? filename : file.name.split(".")[0];
    var formData = new FormData();
    formData.append("dest_path", dest_path);
    formData.append("filename", filename);
    formData.append("file", file, file.name);
    const progressHandling = (event) => {
      var percent = 0;
      var position = event.loaded || event.position;
      var total = event.total;
      if (event.lengthComputable) {
        percent = Math.ceil((position / total) * 100);
      }
      $(`.prog${index} .progress-wrp .progress-bar`).css(
        "width",
        +percent + "%"
      );
      $(`.prog${index} .progress-wrp .status`).text(percent + "%");
      if (percent == 100) {
        setTimeout(() => {
          $(`.prog${index}`).remove();
          res("Ok!");
        }, 1000);
      }
    };
    $.ajax({
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
  });
};
const addSlayt = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/slaytlar/add-item",
    data: { ...data },
    dataType: "json",
  });
};
const updateSlayt = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/slaytlar/update-item",
    data: { ...data },
    dataType: "json",
  });
};
const getSlaytlar = (tur) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/slaytlar/get-items",
    data: { tur: tur },
    dataType: "json",
  });
};
const deleteSlayt = async (data) => {
  return $.ajax({
    type: "POST",
    url: "/ctrlpanel/slaytlar/delete-item",
    data: { ...data },
    dataType: "json",
  });
};
const DeleteFile = async (filepath) => {
  return $.ajax({
    type: "POST",
    url: "/stat/filedelete",
    data: { filepath: filepath },
    dataType: "json",
  });
};
