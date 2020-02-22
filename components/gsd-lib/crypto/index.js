const CryptoJS = require('./crypto');

CryptoJS.encryptByAES = function(word, key) {
  if (!key || key.length !== 16) {
    throw '密钥 key 必须是十六位字符串'
  }

  const src = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(
    src,
    CryptoJS.enc.Utf8.parse(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

  return encrypted.ciphertext.toString().toUpperCase();
}

CryptoJS.decryptByAES = function(word, key) {
  if (!key || key.length !== 16) {
    throw '密钥 key 必须是十六位字符串'
  }

  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const src = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(
    src,
    CryptoJS.enc.Utf8.parse(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

/**
 * doc https://code.google.com/archive/p/crypto-js/
 * @type {{CryptoJS: *, encryptByKey(*=, *=): *, decryptByKey(*=, *=): *}}
 */
module.exports = CryptoJS
