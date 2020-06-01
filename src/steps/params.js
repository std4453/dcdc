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
                    { name: 'Minimum distance', type: 'number', path: 'modes.a.minDist', step: 0.01 },
                    { name: 'Maximum distance', type: 'number', path: 'modes.a.maxDist', step: 0.01 },
                ],
            },
            {
                name: 'Type B',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.b.enabled' },
                    { name: 'Line spacing', type: 'number', path: 'modes.b.lineSpacing', step: 0.01 },
                ],
            },
            {
                name: 'Type C',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.c.enabled' },
                    { name: 'Minimum angle', type: 'number', path: 'modes.c.minAngle', step: 0.01 },
                    { name: 'Maximum angle', type: 'number', path: 'modes.c.maxAngle', step: 0.01 },
                ],
            },
            {
                name: 'Type D',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.d.enabled' },
                    { name: 'Minimum distance', type: 'number', path: 'modes.d.minDist', step: 0.01 },
                    { name: 'Maximum distance', type: 'number', path: 'modes.d.maxDist', step: 0.01 },
                ],
            },
            {
                name: 'Type E',
                type: 'folder',
                children: [
                    { name: 'Enabled', type: 'boolean', path: 'modes.e.enabled' },
                    { name: 'Minimum radius', type: 'number', path: 'modes.e.minR', min: 0, max: 1, step: 0.01 },
                    { name: 'Scale', type: 'number', path: 'modes.e.scale', step: 0.01 },
                ],
            },
        ],
    }
];

export default config;
