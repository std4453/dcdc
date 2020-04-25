export default ({ gui, invalidate }) => {
    const options = {
        randomness: 2,
    };

    const folder = gui.addFolder('split');
    folder.add(options, 'randomness', 0, 3, 0.01).onChange(invalidate);
    folder.open();

    const fn = (text, parts) => {
        const step = text.length / parts;
        const deltas = [0, ...new Array(parts - 1).fill(0).map(() => (Math.random() - 0.5) * 2 * options.randomness), 0];
        const splitted = [];
        for (let i = 0; i < parts; ++i) {
            const begin = Math.round(i * step + deltas[i]);
            const end = Math.round((i + 1) * step + deltas[i + 1]);
            splitted.push(text.substring(begin, end));
        }
        return splitted;
    }

    return { options, folder, fn };
};
