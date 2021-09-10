
//var buffer = require("buffer");

const arrayBuffer = new ArrayBuffer(16);
const mybuffer = Buffer.from(arrayBuffer);

console.log(mybuffer.buffer === arrayBuffer);
// Prints: true