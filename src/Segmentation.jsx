import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, Button, Grid, Typography, Slider } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import grey from '@material-ui/core/colors/grey';

function Length({ time }) {
    const secs = Math.round(time);
    const s = secs % 60, m = ~~(secs / 60);
    const ss = s < 10 ? `0${s}` : `${s}`, sm = m < 10 ? `0${m}` : `${m}`;
    return `${sm}:${ss}`;
}

const useStyles = makeStyles({
    grid: {
        height: '100%',
    },
    progress: {
        width: 600,
    },
    text: {
        marginTop: '1em',
        marginBottom: '8em',
    },
    content: {
        marginTop: '26vh',
    },
    time: {
        marginLeft: 40,
    },
    sections: {
        marginTop: -16,
        position: 'relative',
        height: 16,
    },
    section: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        border: '1px solid #121212',
        cursor: 'pointer',
        '&:hover': {
            outline: '1px solid #BB86FC',
            border: '1px solid #BB86FC',
        },
    },
});

function Segmentation({
    setStep,
    data: {
        song,
        name: artist,
        album: [{ al_name: album }],
        sections,
        audio_features: [{ duration_s: length }],
        music_url: url,
    },
}) {
    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep('Generation');
    }, [setStep]);
    const audio = useMemo(() => {
        return new Audio(url);
    }, [url]);
    const [currentTime, setCurrentTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
        if (!audio) return;
        const onUpdate = () => setCurrentTime(audio.currentTime);
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        audio.addEventListener('timeupdate', onUpdate);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        return () => {
            audio.removeEventListener('timeupdate', onUpdate);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [audio]);
    const onSeek = useCallback((_, newVal) => {
        audio.currentTime = newVal;
    }, [audio]);
    const play = useCallback(() => audio.play(), [audio]);
    const pause = useCallback(() => audio.pause(), [audio]);
    
    return (
        <Grid
            container
            spacing={4}
            className={classes.grid}
        >
            <Grid item xs />
            <Grid item xs={8}>
                <Typography
                    align="center"
                    color="textSecondary"
                    classes={{ root: classes.text }}
                >
                    {song} / {artist} - {album}
                </Typography>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item container direction="column" xs>
                        <Grid item>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                调整歌曲分段
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                            >
                                双击段落以调整起止时间，点击加号以在选中段落后新建段落
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={nextStep}
                        >
                            继续创建
                        </Button>
                    </Grid>
                </Grid>
                <div className={classes.content}>
                    <Typography className={classes.time} color="textPrimary" variant="body2">
                        <Length time={currentTime}/>
                        &nbsp;/&nbsp;
                        <Length time={length}/>
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            {playing ? (
                                <PauseIcon
                                    style={{
                                        color: grey[100],
                                        cursor: 'pointer',
                                    }}
                                    onClick={pause}
                                />
                            ) : (
                                <PlayArrowIcon
                                    style={{
                                        color: grey[100],
                                        cursor: 'pointer',
                                    }}
                                    onClick={play}
                                />
                            )}
                        </Grid>
                        <Grid item xs>
                            <Slider value={currentTime} onChange={onSeek} max={length}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <PlayArrowIcon style={{ color: "#121212" }}/>
                        </Grid>
                        <Grid item xs>
                            <div className={classes.sections}>
                                {sections.map(({ start }, i) => (
                                    <div
                                        key={i}
                                        className={classes.section}
                                        style={{
                                            left: `${start / length * 100}%`,
                                            right: `${100 - (i === sections.length - 1 ? length : sections[i + 1].start) / length * 100}%`,
                                            // backgroundColor: mode === 0 ? '#03DAC5' : '#F2994A',
                                            backgroundColor: '#03DAC5',
                                        }}
                                    />
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <PlayArrowIcon style={{ color: "#121212" }}/>
                        </Grid>
                        <Grid item xs>
                            <Typography color="textSecondary" variant="body2" style={{ marginTop: -16 }}>
                                蓝绿色为普通段，橙色为高潮段，鼠标右击色块可在普通/高潮段状态间切换
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            <Grid item xs />
        </Grid>
    )
}

export default Segmentation;
