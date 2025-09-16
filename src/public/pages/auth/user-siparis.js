export const UserOrdersInit = () => {
  console.log("init");
  $(".shwchk").on("click", function () {
    const id = $(this).parent().attr("data-ur");
    console.log(id);
    if ($(this).prop("checked")) {
      $(`.ate${id} .adresar`).css("display", "grid");
    } else {
      $(`.ate${id} .adresar`).css("display", "none");
    }
  });
};
