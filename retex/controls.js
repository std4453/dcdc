// import React, { useCallback } from 'react';
// import Rete from 'rete';
// import { Slider, Typography, createMuiTheme, ThemeProvider } from '@material-ui/core';

// function NumberControlInner({ id, displayName, defaultVal, emitter, putData }) {
//     const onChange = useCallback((_, value) => {
//         putData(id, value);
//         emitter.trigger("process");
//     }, [id, emitter]);
//     const onPointerMove = useCallback((e) => {
//         e.stopPropagation();
//     }, []);

//     return (
//         <ThemeProvider theme={theme}>
//             <Typography gutterBottom>
//                 {displayName}
//             </Typography>
//             <Slider
//                 defaultValue={defaultVal}
//                 onChange={onChange}
//                 onPointerMove={onPointerMove}
//             />
//         </ThemeProvider>
//     );
// }

// class NumberControl extends Rete.Control {
//     constructor(emitter, key, displayName, defaultVal) {
//         super(key);
//         this.render = 'react';
//         this.component = NumberControlInner;
//         this.props = { emitter, defaultVal, displayName, id: key, putData: this.putData.bind(this) };
//     }
// }

const controls = {
    // number: NumberControl,
};

export default controls;
