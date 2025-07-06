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

const AltButonArea = () => {
  $("[ro]").css("color", "#4b5563");
  $("[ro='urun']").css("color", "blue");
  // $(".alt-area").html(`
  //       <div class="raw-content"><strong><span style="font-family:Arial,Helvetica,sans-serif;"><span style="font-size:16px;"><span style="line-height:normal">Ürün Adı : </span>Hidrollik Tek Etkili El Pompası Vanası B Tipi</span></span></strong><div aria-labelledby="p-g-nav-54-0-tab" class="tab-pane show active p-g-b-c-0" id="p-g-nav-54-0" role="tabpanel"><div class="p-g-b-c-wrapper"><div class="p-g-b-c-inner"><div class="p-g-mod p-g-mod-t-48 p-g-mod-product-det "><div class="p-g-mod-body "><div class="raw-content"><strong><span style="font-family:Arial,Helvetica,sans-serif;"><span style="font-size:16px;"><span style="line-height:normal">Not : Fiyat 1 Adet İçindir.</span><br><span style="line-height:normal">Lütfen Ürünün Görselini Dikkatlice İnceleyiniz Ürünün Sizin Numune İle Ölçülerinin Aynı Olduğundan Emin Olup O Şekilde Sipariş Veriniz.</span></span></span></strong></div></div></div></div></div></div></div>
  //     `);
  $("[ro='urun']").on("click", function () {
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
  $("[ro='yorum']").on("click", function () {
    $("[ro]").css("color", "#4b5563");
    $("[ro='yorum']").css("color", "blue");
    $(".urun-ack").css("display", "none");
    $(".garanti-ack").css("display", "none");
    $(".yorum-ack").css("display", "block");
  });
};
export const UrunInit = () => {
  $(".caro3.owl-carousel").owlCarousel(settingsCaro1);
  AltButonArea();
};
