import { DB } from "../mysql.js";
export const getBanners = async (tur) => {
  const items = await DB.Query(
    "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC ",
    [tur]
  );
  return items;
};
export const getMainMenu = async () => {
  const items = await DB.Query(
    "SELECT * FROM `kategori` WHERE parents  IS NULL ORDER BY name ASC"
  );
  return items;
};
export const GetCurrncySym = (item) => {
  return item.currency == "USD" ? "$" : item.currency == "EUR" ? "€" : "₺";
};
export const getMenus = async () => {
  const items = await DB.Query("SELECT * FROM `kategori`");
  return items;
};
export const getOneCikanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY begenilme DESC LIMIT 20"
  );
  return items;
};
export const getCokSatanlar = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY `alinan` DESC LIMIT 20"
  );
  return items;
};
export const getYeniler = async () => {
  const items = await DB.Query(
    "SELECT * FROM `urun`  ORDER BY kayit_tarih DESC LIMIT 20"
  );
  return items;
};
export const getKategoriler = async () => {
  const items = await DB.Query(
    "SELECT * FROM `slayt` WHERE tur = ? ORDER BY sira ASC",
    [tur]
  );
  return items;
};
export const makeBredCrump = async (parentIds) => {
  const datas = await DB.Query(
    "SELECT name,url FROM `kategori` WHERE id IN ?",
    [[parentIds]]
  );
  return datas.map((item, index) => {
    let newItem = { ...item };
    if (index == datas.length - 1) {
      newItem["last"] = 1;
    } else {
      newItem["last"] = 0;
    }
    return newItem;
  });
};
export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
function FiltreFiyatAralikOlustur(urunler) {
  function RunAraliklar1(sınırlar, aralikSayisi = 6) {
    let result = [];
    const sirali = [...sınırlar].sort((a, b) => a.fiyat - b.fiyat);
    const urunPerAralik = Math.ceil(sirali.length / aralikSayisi);
    for (let i = 0; i < sirali.length; i += urunPerAralik) {
      const grup = sirali.slice(i, i + urunPerAralik);
      let total = 0;
      let min = 0;
      let max = 0;
      for (let j = 0; j < grup.length; j++) {
        const grp = grup[j];
        total += grp.grup.length;
        if (j === 0) {
          min = grp.fiyat;
        }
        if (j === grup.length - 1) {
          max = grp.fiyat;
        }
      }
      result.push({
        min: min,
        max: max,
        total,
      });
    }
    let tumitem = { min: 0, max: 0, total: 0 };

    for (let I = 0; I < result.length; I++) {
      const res = result[I];
      if (I == 0) {
        tumitem.min = res.min;
      }
      tumitem.total += res.total;
      if (I == result.length - 1) {
        tumitem.max = res.max;
      }
    }
    result = [{ ...tumitem }, ...result];
    result = result.map((item) => {
      return {
        minStr: item.min.toFixed(2),
        min: item.min,
        maxStr: item.max.toFixed(2),
        max: item.max,
        total: item.total,
      };
    });
    return result;
  }
  const sirali = [...urunler].sort((a, b) => a.fiyat - b.fiyat);
  const maxUrunPerAralik = 10;
  let startIdx = 0;
  let sinirlar = [];
  while (startIdx < sirali.length) {
    let endIdx = startIdx;
    while (
      endIdx + 1 < sirali.length &&
      sirali[endIdx + 1].fiyat === sirali[endIdx].fiyat
    ) {
      endIdx++;
    }

    if (endIdx - startIdx + 1 > maxUrunPerAralik) {
      endIdx = startIdx + maxUrunPerAralik - 1;
      while (
        endIdx + 1 < sirali.length &&
        sirali[endIdx + 1].fiyat === sirali[endIdx].fiyat
      ) {
        endIdx++;
      }
    }

    const grup = sirali.slice(startIdx, endIdx + 1);
    const min = grup[0].fiyat;
    const max = grup[grup.length - 1].fiyat;
    sinirlar.push({ fiyat: min, grup });
    startIdx = endIdx + 1;
  }
  return RunAraliklar1(sinirlar);
}

