// import * as Blowfish from 'blowfish';
// import Blowfish from './b'
const Blowfish = require('egoroof-blowfish');

export const hash = () => {
  const bf = new Blowfish(
    'super key',
    Blowfish.MODE.ECB,
    Blowfish.PADDING.NULL
  );
  bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8

  const encoded = bf.encode('input text even with emoji 🎅');
  const decoded = bf.decode(encoded, Blowfish.TYPE.STRING);
  console.log(encoded, decoded, Blowfish.TYPE.STRING);
};
