import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, Button, Grid, Typography, Slider } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import grey from '@material-ui/core/colors/grey';
import Draggable from 'react-draggable'; // The default
import useDimensions from "react-use-dimensions";
import * as _ from 'lodash';
import Length from './Length';

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
    edge: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 2,
        width: 6,
        marginLeft: -3,
        '&:hover': {
            backgroundColor: '#BB86FC',
        },
        cursor: 'ew-resize',
    },
});

function Segmentation({
    setStep, next, prev,
    setData,
    data: { sections },
    data,
}) {
    const [localData, setLocalData] = useState(data);
    const {
        song,
        artist,
        album: { al_name: album },
        sections: localSections,
        featuress: { duration_s: length },
        url,
    } = localData;

    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep(next);
    }, [setStep, next]);
    const prevStep = useCallback(() => {
        setStep(prev);
    }, [setStep, prev]);
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

    const [ref, { width }] = useDimensions();

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
                <Grid container alignItems="center" justify="space-between" spacing={2}>
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
                                拖动段落以调整起止时间
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="primary"
                            disableElevation
                            onClick={prevStep}
                        >
                            上一步
                        </Button>
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
                        <Length time={currentTime} />
                        &nbsp;/&nbsp;
                        <Length time={length} />
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
                            <Slider value={currentTime} onChange={onSeek} max={length} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <PlayArrowIcon style={{ color: "#121212" }} />
                        </Grid>
                        <Grid item xs>
                            <div className={classes.sections} ref={ref}>
                                {localSections.map(({ start, climax }, i) => (
                                    <div
                                        key={`section-${i}`}
                                        className={classes.section}
                                        style={{
                                            left: `${start / length * 100}%`,
                                            right: `${100 - (i === localSections.length - 1 ? length : localSections[i + 1].start) / length * 100}%`,
                                            backgroundColor: climax === 0 ? '#03DAC5' : '#F2994A',
                                        }}
                                        onClick={() => {
                                            const newData = _.cloneDeep(localData);
                                            newData.sections[i].climax = 1 - climax;
                                            setLocalData(newData);
                                            setData(newData);
                                        }}
                                    />
                                ))}
                                {new Array(sections.length - 1).fill(0).map((_, i) => i + 1).map(i => (
                                    <Draggable
                                        key={`handle=${i}-${sections[i].start}`}
                                        axis="x"
                                        bounds={{
                                            left: -(sections[i].start - sections[i - 1].start) / length * width,
                                            right: (i === sections.length - 1 ? length : sections[i + 1].start - sections[i].start) / length * width,
                                        }}
                                        onDrag={(__, { x }) => {
                                            const newData = _.cloneDeep(data);
                                            newData.sections[i].start += x / width * length;
                                            const end = i === newData.sections.length - 1 ? length : newData.sections[i + 1].start;
                                            newData.sections[i].duration = end - newData.sections[i].start;
                                            if (i > 0) newData.sections[i - 1].duration = newData.sections[i].start - newData.sections[i - 1].start;
                                            setLocalData(newData);
                                        }}
                                        onStop={() => {
                                            setData(localData);
                                        }}
                                    >
                                        <div
                                            className={classes.edge}
                                            style={{
                                                left: sections[i].start / length * width, // unchanged while dragging
                                            }}
                                        />
                                    </Draggable>
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <PlayArrowIcon style={{ color: "#121212" }} />
                        </Grid>
                        <Grid item xs>
                            <Typography color="textSecondary" variant="body2" style={{ marginTop: -16 }}>
                                蓝绿色为普通段，橙色为高潮段，鼠标左击色块可在普通/高潮段状态间切换
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
