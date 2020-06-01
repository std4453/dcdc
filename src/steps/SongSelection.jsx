import React, { useCallback } from 'react';
import { makeStyles, Button, TextField, Grid, Link, Container } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import logo from '../assets/logo-colored.svg';

const useStyles = makeStyles({
    form: {
        height: '100%',
    },
    grid: {
        height: '100%',
    },
    input: {
        width: 500,
    },
});

function SongSelection({ setId, setStep }) {
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const onSubmit = useCallback(({ id }) => {
        setId(id);
        setStep('Loading');
    }, [setStep, setId]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Grid
                container
                justify="center"
                spacing={4}
                className={classes.grid}
                alignItems="center"
                direction="column"
            >
                <Grid item>
                    <img src={logo} alt="" height="51" />
                </Grid>
                <Grid item container
                    spacing={1}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <TextField
                            name="id"
                            label="网易云音乐ID"
                            variant="outlined"
                            size="small"
                            classes={{ root: classes.input }}
                            inputRef={register({ required: true })}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            type="submit"
                        >
                            开始创建
                        </Button>
                    </Grid>
                </Grid>
                <Container maxWidth = 'sm'>
                    <Link
                        variant = "caption"
                        href="#"
                        color="secondary"
                    >
                        如何获取?
                    </Link>
                </Container>
            </Grid>
        </form>
    )
}

export default SongSelection;
