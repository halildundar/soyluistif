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
const DeleteFile = async (filepath) => {
  return $.ajax({
    type: "POST",
    url: "/stat/filedelete",
    data: { filepath: filepath },
    dataType: "json",
  });
};
let selectedId = null;
const readFile = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      res(reader.result);
    });
    reader.readAsDataURL(file);
  });
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
const getEsitesData = async () => {
  let siteler = await $.ajax({
    type: "POST",
    url: "/get-esites",
    dataType: "json",
  });
  siteler =
    !!siteler && siteler.length > 0
      ? siteler.sort((a, b) => (a.sira < b.sira ? -1 : 1))
      : siteler;
  $("tbody").html("");
  for (let ic = 0; ic < siteler.length; ic++) {
    const item = siteler[ic];
    $("tbody").append(`
         <tr  class="site${ic} border border-gray-300">
                            <td  class="bg-gray-100 px-2 py-1 text-center">${item.sira}</td>
                            <td  class="bg-gray-100 px-2 py-1 text-center">${item.site_name}</td>
                            <td  class="bg-gray-100 px-2 py-1">
                                  <img src="${item.site_logo}" class="w-[150px] h-[75px] object-contain rounded-md" alt="">
                            </td>
                            <td  class="bg-gray-100 px-2 py-1 text-center">
                                <a class="underline text-blue-500"  href="${item.site_url}" target="_blank">Siteye Git</a>
                            </td>
                            <td class="text-end bg-gray-100 px-2 py-1">
                                <i class="tio btn-del${ic} cursor-pointer p-1 select-none text-[1.2rem] text-white rounded-full bg-red-500 hover:bg-red-600 active:bg-red-400" title="Sil">clear</i>
                            </td>
                        </tr>
        `);
    $(`.site${ic}`).on("click", () => {
      selectedId = item.id;
      $(".btn-opn").trigger("click");
      $("[name='site_name']").val(item.site_name);
      $("[name='site_url']").val(item.site_url);
      $("[name='sira']").val(item.sira);
      $("[name='site_logo']").val(item.site_logo);
      $(".img-area img").attr("src", item.site_logo);
      $(".btn-guncelle-site").css("display", "block");
      $(".btn-save-site").css("display", "none");
    });
    $(`.btn-del${ic}`).on("click", async (e) => {
      e.stopPropagation();
      let filepath = item.site_logo;
      await $.ajax({
        type: "POST",
        url: "/ctrlpanel/delete-esite",
        data: { id: item.id },
        dataType: "json",
      });
      await DeleteFile(filepath);
      getEsitesData();
    });
    $("table a").on("click", function (e) {
      e.stopPropagation();
    });
  }
};
export const InitEticaret = async () => {
  let selectedImgFile = null;
  $(".img-area").on("click", function () {
    selectedImgFile = null;
    $(".fileselect").val("");
    $(".fileselect").trigger("click");
  });
  $(".fileselect").on("change", async function () {
    selectedImgFile = $(this)[0].files[0];
    const strData = await readFile(selectedImgFile);
    $(".img-area img").attr("src", strData);
    $(".img-area div").html("");
  });
  $(".btn-save-site").on("click", async function () {
    let formData = $("form").serializeJSON();
    if (!!selectedImgFile) {
      $(".spinr").css("display", "flex");
      let filefulnmae = selectedImgFile.name;
      let ext = filefulnmae.split("/").pop().split(".").pop();
      filefulnmae = filefulnmae.replace("." + ext, "");
      await doUpload("/uploads/eticlogos", filefulnmae, selectedImgFile, 1);
      console.log("/uploads/eticlogos/", selectedImgFile.name);
      $(".spinr").css("display", "none");
      formData.site_logo = "/uploads/eticlogos/" + filefulnmae + "." + ext;
      await $.ajax({
        type: "POST",
        url: "/ctrlpanel/add-esite",
        data: { ...formData },
        dataType: "json",
      });
      $(".btn-kpt").trigger("click");
      getEsitesData();
    }
  });
  $(".btn-guncelle-site").on("click", async function () {
    let formData = $("form").serializeJSON();
    $(".spinr").css("display", "flex");
    if (!!selectedImgFile) {
      let filefulnmae = selectedImgFile.name;
      let ext = filefulnmae.split("/").pop().split(".").pop();
      filefulnmae = filefulnmae.replace("." + ext, "");
      await doUpload("/uploads/eticlogos", filefulnmae, selectedImgFile, 1);
      formData.site_logo = "/uploads/eticlogos/" + filefulnmae + "." + ext;
    }
    await $.ajax({
      type: "POST",
      url: "/ctrlpanel/update-esite",
      data: { id: selectedId, ...formData },
      dataType: "json",
    });
    $(".spinr").css("display", "none");
    $(".btn-kpt").trigger("click");
    getEsitesData();
  });
  $(".btn-opn").on("click", function () {
    $(".etic-pop").css("display", "flex");
    $(".btn-guncelle-site").css("display", "none");
    $(".btn-save-site").css("display", "block");
  });
  $(".btn-kpt").on("click", function () {
    $(".etic-pop").css("display", "none");
    $("[name='site_name']").val("");
    $("[name='site_url']").val("");
    $("[name='sira']").val(0);
    $("[name='site_logo']").val("");
    $(".img-area img").removeAttr("src");
    selectedId = null;
  });

  const sites = await getEsitesData();
  console.log(sites);
};
