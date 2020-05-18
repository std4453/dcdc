import React, { Component } from 'react';

class MoodboardCanvas extends React.Component {
    constructor(props) {
        super(props)
        this.initCanvas = this.initCanvas.bind(this)
    }
    initCanvas() {
        const {
            i,
            BG,
            GR,
            TX,
            ls,
            fw,
            fs,
            fontName,
            backupFont,
            canvaswidth,//原点坐标
            canvasheight,
            title,
        } = this.props
        let c = document.getElementById("littleCanvas"+i)
        let ctx = c.getContext("2d");
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, canvaswidth, canvasheight);
        ctx.fillStyle = GR;
        ctx.beginPath();
        ctx.arc(canvaswidth*0.75,canvasheight*0.5,canvasheight*0.2,0,2*Math.PI);
        ctx.fill()
        ctx.beginPath();
        ctx.arc(canvaswidth*0.5,canvasheight*0.2,canvasheight*0.15,0,2*Math.PI);
        ctx.fill()
        ctx.beginPath();
        ctx.arc(canvaswidth*0.2,canvasheight*0.8,canvasheight*0.12,0,2*Math.PI);
        ctx.fill()
        c.style.letterSpacing = ls+'px';
        ctx.font = fw+' '+fs+'px '+fontName+','+backupFont;
        ctx.fillStyle = TX;
        ctx.textAlign = "center";
        ctx.fillText(title,(canvaswidth+ls)*0.5,canvasheight*0.5+fs/3);
        ctx.font = fw+' '+(fs*0.5)+'px '+fontName+',SC';
        ctx.fillStyle = TX;
        ctx.textAlign = "center";
        ctx.fillText(fontName,(canvaswidth+ls)*0.5,canvasheight*0.8);
    }

    componentDidMount() {
        this.initCanvas()
    }
    componentDidUpdate() {
        this.initCanvas()
    }
    static defaultProps = {
        i: 1,
        canvaswidth: 320,
        canvasheight: 180,
        BG: '#CCCCFF',
        GR: '#BB86FC',
        TX: '#000000',
        ls: '',
        fw: 300,
        fs: 30,
        fontName: '默认字体',
        backupFont: '备用字体',
        title: '歌名'
    }
    render() {
        const { canvaswidth, canvasheight, i } = this.props
        return (
            <canvas id={"littleCanvas"+i} width={canvaswidth} height={canvasheight}></canvas>
        )
    }
}

export default MoodboardCanvas;