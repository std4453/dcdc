const config = [
    {
        name: 'Color set',
        type: 'folder',
        children: [
            { name: 'Text color', type: 'color', path: 'textColor' },
            { name: 'Background color', type: 'color', path: 'backgroundColor' },
            { name: 'Graphic color', type: 'color', path: 'graphicColor' },
        ],
    },
    {
        name: 'Type',
        type: 'folder',
        children: [
            { name: 'Font family', type: 'string', path: 'fontFamily' },
            { name: 'Font weight', type: 'number', path: 'fontWeight', min: 100, max: 900, step: 100 },
            { name: 'Font size', type: 'number', path: 'size' },
            { name: 'Letter spacing', type: 'number', path: 'letterSpacing' },
            { name: 'Maximum split', type: 'number', path: 'splitMax' },
            { name: 'Size randomness', type: 'number', path: 'sizeRandom' },
            { name: 'Rotate randomness', type: 'number', path: 'rotateRandom' },
        ],
    },
    {
        name: 'Layout',
        type: 'folder',
        children: [
            {
                name: 'Type A',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.a.enabled' },
                    { name: 'Minimum distance', type: 'number', path: 'modes.a.minDist' },
                    { name: 'Maximum distance', type: 'number', path: 'modes.a.maxDist' },
                ],
            },
            {
                name: 'Type B',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.b.enabled' },
                    { name: 'Line spacing', type: 'number', path: 'modes.b.lineSpacing' },
                ],
            },
        ],
    }
];

export default config;
