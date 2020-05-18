import React, { useCallback } from 'react';
import { makeStyles, Button, Grid, Typography } from '@material-ui/core';
import MoodboardCanvas from './MoodboardCanvas';

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

function Moodboard({ setStep, 
    data: { song, name: artist, album: [{ al_name: album }], 
    audio_features: [{ tempo: tempo, energy: energy, danceability: danceability, acousticness: acousticness, valence: valence }]  } }
    ) {
    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep('Segmentation');
    }, [setStep]);
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
                <Grid container alignItems="center" justify="space-between">
                <Grid item>
                    <MoodboardCanvas
                        title = 'First Board'
                        i = '1'
                        >
                    </MoodboardCanvas>
                </Grid>
                <Grid item>
                    <MoodboardCanvas
                        title = 'Second Board'
                        i = '2'
                        >
                    </MoodboardCanvas>
                </Grid>
                <Grid item>
                    <MoodboardCanvas
                        title = 'Thrid Board'
                        i = '3'
                        >
                    </MoodboardCanvas>
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs />
        </Grid>
    )
}

export default Moodboard;
