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
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(80,80,80,.1)',
            outline: '1px solid slategrey'
        }
    }
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
    const [items, setItems] = useState(Array.from({length: 200}));;
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
                                选择情绪板
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
                <div style={{height:'80vh', overflow:'hidden auto'}}>
                    <Grid container 
                        alignItems="center" 
                        justify="space-between" 
                        spacing={6}
                        className={classes.grid}
                    >
                        {items.map((i, index) => (
                            <Grid item key = {index}>
                                <CanvasButton>
                                    <canvas
                                        id={"littleCanvas"+(index+1)}
                                        width={canvaswidth}
                                        height={canvasheight}
                                        onClick={()=>selectCanvas(index+1)}
                                    >
                                    </canvas>
                                </CanvasButton>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
            <Grid item xs />
        </Grid>
    )
}

export default Moodboard;
