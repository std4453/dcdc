import Rete from 'rete';

const sockets = new Proxy({}, {
    get(obj, prop) {
        if (!(prop in obj)) {
            obj[prop] = new Rete.Socket(prop);
        }
        return obj[prop];
    }
});

export default sockets;
