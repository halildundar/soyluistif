export const CtrlPanelDashboardRender = async (req, res) => {
  res.render("pages/ctrlpanel/dashboard.hbs", {
    title: "Anasayfa",
    scriptname: `ctrlpanel-main`,
    scripts:`<script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`
  });
};
export const CtrlPanelUrunRender = async (req, res) => {
  res.render("pages/ctrlpanel/urun.hbs", {
    title: "Ürünler",
    scriptname: `ctrlpanel-main`,
    styles:`<link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css"> <link
  href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.bubble.css"
  rel="stylesheet"
/>`,
    scripts:`  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js"></script>`
  });
};

export const CtrlPanelSlaytRender = async (req, res) => {
  res.render("pages/ctrlpanel/slaytlar.hbs", {
    title: "Slaytlar",
    scriptname: `ctrlpanel-main`,
    styles:`<link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">`,
    scripts:`  <script defer src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script> 
    <script defer src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`
  });
};

