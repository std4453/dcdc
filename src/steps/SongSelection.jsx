import React, { useCallback, useRef } from 'react';
import { makeStyles, Button, TextField, Grid, Link, Container, Popover } from '@material-ui/core';
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

function SongSelection({ next, setId, setStep }) {
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const onSubmit = useCallback(({ id }) => {
        setId(id);
        setStep(next);
    }, [setStep, setId, next]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const divRef = useRef();
    const handleClick = () => {
        setAnchorEl(divRef.current);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "popover" : undefined;
    return (
        <form ref={divRef} onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                        aria-describedby={id}
                        variant = "caption"
                        color="secondary"
                        onClick={handleClick}
                    >
                        如何获取?
                    </Link>
                    <img
                        src={"如何获取.jpg"}
                        alt="如何获取"
                        width="0"
                    />
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "center",
                            horizontal: "center"
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }}
                    >
                        <img
                            src={"如何获取.jpg"}
                            alt="如何获取"
                            width="800"
                        />
                    </Popover>
                </Container>
            </Grid>
        </form>
    )
}

export default SongSelection;
