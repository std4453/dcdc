import React, { useCallback } from 'react';
import { TextField, makeStyles, Grid, Typography, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles({
    grid: {
        height: '100%',
        width: 800,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    input: {
    },
});

function EditLyrics({
    setStep, next,
    data: { lrc },
    setData,
}) {
    const classes = useStyles();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            lrc,
        },
    });
    const onSubmit = useCallback(({ lrc }) => {
        setData(data => ({
            ...data,
            lrc
        }));
        setStep(next);
    }, [setData, setStep, next]);
    return (
        <Grid
            container
            justify="center"
            spacing={8}
            className={classes.grid}
            alignItems="stretch"
            direction="column"
        >
            <Grid item container alignItems="center" justify="space-between" spacing={2}>
                <Grid item container direction="column" xs>
                    <Grid item>
                        <Typography
                            color="textPrimary"
                            variant="h4"
                        >
                            修改歌词
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            以 LRC 格式输入歌词
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        onClick={handleSubmit(onSubmit)}
                    >
                        继续创建
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <form>
                    <TextField
                        name="lrc"
                        label="歌词内容（LRC格式）"
                        variant="outlined"
                        size="small"
                        multiline
                        fullWidth
                        rowsMax={24}
                        className={classes.input}
                        inputRef={register({ required: true })}
                    />
                </form>
            </Grid>
        </Grid>
    );
}

export default EditLyrics;
