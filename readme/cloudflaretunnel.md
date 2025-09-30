  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "serve": "concurrently \"webpack -w\" \"npm run serve --prefix dist\"",
    "build": "webpack",
    "start": "node server.js"
  },

  "scripts": {
    "serve": "nodemon server.js -e js,hbs,json --ignore ./public/",
    "start": "node server.js"
  },

  önce domaini al ve cloud flare ekle
C://cloudflare/cloudflare.exe olarak yerleştir ve path değişkenlerine ekle
path değişkeni Başlat → “Gelişmiş sistem ayarları” → “Ortam Değişkenleri” → Path’i düzenle.
"cloudflared --version" ile path test et
"cloudflared login"
ile bağlan

"cloudflared tunnel create myapp" 
"cloudflared tunnel route dns myapp myapp.example.com"
ile C:\Users\<KullanıcıAdı>\.cloudflared\<TUNNEL-ID>.json da oluşturacak

confi.yml dosyasını oluştur ve 
"cloudflared tunnel run myapp"


domain yoksa


cloudflared tunnel --url http://localhost:3000 bu da doğrudan çalıştırma