import { InitKategori } from "./kategori.js";
import { InitUrun } from "./urun.js";
import { InitEticaret } from "./eticaret.js";
import { InitSlaytHomeLeft,InitSlaytHomeRight } from "./slayt.js";
import {InitSiparis} from './siparis.js';
import {InitRaporUrunler} from './rapor-urunler.js';
export const DashboardInit = () => {
};
export const KategorilerInit = () => {
  InitKategori();
  InitUrun();
};
export const SlaytlarInit = () => {
  InitSlaytHomeLeft();
  InitSlaytHomeRight();
};

export const SiparislerInit = () => {
  InitSiparis();
};

export const EticaretInit = () => {
  InitEticaret();
};
export const RaporlarInit = () => {
  let pathname = location.pathname;
  $("a[href*='/ctrlpanel/']").removeClass('text-orange-600')
  if(pathname.includes('rapor-urunler')){
     $(".rprhdr a[href='/ctrlpanel/rapor-urunler']").addClass('text-orange-600');
  }
 
  InitRaporUrunler();
};