import React from 'react';
class MoodboardCanvas extends React.Component {
    constructor(props) {
        super(props)
        this.initCanvas = this.initCanvas.bind(this)
    }
    initCanvas() {
        const {
            tempo,
            energy,
            danceability,
            acousticness,
            valence,
            i,
            canvaswidth,
            canvasheight,
            title,
        } = this.props       
        var [BG,GR,TX] = colorGenerate(danceability,energy,valence,acousticness,tempo);
        var [letterSpacing,fontSize,fontWeight,fontName,backupFont] = fontGenerate(danceability,energy,valence,acousticness,tempo);
        letterSpacing /= 6;
        fontSize /= 6;
        let c = document.getElementById("littleCanvas"+i);
        c.onclick = () =>{
            //to do
        }
        let ctx = c.getContext("2d");
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, canvaswidth, canvasheight);
        ctx.fillStyle = GR;
        ctx.beginPath();
        ctx.arc(canvaswidth*0.75,canvasheight*0.5,canvasheight*0.2,0,2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvaswidth*0.5,canvasheight*0.2,canvasheight*0.15,0,2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvaswidth*0.2,canvasheight*0.8,canvasheight*0.12,0,2*Math.PI);
        ctx.fill();
        c.style.letterSpacing = letterSpacing+'px';
        ctx.font = fontWeight+' '+fontSize+'px '+fontName+','+backupFont;
        ctx.fillStyle = TX;
        ctx.textAlign = "center";
        ctx.fillText(title,(canvaswidth+letterSpacing)*0.5,canvasheight*0.5+fontSize/3);
        ctx.font = fontWeight+' '+(fontSize*0.5)+'px '+fontName+','+backupFont;
        ctx.fillStyle = TX;
        ctx.textAlign = "center";
        ctx.fillText(fontName,(canvaswidth+letterSpacing)*0.5,canvasheight*0.8);
    }

    componentDidMount() {
        this.initCanvas()
    }
    componentDidUpdate() {
        this.initCanvas()
    }
    static defaultProps = {
        canvaswidth: 320,
        canvasheight: 180,
        i: 1,
    }
    render() {
        const { canvaswidth, canvasheight, i } = this.props
        return (
            <canvas id={"littleCanvas"+i} width={canvaswidth} height={canvasheight}></canvas>
        )
    }
}


const colorGenerate = (dan, ene, val, aco, tem, bw = 0) => {
    //get liveness
    var tinycolor = require("tinycolor2");
    var liv,liv_flag;
    if(val < 0.4) liv_flag = 0.2 * dan + 0.8 * val;
    else liv_flag = 0.7 * dan + 0.3 * val;
    if(aco < 0.2) liv_flag += 0.2;

    if(liv_flag > 0.6) liv = 1;
    else if(liv_flag > 0.35) liv = 0.5;
    else liv = 0;

    //color generate
    var hue, sat, bri;
    var hue_arg, sat_arg, bri_arg;
    var text_flag = 1, graph_flag = 1, rand_flag = 1;
    var hue_flag = 1.0 - val * 0.5 - dan * 0.25 - ene * 0.25;

    if(Math.random() * 10 < 5) rand_flag = -1;

    if(hue_flag < 0.4) hue_arg = 0;
    else if(hue_flag < 0.6) hue_arg = 0.5;
    else hue_arg = 1;
    
    if(hue_arg === 0.5) hue = (Math.random() * 150 + 120 + 360) % 360;
    else if(hue_arg === 0) hue = (20 - rand_flag * hue_flag / 0.4 * 35 + rand_flag * Math.random() * 15 + 360) % 360;
    else if(hue_arg === 1) hue = (185 - rand_flag * (1 - hue_flag) / 0.4 * 110 + rand_flag * Math.random() * 100 + 360) % 360;

    if(aco > 0.5) sat_arg = (((dan * 1.2 + ene * 1.2 - aco * 2.4) * 100) * 0.5) + 50;
    else if(dan > 0.6) sat_arg = (((dan * 0.4 + ene * 0.6) * 100) * 0.5) + 50;
    else sat_arg = (((dan * 0.5 + ene * 0.5 - aco * 0.1) * 100) * 0.5) + 50;

    sat = (Math.random() * 10 - 5 + sat_arg) / 100;
    if(hue_arg === 0.5) sat *= 0.8;

    bri_arg = (((ene * 0.6 + aco * 0.4) * 100) * 0.3) + val * 120;
    bri = (Math.random() * 20 - 10 + bri_arg) / 100;
    if(bri > 0.95) bri = 0.95;

    if(sat > 0.7) sat = 0.7;
    if(sat < 0.2) sat = 0.2;

    if(sat*0.3 + 0.7 - bri < 0){
        text_flag = 0;
        graph_flag = 0;
    }

    var BG = tinycolor("hsv(" + hue + "," + sat + "," + bri + ")");
    var TX = (text_flag === 0) ? tinycolor("hsv(" + (hue + rand_flag * 10 + 360) % 360 + "," + 0.9 + "," + 0.2 + ")") : tinycolor("hsv(" + (hue + rand_flag * 10 + 360) % 360 + "," + 0.05 + "," + 0.95 + ")");
    var sat2, bri2;
    if(graph_flag === 0){
        sat2 = sat - 0.05;
        if(sat2 < 0) sat2 = 0;
        bri2 = bri + 0.1;
        if(bri2 > 1) bri2 = 1;
    }
    else{
        sat2 = sat + 0.05;
        if(sat2 > 1) sat2 = 1;
        bri2 = bri - 0.1;
        if(bri2 < 0) bri2 = 0;
    }
    var GR = tinycolor("hsv(" + (hue + rand_flag * 20 + Math.random() * 10 + 360) % 360 + "," + sat2 + "," + bri2 + ")");
    if(Math.random() > 0 && liv === 1) GR = GR.complement();
    
    if(bw === 1){
        if(Math.random() > 0.5){
            BG = tinycolor("black");
            TX = tinycolor("white");
        }
        else{
            TX = tinycolor("black");
            BG = tinycolor("white");
        } 
        if(Math.random() > 0.5) GR = GR.greyscale();
    }
    return [BG.toString('rgb'),GR.toString('rgb'),TX.toString('rgb')];
}

