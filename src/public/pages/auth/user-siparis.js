export const UserOrdersInit = () => {
  $(".shwchk").on("click", function () {
    const id = $(this).parent().attr("data-ur");
    if ($(this).prop("checked")) {
      $(`.ate${id} .adresar`).css("display", "grid");
    } else {
      $(`.ate${id} .adresar`).css("display", "none");
    }
  });
};
