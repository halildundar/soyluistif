import { InitKategori } from "./kategori.js";
import { InitUrun } from "./urun.js";
import { InitSlaytHomeLeft,InitSlaytHomeRight } from "./slayt.js";
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
