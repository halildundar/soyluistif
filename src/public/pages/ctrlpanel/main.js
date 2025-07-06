import { InitKategori } from "./kategori.js";
import { InitUrun } from "./urun.js";
import { InitSlaytHomeLeft,InitSlaytHomeRight } from "./slayt.js";
export const DashboardInit = () => {
  console.log("dashboard init");
};
export const KategorilerInit = () => {
  console.log("Kategoriler init");
  InitKategori();
  InitUrun();
};
export const SlaytlarInit = () => {
      console.log("Slaytlar init");
  InitSlaytHomeLeft();
  InitSlaytHomeRight();
};
