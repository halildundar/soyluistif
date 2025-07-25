import { InitKategori } from "./kategori.js";
import { InitUrun } from "./urun.js";
import { InitEticaret } from "./eticaret.js";
import { InitSlaytHomeLeft,InitSlaytHomeRight } from "./slayt.js";
import {InitSiparis} from './siparis.js';
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