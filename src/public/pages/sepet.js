import {myloc} from '../main.js';

const getUrunler = (ids)=>{
    return $.ajax({
        type: "POST",
        url: "/sepet/get-urunler",
        data: {ids:ids},
        dataType: "json",
    });
}
const getTemp = async (temname)=>{
    const temp = await $.ajax({
        type: "POST",
        url: "/templates/get-temp",
        data: {folderpath:temname}
    });
    return temp;
}
export const SepetInit = async() => {
    const sepet = myloc.getItem('sepet');
    const ids = sepet.map(item=>item.id);
    let urunler = await getUrunler(ids)
    urunler = urunler.map(urun=>{
        const {adet} = sepet.find(it=>it.id == urun.id);
        let resimler = JSON.parse(urun.resimler);
        return {
            ...urun,
            resim:!!resimler && !!resimler[0] ? "/uploads" + resimler[0] : "/assets/urun/resim_yok.webp",
            adet:adet
        }
    })
    const strTemp = await getTemp("sepeturunrow.html");
    const rendred = Handlebars.compile(strTemp);
    $(".spetbfyLeft").html(rendred({urunler:urunler}))

}