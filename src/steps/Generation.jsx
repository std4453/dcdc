import { makeStyles, Grid, Typography, Button, Slider } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DatGui, { DatFolder, DatString } from 'react-dat-gui';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import grey from '@material-ui/core/colors/grey';
import config from './params';
import Length from './Length';
import exec from '../retex/exec';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    side: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 4,
        width: 345,
    },
    canvasContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'calc(100vw - 345px)',
        height: 'calc(100vh - 195px)',
        backgroundColor: '#222',
        overflow: 'hidden',
    },
    canvas: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    bottom: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 195,
        width: 'calc(100vw - 345px)',
        padding: '20px 30px 40px 30px',
        boxSizing: 'border-box',
    },
    sections: {
        position: 'relative',
        height: 16,
    },
    section: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        border: '1px solid #121212',
    },
    bottomInner: {
        height: '100%',
    },
    title: {
        lineHeight: 2.5,
        fontWeight: 300,
        paddingLeft: 16,
    },
});

function Generation({
    moodboard,
    data,
    data: {
        song,
        artist,
        album: { al_name: album },
        sections,
        featuress: { duration_s: length },
        url,
    },
    initialRef: { current: initialGraph },
    generationRef: { current: generationGraph },
}) {
    const classes = useStyles();

    const [params, setParams] = useState(null);
    useEffect(() => {
        exec(initialGraph, {
            moodboard,
            data,
        }).then(setParams);
    }, [data, moodboard, initialGraph]);
    const [canvas, setCanvas] = useState(null);
    useEffect(() => {
        if (!params || !canvas) return;
        exec(generationGraph, {
            canvas,
            ...params,
        });
    }, [canvas, params, generationGraph]);
    const convert = useMemo(() => {
        const convert = ({ name, path, type, children }) => {
            switch (type) {
                case 'folder': return (
                    <DatFolder title={name} closed={false}>
                        {children.map(convert)}
                    </DatFolder>
                );
                case 'string': return (
                    <DatString path={path} label={name} />
                );
                default: return null;
            }
        };
        return convert;
    }, []);

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

    const currentSegment = useMemo(() => {
        for (let i = 0; i < sections.length; ++i) {
            const { start, duration } = sections[i];
            if (currentTime < start + duration) return i;
        }
        return sections.length - 1;
    }, [currentTime, sections]);

    return (
        <div className={classes.root}>
            <div className={classes.canvasContainer}>
                <canvas className={classes.canvas} ref={setCanvas} />
            </div>
            <div className={classes.side}>
                <Typography color="textPrimary" variant="h6" classes={{ root: classes.title }}>
                    段落 {currentSegment + 1}
                </Typography>
                <DatGui
                    data={params}
                    onUpdate={(newData) => {
                        newData = { ...data, ...newData };
                        setParams(newData);
                    }}
                    style={{
                        position: 'relative',
                        backgroundColor: '#1A1A1A',
                        right: 0,
                        left: 8,
                        width: 'calc(100% - 8px)',
                    }}
                >
                    {config.map(convert)}
                </DatGui>
            </div>
            <div className={classes.bottom}>
                <Grid container direction="column" justify="space-between" classes={{ root: classes.bottomInner }}>
                    <Grid item container>
                        <Grid item xs={3}>
                            <Typography color="textSecondary">
                                {song} / {artist} - {album}
                            </Typography>
                        </Grid>
                        <Grid item xs container justify="center" spacing={4}>
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
                            <Grid item>
                                <FullscreenIcon
                                    style={{
                                        color: grey[100],
                                        cursor: 'pointer',
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={3} container justify="flex-end" spacing={2}>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    换个效果
                            </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    下载视频
                            </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" spacing={0}>
                        <Grid item>
                            <Typography color="textPrimary" variant="body2">
                                <Length time={currentTime} />
                                &nbsp;/&nbsp;
                                <Length time={length} />
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Slider value={currentTime} onChange={onSeek} max={length} />
                        </Grid>
                        <Grid item>
                            <div className={classes.sections}>
                                {sections.map(({ start, climax }, i) => {
                                    const end = (i === sections.length - 1 ? length : sections[i + 1].start);
                                    return (
                                        <div
                                            key={`section-${i}`}
                                            className={classes.section}
                                            style={{
                                                left: `${start / length * 100}%`,
                                                right: `${(1 - end / length) * 100}%`,
                                                backgroundColor: climax === 0 ? '#03DAC5' : '#F2994A',
                                                opacity: i === currentSegment ? 1.0 : 0.2,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default Generation;