const fontGenerate = (dan, ene, val, aco, tem) => {
    var fontName, backupFont, r;
    if(aco > 0.8){
        if(Math.random() < 0.2 && ene >= 0.35 && val < 0.3) fontName = "ORADANO明朝";
        else fontName = "源云明体";
    }
    else if(aco>0.55){
        if(Math.random() < 0.5 && ene * 0.6+dan * 0.4 >= 0.85) fontName = "源界明朝";
        else if(Math.random() < 0.7  &&  ene * 0.6+dan * 0.4 >= 0.7) fontName = "装甲明朝";
        else fontName = "思源宋体";
    }
    else if(aco > 0.4){
        if(ene * 0.6 + dan * 0.4 >= 0.85){
            r = Math.random();
            if(r < 0.5) fontName = "源界明朝";
            else if(r < 0.75) fontName = "思源宋体";
            else fontName = "源石黑体";
        }
        else if(ene * 0.6 + dan * 0.4 >= 0.7){
            r = Math.random();
            if(r < 0.7) fontName = "装甲明朝";
            else if(r < 0.85) fontName = "思源宋体";
            else fontName = "源石黑体";
        }
        else fontName = "源石黑体";
    }
    else if(aco > 0.02){
        if(tem < 86 && val > 0.45){
            r = Math.random();
            if(r < 0.4) fontName = "思源黑体";
            else if(r < 0.6) fontName = "清松手写体";
            else if(r < 0.8) fontName = "粉圆";
            else fontName = "资源黑体";
        }
        else fontName = "思源黑体"; 
    }
    else{
        if(tem < 86 && val > 0.45){
            r = Math.random();
            if(r < 0.2) fontName = "未来莹黑";
            else if(r < 0.4) fontName = "思源黑体";
            else if(r < 0.6) fontName = "清松手写体";
            else if(r < 0.8) fontName = "粉圆";
            else fontName = "资源黑体";
        }
        else fontName = "未来莹黑";
    }

    if(fontName === "ORADANO明朝" || fontName === "源云明体" || fontName === "源界明朝" || fontName === "装甲明朝") backupFont = "思源宋体";
    else if(fontName === "源石黑体") backupFont = "思源黑体";
    else if(fontName === "粉圆") backupFont = "资源黑体";
    else backupFont = "未来莹黑";

    var letterSpacing = 0; //letter spacing
    var fontWeight = 300;   //font weight
    var fontSize = 60;    //font size

    letterSpacing = -0.7949 - 18.2496 * Math.log(ene);
    fontSize = 40 * Math.pow(7,ene);
    if(ene < 0.2) fontWeight = 100;
    else if(ene >= 0.9) fontWeight = 900;
    else fontWeight = Math.round(ene * 10) * 100;

    return [letterSpacing, fontSize, fontWeight, fontName, backupFont];
}

export default MoodboardCanvas;