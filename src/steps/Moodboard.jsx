import React, { useCallback, useState, useEffect } from 'react';
import { makeStyles, withStyles, Button, Grid, Typography } from '@material-ui/core';
import initCanvas from './MoodboardCanvas';

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
});

const CanvasButton = withStyles({
    root: {
        boxShadow: 'none',
        backgroundColor: '#121212',
        padding: '0 0',
        '&:hover': {
            boxShadow: '0 0 0 0.06rem #BBBBBB',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.06rem #BB86FC',
        },
    },
})(Button);

const [canvaswidth, canvasheight] = [320, 180];

function Moodboard({
    setStep,
    setMoodboard,
    data: {
        song,
        artist,
        album: { al_name: album },
        featuress: { tempo, energy, danceability, acousticness, valence }
    },
}) {
    const classes = useStyles();
    const [index, selectCanvas] = useState(-1);
    const [mb, setMB] = useState([]);
    useEffect(() => {
        setMB(initCanvas(tempo, energy, danceability, acousticness, valence, song, canvaswidth, canvasheight));
    }, [acousticness, danceability, energy, song, tempo, valence]);
    const nextStep = useCallback(() => {
        setStep('Segmentation');
        setMoodboard(mb[index]);
    }, [mb, index, setStep, setMoodboard]);
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
                <Grid container
                    alignItems="center"
                    justify="space-evenly"
                    spacing={6}
                >
                    <Grid item container direction="column" xs>
                        <Grid item>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                选择氛围板
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                            >
                                为您的歌词动画选择外观风格
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
                <Grid container
                    alignItems="center"
                    justify="space-between"
                    spacing={6}
                >
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas1"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(1)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas2"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(2)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas3"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(3)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas4"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(4)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas5"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(5)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas6"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(6)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas7"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(7)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas8"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(8)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                    <Grid item>
                        <CanvasButton>
                            <canvas
                                id={"littleCanvas9"}
                                width={canvaswidth}
                                height={canvasheight}
                                onClick={() => selectCanvas(9)}
                            >
                            </canvas>
                        </CanvasButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs />
        </Grid>
    )
}

export default Moodboard;
