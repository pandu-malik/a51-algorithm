function A51(key, frame) {
    let R1 = (key & 0x7FFFF) ^ ((frame & 0x7) << 16); // 19 bits
    let R2 = ((key >> 19) & 0x3FFFFF) ^ ((frame >> 3) << 19); // 22 bits
    let R3 = ((key >> 41) & 0x7FFFFF) ^ ((frame >> 13) << 22); // 23 bits 
  
    function clock(reg, poly, tap) {
      const bit = (reg >> (tap - 1)) & 1;
      let feedback = 0;
      for (let i = 0; i < poly.length; i++) {
        feedback ^= (reg >> (poly[i] - 1)) & 1;
      }
      reg = (reg >> 1) | (feedback << (tap - 1));
      return reg;
    }
  
    function majority(x, y, z) {
      return (x & y) ^ (x & z) ^ (y & z);
    }
  
    this.generateKeystream = function (length) {
      let keystream = [];
      for (let i = 0; i < length; i++) {
        const majorityBit = majority((R1 >> 8) & 1, (R2 >> 10) & 1, (R3 >> 10) & 1);
        if (((R1 >> 8) & 1) === majorityBit) {
          R1 = clock(R1, [19, 18, 17, 14], 19);
        }
        if (((R2 >> 10) & 1) === majorityBit) {
          R2 = clock(R2, [22, 21], 22);
        }
        if (((R3 >> 10) & 1) === majorityBit) {
          R3 = clock(R3, [23, 22, 21, 8], 23);
        }
        keystream.push(((R1 & 1) ^ (R2 & 1) ^ (R3 & 1)));
      }
      return keystream;
    };
  }
  
  function encryptDecrypt(plaintext, key, frame) {
      const a51 = new A51(key, frame);
      const keystream = a51.generateKeystream(plaintext.length);
      let ciphertext = "";
      for(let i = 0; i < plaintext.length; i++){
          ciphertext+= String.fromCharCode(plaintext.charCodeAt(i) ^ keystream[i]);
      }
      return ciphertext;
  }
  
  // Example Usage (DO NOT USE FOR REAL SECURITY)
  const key = 0x1234567890ABCDEF;
  const frame = 0x12345;
  const plaintext = "Pandu";
  const ciphertext = encryptDecrypt(plaintext, key, frame);
  const decryptedText = encryptDecrypt(ciphertext, key, frame);
  
  console.log("Plaintext:", plaintext);
  console.log("Ciphertext:", ciphertext);
  console.log("Decrypted:", decryptedText);