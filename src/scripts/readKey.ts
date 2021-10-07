import fs = require('fs');

export const PRIVATE_KEY = fs.readFileSync(__dirname + '/../../jwtRS256.key');
export const PUBLIC_KEY = fs.readFileSync(__dirname + '/../../jwtRS256.key.pub');