import React, { useCallback } from 'react';
import { makeStyles, Button, Grid, Typography } from '@material-ui/core';

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

function Segmentation({ setStep, data: { song, name: artist, album: [{ al_name: album }] } }) {
    const classes = useStyles();
    const nextStep = useCallback(() => {
        setStep('Generation');
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
            </Grid>
            <Grid item xs />
        </Grid>
    )
}

export default Segmentation;
