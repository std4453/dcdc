function Length({ time }) {
    const secs = Math.round(time);
    const s = secs % 60, m = ~~(secs / 60);
    const ss = s < 10 ? `0${s}` : `${s}`, sm = m < 10 ? `0${m}` : `${m}`;
    return `${sm}:${ss}`;
}

export default Length;
