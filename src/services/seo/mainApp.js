import express from "express";
let router = express.Router({ mergeParams: true });
import { DB } from "../mysql.js";
import { isbot } from "isbot";
import { SitemapStream, streamToPromise } from "sitemap";
import { HOST_NAME } from "../../server.js";
import { pad } from "../web/dbdata.js";

const jsonLdMiddleware = (req, res, next) => {
  res.locals.jsonLd = [];

  // JSON-LD eklemek için helper
  res.addJsonLd = function (data) {
    if (typeof data === "object") {
      res.locals.jsonLd.push(data);
    }
  };

  next();
};
export const SeoApp = (app) => {
  const sitename = "Örnek E-Ticaret";
  const telefon = "+905099129428";
  router.use(jsonLdMiddleware);
  router.get("/sitemap.xml", async (req, res, next) => {
    res.header("Content-Type", "application/xml");
    const stream = new SitemapStream({ hostname: HOST_NAME });
    stream.write({ url: "/", changefreq: "weekly", priority: 1.0 });
    stream.write({ url: "/hakkimizda", changefreq: "never", priority: 0.9 });
    stream.write({ url: "/iletisim", changefreq: "never", priority: 0.9 });
    // Kategoriler
    const categories = await DB.Query("SELECT url FROM kategori");
    categories.forEach((c) => {
      stream.write({
        url: `${c.url}`,
        changefreq: "weekly",
        priority: 0.7,
      });
    });
    // Ürünler
    const products = await DB.Query("SELECT url FROM urun");
    products.forEach((p) => {
      stream.write({
        url: `/urun/${p.url}`,
        changefreq: "weekly",
        priority: 0.8,
        // lastmod: p.updated_at,
      });
    });
    // Bitir
    stream.end();
    const xml = await streamToPromise(stream);
    return res.send(xml.toString());
  });
  router.get("/kategori/:slug", async (req, res, next) => {
    let isBot = isbot(req.get("user-agent"));
    let slug = req.params.slug;
    if (isBot) {
      //Her sayfada
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: sitename,
        url: HOST_NAME,
        logo: HOST_NAME + "/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: telefon,
            contactType: "customer service",
            areaServed: "TR",
            availableLanguage: ["Turkish"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://www.twitter.com/",
        ],
      });
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: HOST_NAME + req.path,
        name: sitename,
        potentialAction: {
          "@type": "SearchAction",
          target: HOST_NAME + "/kategori?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      });
      let sql =
        "SELECT id,parents,name FROM kategori WHERE url = '/kategori/" +
        slug +
        "'";
      let kategoriName;
      let idsForParents = [];
      let itemListElement = [];
      let urunler = [];
      let data1 = await DB.Query(sql);
      if (!!data1[0]) {
        idsForParents = [data1[0].id];
        kategoriName = data1[0].name;
        if (!!data1[0].parents) {
          idsForParents = [...idsForParents, ...JSON.parse(data1[0].parents)];
        }
        let stri = "";
        for (let i = 0; i < idsForParents.length; i++) {
          const item = idsForParents[i];
          if (i == idsForParents.length - 1) {
            stri += item;
          } else {
            stri += item + ",";
          }
        }
        let sqlUrunler =
          "SELECT name,url,resimler FROM urun WHERE parents LIKE '%" +
          stri +
          "%'";
        console.log(sqlUrunler);
        urunler = await DB.Query(sqlUrunler);

        for (let i = 0; i < urunler.length; i++) {
          const urun = urunler[i];
          itemListElement.push({
            "@type": "ListItem",
            position: i + 1,
            url: HOST_NAME + "/urun/" + urun.url,
            name: urun.name,
          });
        }
      }
      // console.log(data.id,data);

      //Kategorilerde
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: kategoriName,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: itemListElement.length,
        itemListElement: [...itemListElement],
      });
      let menuS = await DB.Query(
        "SELECT url,name FROM kategori WHERE parents IS NULL"
      );
      let urunlerRs = urunler.map((a) => {
        return {
          ...a,
          resim:
            !!a.resimler && a.resimler.length > 0
              ? JSON.parse(a.resimler)[0]
              : "/assets/logosm.png",
        };
      });

      return res.render("pages/seo/kategori.hbs", {
        title: kategoriName + " ÜRÜNLERİ",
        layout: "seo-main.hbs",
        jsonLDdata: res.locals.jsonLd,
        urunlerRs: urunlerRs,
        ekmenu: menuS,
        image: HOST_NAME + "/assets/thumbnail.png",
        href: HOST_NAME + "/" + slug,
        description:
          "Soylu İstif Makinaları A.Ş. Transpalet, istif makineleri ve kaldırma ekipmanlarının satışı, transpalet tekerleri ve yedek parça üretimi.",
      });
    }
    next();
  });
  router.get("/urun/:slug", async (req, res, next) => {
    console.log("isBot:", isbot(req.get("user-agent")));
    const sitename = "Soylu istif Makineleri";
    const telefon = "+905099129428";
    let slug = req.params.slug;

    let urunname = "Ürün";
    let description =
      "Soylu İstif Makinaları A.Ş. Transpalet, istif makineleri ve kaldırma ekipmanlarının satışı, transpalet tekerleri ve yedek parça üretimi.";

    if (isbot(req.get("user-agent"))) {
      //Her sayfada
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: sitename,
        url: HOST_NAME,
        logo: HOST_NAME + "/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: telefon,
            contactType: "customer service",
            areaServed: "TR",
            availableLanguage: ["Turkish"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://www.twitter.com/",
        ],
      });
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: HOST_NAME + req.path,
        name: sitename,
        potentialAction: {
          "@type": "SearchAction",
          target: HOST_NAME + "/kategori?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      });

      let resf = await DB.Query(
        "SELECT * FROM urun WHERE url = '" + slug + "'"
      );
      let selectedUrun = resf[0];

      if (!!selectedUrun) {
        // Breadcrumb
        res.addJsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Ana Sayfa",
              item: HOST_NAME,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: selectedUrun.name,
              item: HOST_NAME + "/urun/" + selectedUrun.url,
            },
          ],
        });
        description = selectedUrun.aciklama;
        urunname = selectedUrun.name;
        let price = pad(parseFloat(selectedUrun.fiyat), 2);
        //Üründe
        res.addJsonLd({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: selectedUrun.name,
          image: !!selectedUrun.resimler
            ? JSON.parse(selectedUrun.resimler)
            : ["/assets/logo.png"],
          description: selectedUrun.aciklama,
          sku: selectedUrun.kod,
          brand: {
            "@type": "Brand",
            name: selectedUrun.name,
          },
          offers: {
            "@type": "Offer",
            url: HOST_NAME + "/urun/" + selectedUrun.url,
            priceCurrency: selectedUrun.currency,
            price: price,
            priceValidUntil: "2028-12-31",
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: sitename,
            },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            reviewCount: "128",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Ali" },
              datePublished: "2025-08-12",
              reviewBody: "Ürün çok rahat ve hızlı kargo.",
              name: "Harika spor ayakkabı",
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
              },
            },
          ],
        });
      }

      let menuS = await DB.Query(
        "SELECT url,name FROM kategori WHERE parents IS NULL"
      );
      let resimler = !!selectedUrun.resimler
        ? JSON.parse(selectedUrun.resimler)
        : [];
      return res.render("pages/seo/urun.hbs", {
        title: urunname,
        layout: "seo-main.hbs",
        jsonLDdata: res.locals.jsonLd,
        ekmenu: menuS,
        image: HOST_NAME + "/thumbnail.png",
        href: HOST_NAME + "/" + slug,
        description: description,
        urun: selectedUrun,
        resimler: resimler,
        firstResim: resimler.length > 0 ? resimler[0] : "",
      });
    }
    next();
  });
  router.get("/iletisim", async (req, res, next) => {
    console.log("isBot:", isbot(req.get("user-agent")));
    const sitename = "Soylu İstif Makinaları";
    const telefon = "+905099129428";

    if (isbot(req.get("user-agent"))) {
      //Her sayfada
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: sitename,
        url: HOST_NAME,
        logo: HOST_NAME + "/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: telefon,
            contactType: "customer service",
            areaServed: "TR",
            availableLanguage: ["Turkish"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://www.twitter.com/",
        ],
      });
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: HOST_NAME + req.path,
        name: sitename,
        potentialAction: {
          "@type": "SearchAction",
          target: HOST_NAME + "/kategori?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      });
      // Breadcrumb
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: HOST_NAME,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "İletişim",
            item: HOST_NAME + "/iletisim",
          },
        ],
      });

      let menuS = await DB.Query(
        "SELECT url,name FROM kategori WHERE parents IS NULL"
      );
      return res.render("pages/seo/iletisim.hbs", {
        title: "Hakkımızda | " + sitename,
        layout: "seo-main.hbs",
        jsonLDdata: res.locals.jsonLd,
        ekmenu: menuS,
        image: HOST_NAME + "/assets/thumbnail.png",
        href: HOST_NAME,
        description:
          "Soylu İstif Makinaları A.Ş. Transpalet, istif makineleri ve kaldırma ekipmanlarının satışı, transpalet tekerleri ve yedek parça üretimi.",
      });
    }
    next();
  });
  router.get("/hakkimizda", async (req, res, next) => {
    console.log("isBot:", isbot(req.get("user-agent")));
    const sitename = "Soylu İstif Makinaları";
    const telefon = "+905099129428";

    if (isbot(req.get("user-agent"))) {
      //Her sayfada
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: sitename,
        url: HOST_NAME,
        logo: HOST_NAME + "/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: telefon,
            contactType: "customer service",
            areaServed: "TR",
            availableLanguage: ["Turkish"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://www.twitter.com/",
        ],
      });
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: HOST_NAME + req.path,
        name: sitename,
        potentialAction: {
          "@type": "SearchAction",
          target: HOST_NAME + "/kategori?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      });
      // Breadcrumb
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: HOST_NAME,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Hakkımızda",
            item: HOST_NAME + "/hakkimizda",
          },
        ],
      });

      let menuS = await DB.Query(
        "SELECT url,name FROM kategori WHERE parents IS NULL"
      );
      return res.render("pages/seo/hakkimizda.hbs", {
        title: "Hakkımızda | " + sitename,
        layout: "seo-main.hbs",
        jsonLDdata: res.locals.jsonLd,
        ekmenu: menuS,
        image: HOST_NAME + "/assets/thumbnail.png",
        href: HOST_NAME,
        description:
          "Soylu İstif Makinaları A.Ş. Transpalet, istif makineleri ve kaldırma ekipmanlarının satışı, transpalet tekerleri ve yedek parça üretimi.",
      });
    }
    next();
  });
  router.get("/", async (req, res, next) => {
    console.log("isBot:", isbot(req.get("user-agent")));
    const sitename = "Soylu İstif Makinaları";
    const telefon = "+905099129428";

    if (isbot(req.get("user-agent"))) {
      //Her sayfada
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: sitename,
        url: HOST_NAME,
        logo: HOST_NAME + "/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: telefon,
            contactType: "customer service",
            areaServed: "TR",
            availableLanguage: ["Turkish"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://www.twitter.com/",
        ],
      });
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: HOST_NAME + req.path,
        name: sitename,
        potentialAction: {
          "@type": "SearchAction",
          target: HOST_NAME + "/kategori?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      });
      // Breadcrumb
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: HOST_NAME,
          },
        ],
      });
      let sqlUrunler = "SELECT name,url,resimler FROM urun";
      let urunler = (urunler = await DB.Query(sqlUrunler));
      let itemListElement = [];
      for (let i = 0; i < urunler.length; i++) {
        const urun = urunler[i];
        itemListElement.push({
          "@type": "ListItem",
          position: i + 1,
          url: HOST_NAME + "/urun/" + urun.url,
          name: urun.name,
        });
      }
      res.addJsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Tüm Ürünler",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: urunler.length,
        itemListElement: [...itemListElement],
      });
      let urunlerRs = urunler.map((a) => {
        return {
          ...a,
          resim:
            !!a.resimler && a.resimler.length > 0
              ? JSON.parse(a.resimler)[0]
              : "/assets/logosm.png",
        };
      });
      let menuS = await DB.Query(
        "SELECT url,name FROM kategori WHERE parents IS NULL"
      );
      return res.render("pages/seo/home.hbs", {
        title: sitename,
        layout: "seo-main.hbs",
        jsonLDdata: res.locals.jsonLd,
        ekmenu: menuS,
        image: HOST_NAME + "/assets/thumbnail.png",
        href: HOST_NAME,
        urunlerRs: urunlerRs,
        description:
          "Soylu İstif Makinaları A.Ş. Transpalet, istif makineleri ve kaldırma ekipmanlarının satışı, transpalet tekerleri ve yedek parça üretimi.",
      });
    }
    next();
  });
  return app.use("/", router);
};
