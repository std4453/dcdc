parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Focm":[function(require,module,exports) {
function t(t,o){return n(t)||r(t,o)||h(t,o)||e()}function e(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function r(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var r=[],n=!0,o=!1,i=void 0;try{for(var a,l=t[Symbol.iterator]();!(n=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);n=!0);}catch(c){o=!0,i=c}finally{try{n||null==l.return||l.return()}finally{if(o)throw i}}return r}}function n(t){if(Array.isArray(t))return t}function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach(function(e){a(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function l(t){return f(t)||u(t)||h(t)||c()}function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function f(t){if(Array.isArray(t))return y(t)}function v(t){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=h(t))){var e=0,r=function(){};return{s:r,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,o,i=!0,a=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return i=t.done,t},e:function(t){a=!0,o=t},f:function(){try{i||null==n.return||n.return()}finally{if(a)throw o}}}}function h(t,e){if(t){if("string"==typeof t)return y(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(t,e):void 0}}function y(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var d=document.querySelector("#container"),b=document.createElement("canvas");b.width=1920,b.height=1080,b.style.transform="scale(".concat(1/window.devicePixelRatio,")"),b.style.transformOrigin="left top",d.appendChild(b);var p=b.getContext("2d"),g=function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=n.size,i=void 0===o?20:o,a=n.dir,l=void 0===a?"horizontal":a,c=n.align,u=void 0===c?"begin":c,f=n.color,v=void 0===f?"#000":f,h=n.rotate,y=void 0===h?0:h;p.save(),p.translate(e,r),p.rotate(y);var d=0,b=0;if("middle"===u)switch(l){case"horizontal":d-=i*t.length/2;break;case"vertical":b-=i*t.length/2}if("end"===u)switch(l){case"horizontal":d-=i*t.length;break;case"vertical":b-=i*t.length}p.textBaseline={horizontal:"middle",vertical:"top"}[l],p.textAlign={horizontal:"start",vertical:"center"}[l],p.fillStyle=v,p.font="bold ".concat(i,"px 'Hiragino Mincho Pro'");var g,m=s(t.split(""));try{for(m.s();!(g=m.n()).done;){var w=g.value;switch(p.fillText(w,d,b),l){case"horizontal":d+=i;break;case"vertical":b+=i}}}catch(O){m.e(O)}finally{m.f()}p.restore()},m=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n,o=(e=e.map(function(t){return"object"===v(t)?t:{value:t}})).map(function(t){var e=t.weight;return void 0===e?1:e}).reduce(function(t,e){return t+e}),i=Math.random()*o,a=s(e);try{for(a.s();!(n=a.n()).done;){var l=n.value,c=l.value,u=l.weight,f=void 0===u?1:u;if(f>=i)return c;i-=f}}catch(h){a.e(h)}finally{a.f()}return e[e.length-1].value},w=function(t,e){for(var r=(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}).randomness,n=void 0===r?2:r,o=t.length/e,i=[0].concat(l(new Array(e-1).fill(0).map(function(){return 2*(Math.random()-.5)*n})),[0]),a=[],c=0;c<e;++c){var u=Math.round(c*o+i[c]),f=Math.round((c+1)*o+i[c+1]);a.push(t.substring(u,f))}return a},O=1920,S=1080,z=function(t,e){switch(arguments.length>2&&void 0!==arguments[2]?arguments[2]:"horizontal"){case"horizontal":return{x:t*O,y:e*S};case"vertical":return{x:e*O,y:t*S}}},j=function(t,e){return 1/(t+1)*(e+1)},x=function(t,e){return Math.random()*(e-t)+t},A=function(t,e){var r=t.x,n=t.y;return{x:r+e.x,y:n+e.y}},P=function(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];switch(r&&(e={vertical:"horizontal",horizontal:"vertical"}[e]),e){case"horizontal":return{x:n?-t:t,y:0};case"vertical":return{x:0,y:t}}},E=function(t,e){var r=e.size,n=e.splitOptions,o=void 0===n?{}:n,a=e.fontOptions,l=void 0===a?{}:a,c=t.length>12?2:m({value:1,weight:.7},{value:2,weight:.3}),u=m("vertical","horizontal"),f=x(.6,.8);w(t,c,o).forEach(function(t,e){var n=z(.5,(j(c,e)-.5)*f+.5,u),o=n.x,a=n.y;g(t,o,a,i({size:r,dir:u,align:"middle"},l))})},I=function(){p.fillStyle="rgba(242, 242, 242, 0.3)",p.fillRect(0,0,O,S)},M=function(t,e){return e?1-t:t},k=function(e,r){var n=r.size,o=r.splitOptions,a=void 0===o?{}:o,l=r.fontOptions,c=void 0===l?{}:l,u=m("vertical","horizontal"),f=m("begin","end"),v=m("left","right"),s=t(m({value:[.35,.43],weight:3},{value:[.25,.35],weight:2},{value:[.1,.25],weight:1}),2),h=s[0],y=s[1],d=M(x(.1,.25),"end"===f),b=M(x(h,y),"right"===v),p=z(d,b,u),O=P(1.5*n*("left"===v?1:-1),u,!0);w(e,2,a).forEach(function(t){var e=p,r=e.x,o=e.y;g(t,r,o,i({size:n,dir:u,align:f},c)),p=A(p,O)})},D=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.size,o=r.splitOptions,a=void 0===o?{}:o,l=r.fontOptions,c=void 0===l?{}:l,u=Math.PI*x(-.1,0),f=m("horizontal","vertical"),v=t(m({value:[.25,.35],weight:3},{value:[.35,.45],weight:2},{value:[.45,.5],weight:.5}),2),s=v[0],h=v[1],y=x(s,h),d=t(m({value:[.15,.25],weight:3},{value:[.25,.4],weight:2}),2),b=d[0],p=d[1],O=x(b,p);w(e,2,a).forEach(function(t,e){var r=M(y,1===e),o=M(O,1===e),a=z(r,o,f),l=a.x,v=a.y;g(t,l,v,i({size:n,dir:f,rotate:u,align:"middle"},c))})},T=function(){I();var t=m("被害妄想携帯女子","ジェットブーツで大気圏を突破して","短気呑気男子電気消さないで","ただいま参上！電波シスター☆","千本桜　夜ニ紛レ","にゃん　にゃん　にゃん　ステップ踏んで","太陽曰く燃えよカオス","インターネットが遅いさん","ごめん　ゆずれない　ゆずれない");m(E,k,D)(t,{size:90})};setInterval(T,30);
},{}]},{},["Focm"], null)
//# sourceMappingURL=/dcdc.a5af7d83.js.map