export const GetUrunlerForSearchArea = async (searchStr) => {
  let urunler = await DB.Query(
    "SELECT * FROM urun WHERE name LIKE '%" +
      searchStr +
      "%' OR kod LIKE '%" +
      searchStr +
      "%'"
  );
  return {
    urunler: urunler,
  };
};
export const SeoDataForPage = async (param) => {
  let siteOrigin = "https://soyluistif.com";
  let statikUrls = [
    {
      url: "/",
      title: "",
      description: "",
      image: "/assets/thumbnail.png",
      derece: 1,
    },
    {
      url: "/hakkimizda",
      title: "Hakkımızda",
      description: "",
      image: "/assets/thumbnail.png",
      derece: 2,
    },
    {
      url: "/iletisim",
      title: "İletişim",
      description: "",
      image: "/assets/thumbnail.png",
      derece: 1,
    },
    {
      url: "/mesafeli-satis-sozlesmesi",
      title: "Mesafeli SAtış Sözleşmesi",
      description: "",
      image: "/assets/thumbnail.png",
      derece: 4,
    },
  ];
};
const getAltKategorilerAndBreadCrumbs = async (param) => {
  let sql1 = `SELECT id,parents FROM kategori WHERE url = '/kategori/${param}'`;
  let resp1 = await DB.Query(sql1);
  let id, parents;
  let allParents = [];
  let altKategoriler = [];
  let breadcrumbs = [];
  if (!!resp1 && resp1.length == 1) {
    id = resp1[0].id;
    parents = resp1[0].parents;
    if (!!parents) {
      allParents = [...JSON.parse(parents), id];
    } else {
      allParents = [id];
    }
    let isLength = allParents.length;
    altKategoriler = await DB.Query(
      "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
      [isLength - 1, id, isLength]
    );
    if (altKategoriler.length == 0) {
      altKategoriler = await DB.Query(
        "SELECT * FROM `kategori` WHERE JSON_CONTAINS(JSON_EXTRACT(parents,'$[?]'),?,'$') AND JSON_LENGTH(parents, '$') = ?",
        [isLength - 2, allParents[allParents.length - 2], isLength - 1]
      );
    }
    breadcrumbs = await makeBredCrump(allParents);
  } else {
    sql1 = `SELECT * FROM kategori WHERE parents IS NULL`;
    resp1 = await DB.Query(sql1);
    altKategoriler = resp1;
  }

  return { altKategoriler, breadcrumbs };
};
export const getUrunlerIncludeKategoriAll = async (
  param,
  search,
  minfiyat = 0,
  maxfiyat = 0,
  birim = "USD",
  stok = 1,
  other = "urun_a_z"
) => {
  let urunler;
  let kategoriler;
  let altKategoriData;
  let selectedKategori;
  // await DB.Query("START TRANSACTION");
  if (!!param) {
    altKategoriData = await getAltKategorilerAndBreadCrumbs(param);
    let res = await DB.Query(
      "SELECT id FROM `kategori` WHERE url LIKE '%kategori/" +
        param +
        "%' OR name LIKE '%kategori/" +
        param +
        "%'"
    );
    let sql = "";
    if (!!res && res.length > 0) {
      selectedKategori = res[0];
      sql = "SELECT * FROM `urun` WHERE parents LIKE '%"+selectedKategori.id+"%' AND currency = '" + birim + "'";
      if (!!search) {
        sql +=
          " AND (name LIKE '%" +
          search +
          "%' OR kod LIKE '%" +
          search +
          "%')";
      }
    } else {
      sql = "SELECT * FROM `urun` WHERE currency = '" + birim + "'";
      if (!!search) {
        sql +=
          " AND (name LIKE '%" + search + "%' OR kod LIKE '%" + search + "%')";
      }
    }

    if (maxfiyat > 0) {
      sql += " AND fiyat  <= " + maxfiyat;
    }
    if (minfiyat >= 0) {
      sql += " AND fiyat >= " + minfiyat;
    }
    if (stok == 1) {
      sql += " AND stok > alinan";
    }
    // console.log(sql);

    if (other == "urun_a_z") {
      sql += " ORDER BY name ASC";
    } else if (other == "urun_z_a") {
      sql += " ORDER BY name DESC";
    } else if (other == "dusuk_fiyat") {
      sql += " ORDER BY fiyat ASC";
    } else if (other == "yuksek_fiyat") {
      sql += " ORDER BY fiyat DESC";
    } else if (other == "yeni") {
      sql += " ORDER BY kayit_tarih DESC";
    } else if (other == "cok_satan") {
      sql += " ORDER BY alinan DESC";
    } else if (other == "cok_oylanan") {
      sql += " ORDER BY begenilme DESC";
    }
    // sql += " LIMIT 100"
    console.log(sql);
    urunler = await DB.Query(sql);
  } else {
    urunler = await DB.Query("SELECT * FROM `urun`");
  }
  let filtreElemanlar = [];
  if (!!urunler && urunler.length > 0) {
    filtreElemanlar = FiltreFiyatAralikOlustur(urunler);
  }
  // await DB.Query("COMMIT");
  return {
    urunler: urunler,
    breadcrumbs: !!altKategoriData ? altKategoriData.breadcrumbs : [],
    filtreElemanlar: filtreElemanlar,
    altKategoriler: !!altKategoriData ? altKategoriData.altKategoriler : [],
  };
};
export const getUrunByUrl = async (urunurl) => {
  const items = await DB.Query("SELECT * FROM `urun`  WHERE url = ?", [
    urunurl,
  ]);
  return items[0];
};
export const SiparisDelete = async (id) => {
  const result = await DB.Query("DELETE FROM `siparis` WHERE id = ?", [id]);
  return res.json({ msg: "OK!" });
};
export const SiparisAdd = async (data) => {
  let newData = {
    ...data,
    paymentCard: JSON.stringify(data.paymentCard),
    buyer: JSON.stringify(data.buyer),
    shippingAddress: JSON.stringify(data.shippingAddress),
    billingAddress: JSON.stringify(data.billingAddress),
    basketItems: JSON.stringify(data.basketItems),
  };
  const result = await DB.Query("INSERT INTO `siparis` SET ?", [newData]);
  return result;
};
export const SiparisUpdate = async (data) => {
  const { id, ...others } = data;
  const result = await DB.Query("UPDATE `siparis` SET ? WHERE id = " + id, [
    others,
  ]);
  return result;
};
export const SiparisGetBYID = async (ids) => {
  const result = await DB.Query("SELECT * FROM `siparis` WHERE id = ?", [
    [ids],
  ]);
  return result;
};
export const SiparisByiIyzIDGet = async (ids) => {
  const result = await DB.Query(
    "SELECT * FROM `siparis` WHERE paymentId IN ?",
    [[ids]]
  );
  return result;
};
export const GetEticLogos = async () => {
  let siteler = await await DB.Query("SELECT * FROM `eticsites`");
  if (!!siteler && siteler.length > 0) {
    return siteler.sort((a, b) => (a.sira < b.sira ? -1 : 1));
  }
  return [];
};
export const GetSettings = async () => {
  const rep = await DB.Query("SELECT * FROM `settings` WHERE id = 1");
  return rep[0];
};
