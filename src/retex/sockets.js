import Rete from 'rete';

const sockets = new Proxy({
    any: new Rete.Socket('any'),
}, {
    get(obj, prop) {
        if (!(prop in obj)) {
            obj[prop] = new Rete.Socket(prop);
            obj[prop].combineWith(obj.any);
        }
        return obj[prop];
    }
});

export default sockets;
