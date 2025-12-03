//------------------------
//---CRYPTAGE-------------
//------------------------
(function(){
//forward=true/false pour crypt/decrypt
var Vigenere = function (input, key, forward) {
   if(key==null) {
      key="a";
   }
   if(forward==null) {
      forward=true;
   }
   var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             + "abcdefghijklmnopqrstuvwxyz";

   // Validate key:
   key=key.toUpperCase();
   //input=input.removeNonChar();
   var key_len=key.length;
   var i;
   var adjusted_key="";

   for (i=0;i<key_len;i++) {
      var key_char=alphabet.indexOf(key.charAt(i));
      if (key_char<0) {
         continue;
      }
      adjusted_key+=alphabet.charAt(key_char);
   }

   key=adjusted_key;
   key_len=key.length;

   // Transform input:
   var input_len=input.length;
   var output="";
   var key_index=0;
   var in_tag=false;

   for (i=0;i<input_len;i++) {
      var input_char=input.charAt(i);
      if (input_char=="<") {
         in_tag=true;
      }
      else if (input_char==">") {
         in_tag = false;
      }
      if (in_tag) {
         output+=input_char;
         continue;
      }
      var input_char_value=alphabet.indexOf(input_char);
      if (input_char_value<0) {
         output+=input_char;
         continue;
      }
      var lowercase=input_char_value>=26 ? true : false;
      if (forward) {
         input_char_value+=alphabet.indexOf (key.charAt(key_index));
      }
      else {
         input_char_value-=alphabet.indexOf(key.charAt(key_index));
      }
      input_char_value+=26;
      if (lowercase) {
         input_char_value=input_char_value%26+26;
      }
      else {
         input_char_value%=26;
      }
      output+=alphabet.charAt(input_char_value);
      key_index=(key_index+1)%key_len;
   }
   return output;
};
var sha1 = function (msg) {
   var rotate_left=function rotate_left(n,s) {
         var t4 = ( n<<s ) | (n>>>(32-s));
         return t4;
   };

   var lsb_hex=function(val) {
         var str="";
         var i;
         var vh;
         var vl;
         for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
         }
         return str;
   };

   var cvt_hex=function (val) {
      var str="";
      var i;
      var v;

      for( i=7; i>=0; i-- ) {
         v = (val>>>(i*4))&0x0f;
         str += v.toString(16);
      }
      return str;
   };

   var blockstart;
   var i, j;
   var W = new Array(80);
   var H0 = 0x67452301;
   var H1 = 0xEFCDAB89;
   var H2 = 0x98BADCFE;
   var H3 = 0x10325476;
   var H4 = 0xC3D2E1F0;
   var A, B, C, D, E;
   var temp;

   msg = msg.encodeUTF8();

   var msg_len = msg.length;

   var word_array = new Array();
   for( i=0; i<msg_len-3; i+=4 ) {
      j = msg.charCodeAt(i)<<24 |
         msg.charCodeAt(i+1)<<16 |
         msg.charCodeAt(i+2)<<8 |
         msg.charCodeAt(i+3);
      word_array.push( j );
   }

   switch( msg_len % 4 ) {
      case 0:
         i = 0x080000000;
         break;
      case 1:
         i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
         break;
      case 2:
         i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
         break;
      case 3:
         i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8   | 0x80;
         break;
   }

   word_array.push(i);

   while( (word_array.length % 16) != 14 ) {
      word_array.push(0);
   }

   word_array.push( msg_len>>>29 );
   word_array.push( (msg_len<<3)&0x0ffffffff );

   for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

      for( i=0; i<16; i++ ) {
         W[i] = word_array[blockstart+i];
      }
      for( i=16; i<=79; i++ ) {
         W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
      }

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for( i= 0; i<=19; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=20; i<=39; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=40; i<=59; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=60; i<=79; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;

   }

   var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

   return temp.toLowerCase();
};
var sha2 = {
   chrsz:8,                            // bits per input character. 8 - ASCII; 16 - Unicode
   hexcase:0,                          // hex output format. 0 - lowercase; 1 - uppercase
   safe_add:function (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
   },
   S:function  (X, n){return ( X >>> n ) | (X << (32 - n));},
   R:function (X, n) {return ( X >>> n );},
   Ch:function (x, y, z) {return ((x & y) ^ ((~x) & z));},
   Maj:function (x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));},
   Sigma0256:function (x) {return sha2.S(x, 2) ^ sha2.S(x, 13) ^ sha2.S(x, 22);},
   Sigma1256:function (x) {return sha2.S(x, 6) ^ sha2.S(x, 11) ^ sha2.S(x, 25);},
   Gamma0256:function (x) {return sha2.S(x, 7) ^ sha2.S(x, 18) ^ sha2.R(x, 3);},
   Gamma1256:function (x) {return sha2.S(x, 17) ^ sha2.S(x, 19) ^ sha2.R(x, 10);},
   Sigma0512:function (x) {return sha2.S(x, 28) ^ sha2.S(x, 34) ^ sha2.S(x, 39);},
   Sigma1512:function (x) {return sha2.S(x, 14) ^ sha2.S(x, 18) ^ sha2.S(x, 41);},
   Gamma0512:function (x) {return sha2.S(x, 1) ^ sha2.S(x, 8) ^ sha2.R(x, 7);},
   Gamma1512:function (x) {return sha2.S(x, 19) ^ sha2.S(x, 61) ^ sha2.R(x, 6);},
   core_sha256:function (m, l) {
      var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
      var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;

      // append padding
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;

      for ( var i = 0; i<m.length; i+=16 ) {
         a = HASH[0];
         b = HASH[1];
         c = HASH[2];
         d = HASH[3];
         e = HASH[4];
         f = HASH[5];
         g = HASH[6];
         h = HASH[7];

         for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = sha2.safe_add(sha2.safe_add(sha2.safe_add(sha2.Gamma1256(W[j - 2]), W[j - 7]), sha2.Gamma0256(W[j - 15])), W[j - 16]);

            T1 = sha2.safe_add(sha2.safe_add(sha2.safe_add(sha2.safe_add(h, sha2.Sigma1256(e)), sha2.Ch(e, f, g)), K[j]), W[j]);
            T2 = sha2.safe_add(sha2.Sigma0256(a), sha2.Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = sha2.safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = sha2.safe_add(T1, T2);
         }

         HASH[0] = sha2.safe_add(a, HASH[0]);
         HASH[1] = sha2.safe_add(b, HASH[1]);
         HASH[2] = sha2.safe_add(c, HASH[2]);
         HASH[3] = sha2.safe_add(d, HASH[3]);
         HASH[4] = sha2.safe_add(e, HASH[4]);
         HASH[5] = sha2.safe_add(f, HASH[5]);
         HASH[6] = sha2.safe_add(g, HASH[6]);
         HASH[7] = sha2.safe_add(h, HASH[7]);
      }
      return HASH;
   },
   str2binb:function  (str) {
      var bin = Array();
      var mask = (1 << sha2.chrsz) - 1;
      for(var i = 0; i < str.length * sha2.chrsz; i += sha2.chrsz) {
         bin[i>>5] |= (str.charCodeAt(i / sha2.chrsz) & mask) << (24 - i%32);
      }
      return bin;
   },
   binb2str:function (bin) {
      var str = "";
      var mask = (1 << sha2.chrsz) - 1;
      for(var i = 0; i < bin.length * 32; i += sha2.chrsz) {
         str += String.fromCharCode((bin[i>>5] >>> (24 - i%32)) & mask);
      }
      return str;
   },
   binb2hex:function (binarray) {
      var hex_tab = sha2.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i++) {
         str +=  hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
               hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
      }
      return str;
   },
   binb2b64:function (binarray) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i += 3) {
         var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16) |
                    (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 ) |
                    ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
         for(var j = 0; j < 4; j++) {
            if(i * 8 + j * 6 > binarray.length * 32) {
               str += b64pad;
            }
            else {
               str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
         }
      }
      return str;
   },
   hex_sha256:function (s){return sha2.binb2hex(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));},
   b64_sha256:function (s){return sha2.binb2b64(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));},
   str_sha256:function (s){return sha2.binb2str(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));}
};
var md5 = {
   hex_chr:"0123456789abcdef",
   rhex:function (num) {
      str = "";
      for(j = 0; j <= 3; j++) {
         str +=  md5.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
               md5.hex_chr.charAt((num >> (j * 8)) & 0x0F);
      }
      return str;
   },
   int32toarray:function (int32) {
      data = new Array();
      j=0;
      for (i=0;i<int32.length;i++) {
         for (k=0;k<4;k++) {
            data[j++] = (int32[i]>>(8*k))&255;
         }
      }
      return data;
   },
   //Convert a string to a sequence of 16-word blocks, stored as an array.
   //Append padding bits and the length, as described in the MD5 standard.
   str2blks_MD5:function (str,type) {
      nblk = ((str.length + 8) >> 6) + 1;
      blks = new Array(nblk * 16);
      for(i = 0; i < nblk * 16; i++) {
         blks[i] = 0;
      }
      if (type == 0) {
         for(i = 0; i < str.length; i++) {
            blks[i >> 2] |= str[i] << ((i % 4) * 8);
         }
      }
      else {
         for(i = 0; i < str.length; i++) {
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
         }
      }
      blks[i >> 2] |= 0x80 << ((i % 4) * 8);
      blks[nblk * 16 - 2] = str.length * 8;
      return blks;
   },
   //Add integers, wrapping at 2^32. This uses 16-bit operations internally
   //to work around bugs in some JS interpreters.
   add:function (x, y) {
       var lsw = (x & 0xFFFF) + (y & 0xFFFF);
       var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
       return (msw << 16) | (lsw & 0xFFFF);
   },
   //Bitwise rotate a 32-bit number to the left
   rol:function (num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
   },
   //These functions implement the basic operation for each round of the algorithm.
   cmn:function (q, a, b, x, s, t) {
      return md5.add(md5.rol(md5.add(md5.add(a, q), md5.add(x, t)), s), b);
   },
   ff:function (a, b, c, d, x, s, t) {
      return md5.cmn((b & c) | ((~b) & d), a, b, x, s, t);
   },
   gg:function (a, b, c, d, x, s, t) {
      return md5.cmn((b & d) | (c & (~d)), a, b, x, s, t);
   },
   hh:function (a, b, c, d, x, s, t) {
      return md5.cmn(b ^ c ^ d, a, b, x, s, t);
   },
   ii:function (a, b, c, d, x, s, t) {
      return md5.cmn(c ^ (b | (~d)), a, b, x, s, t);
   },
   //Take a string and return the hex representation of its MD5.
   //bTypeRet=0 : return a string (default)
   //bTypeRet=1 : return an array
   calcmd5:function (str,type, bTypeRet) {
      if(bTypeRet==null) {
         bTypeRet=0;
      }
      //Modified by MC
      x = md5.str2blks_MD5(str,type);
      a =  1732584193;
      b = -271733879;
      c = -1732584194;
      d =  271733878;
      for(i = 0; i < x.length; i += 16) {
         olda = a;
         oldb = b;
         oldc = c;
         oldd = d;
         a = md5.ff(a, b, c, d, x[i+ 0], 7 , -680876936);
         d = md5.ff(d, a, b, c, x[i+ 1], 12, -389564586);
         c = md5.ff(c, d, a, b, x[i+ 2], 17,  606105819);
         b = md5.ff(b, c, d, a, x[i+ 3], 22, -1044525330);
         a = md5.ff(a, b, c, d, x[i+ 4], 7 , -176418897);
         d = md5.ff(d, a, b, c, x[i+ 5], 12,  1200080426);
         c = md5.ff(c, d, a, b, x[i+ 6], 17, -1473231341);
         b = md5.ff(b, c, d, a, x[i+ 7], 22, -45705983);
         a = md5.ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
         d = md5.ff(d, a, b, c, x[i+ 9], 12, -1958414417);
         c = md5.ff(c, d, a, b, x[i+10], 17, -42063);
         b = md5.ff(b, c, d, a, x[i+11], 22, -1990404162);
         a = md5.ff(a, b, c, d, x[i+12], 7 ,  1804603682);
         d = md5.ff(d, a, b, c, x[i+13], 12, -40341101);
         c = md5.ff(c, d, a, b, x[i+14], 17, -1502002290);
         b = md5.ff(b, c, d, a, x[i+15], 22,  1236535329);
         a = md5.gg(a, b, c, d, x[i+ 1], 5 , -165796510);
         d = md5.gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
         c = md5.gg(c, d, a, b, x[i+11], 14,  643717713);
         b = md5.gg(b, c, d, a, x[i+ 0], 20, -373897302);
         a = md5.gg(a, b, c, d, x[i+ 5], 5 , -701558691);
         d = md5.gg(d, a, b, c, x[i+10], 9 ,  38016083);
         c = md5.gg(c, d, a, b, x[i+15], 14, -660478335);
         b = md5.gg(b, c, d, a, x[i+ 4], 20, -405537848);
         a = md5.gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
         d = md5.gg(d, a, b, c, x[i+14], 9 , -1019803690);
         c = md5.gg(c, d, a, b, x[i+ 3], 14, -187363961);
         b = md5.gg(b, c, d, a, x[i+ 8], 20,  1163531501);
         a = md5.gg(a, b, c, d, x[i+13], 5 , -1444681467);
         d = md5.gg(d, a, b, c, x[i+ 2], 9 , -51403784);
         c = md5.gg(c, d, a, b, x[i+ 7], 14,  1735328473);
         b = md5.gg(b, c, d, a, x[i+12], 20, -1926607734);

         a = md5.hh(a, b, c, d, x[i+ 5], 4 , -378558);
         d = md5.hh(d, a, b, c, x[i+ 8], 11, -2022574463);
         c = md5.hh(c, d, a, b, x[i+11], 16,  1839030562);
         b = md5.hh(b, c, d, a, x[i+14], 23, -35309556);
         a = md5.hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
         d = md5.hh(d, a, b, c, x[i+ 4], 11,  1272893353);
         c = md5.hh(c, d, a, b, x[i+ 7], 16, -155497632);
         b = md5.hh(b, c, d, a, x[i+10], 23, -1094730640);
         a = md5.hh(a, b, c, d, x[i+13], 4 ,  681279174);
         d = md5.hh(d, a, b, c, x[i+ 0], 11, -358537222);
         c = md5.hh(c, d, a, b, x[i+ 3], 16, -722521979);
         b = md5.hh(b, c, d, a, x[i+ 6], 23,  76029189);
         a = md5.hh(a, b, c, d, x[i+ 9], 4 , -640364487);
         d = md5.hh(d, a, b, c, x[i+12], 11, -421815835);
         c = md5.hh(c, d, a, b, x[i+15], 16,  530742520);
         b = md5.hh(b, c, d, a, x[i+ 2], 23, -995338651);
         a = md5.ii(a, b, c, d, x[i+ 0], 6 , -198630844);
         d = md5.ii(d, a, b, c, x[i+ 7], 10,  1126891415);
         c = md5.ii(c, d, a, b, x[i+14], 15, -1416354905);
         b = md5.ii(b, c, d, a, x[i+ 5], 21, -57434055);
         a = md5.ii(a, b, c, d, x[i+12], 6 ,  1700485571);
         d = md5.ii(d, a, b, c, x[i+ 3], 10, -1894986606);
         c = md5.ii(c, d, a, b, x[i+10], 15, -1051523);
         b = md5.ii(b, c, d, a, x[i+ 1], 21, -2054922799);
         a = md5.ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
         d = md5.ii(d, a, b, c, x[i+15], 10, -30611744);
         c = md5.ii(c, d, a, b, x[i+ 6], 15, -1560198380);
         b = md5.ii(b, c, d, a, x[i+13], 21,  1309151649);
         a = md5.ii(a, b, c, d, x[i+ 4], 6 , -145523070);
         d = md5.ii(d, a, b, c, x[i+11], 10, -1120210379);
         c = md5.ii(c, d, a, b, x[i+ 2], 15,  718787259);
         b = md5.ii(b, c, d, a, x[i+ 9], 21, -343485551);
         a = md5.add(a, olda);
         b = md5.add(b, oldb);
         c = md5.add(c, oldc);
         d = md5.add(d, oldd);
      }
      //return rhex(a) + rhex(b) + rhex(c) + rhex(d);
      int32 = new Array(a,b,c,d);
      if(bTypeRet==1) {
         return md5.int32toarray(int32);
      }
      else {
         return md5.int32toarray(int32).toBase().join('').toLowerCase();
      }
   }
};
var Morse = {
   letters:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 &\PMC.utils.$\@\+\-_.,:;=?'-/()\"€\n\r\t",
   morse:Array(
       ".-","-...","-.-.","-..",".","..-.",
       "--.","....","..",".---","-.-",".-..",
       "--","-.","---",".--.","--.-",".-.",
       "...","-","..-","...-",".--","-..-",
       "-.--","--..","-----",".----","..---",
       "...--","....-",".....","-....","--...",
       "---..","----."," ",
       "·-···","···-··-","·--·-·",".-.-.","-····-","··--·-",".-.-.-","--..--","---...","-·-·-·","-···-","..--..",".----.","-....-","-..-.",
       "-·--·","-.--.-",".-..-.", "...-.-.---", "\n", "\r", "\t"),
   crypt:function (sIn)
   {
      sIn=sIn.removeAccents().toUpperCase();
      var aRet=Array();
      var iLen=sIn.length;
      for (var i=0;i<iLen;i++) {
         var input_char=sIn.charAt(i);
         var key=this.letters.indexOf(input_char);
         if (key<0) {
            aRet.push(" ");
            continue;
         }
         aRet.push(this.morse[key]);
      }
      return aRet.join(" ");
   },
   decrypt:function (sIn) {
      var aIn=sIn.replaceAll("_", "-").split(" ");
      var aRet=Array();
      for(var i=0;i<aIn.length;i++) {
         var key=this.morse.getKey(aIn[i]);
         if(key>-1) {
            aRet.push(this.letters.charAt(key));
         }
         else if(aIn[i]=="") {
            aRet.push(" ");
         }
      }
      return aRet.join("").replaceAll("  ", " ");
   }
};

String.prototype.encodeVigenere=function (key){return Vigenere(this, key, true);};
Number.prototype.encodeVigenere=function (key){return new String(this).encodeVigenere(key);};
Array.prototype.encodeVigenere=function (key){for(var i=0;i<this.length;i++){this[i]=this[i].encodeVigenere(key);}return this;};

String.prototype.decodeVigenere=function (key){return Vigenere(this, key, false);};
Number.prototype.decodeVigenere=function (key){return new String(this).decodeVigenere(key);};
Array.prototype.decodeVigenere=function (key){for(var i=0;i<this.length;i++){this[i]=this[i].decodeVigenere(key);}return this;};

String.prototype.sha1=function (){return sha1(this);};
Number.prototype.sha1=function (){return new String(this).sha1();};
Array.prototype.sha1=function (){for(var i=0;i<this.length;i++){this[i]=this[i].sha1();}return this;};

String.prototype.sha2=function (){return sha2.str_sha256(this);};
Number.prototype.sha2=function (){return new String(this).sha2();};
Array.prototype.sha2=function (){for(var i=0;i<this.length;i++){this[i]=this[i].sha2();}return this;};

String.prototype.md5=function (){return md5.calcmd5(this);};
Number.prototype.md5=function (){return new String(this).md5();};
Array.prototype.md5=function (){for(var i=0;i<this.length;i++){this[i]=this[i].md5();}return this;};

String.prototype.encodeMorse=function (){return Morse.crypt(this);};
Number.prototype.encodeMorse=function (){return new String(this).encodeMorse();};
Array.prototype.encodeMorse=function (){for(var i=0;i<this.length;i++){this[i]=this[i].encodeMorse();}return this;};

String.prototype.decodeMorse=function (){return Morse.decrypt(this);};
Number.prototype.decodeMorse=function (){return new String(this).decodeMorse();};
Array.prototype.decodeMorse=function (){for(var i=0;i<this.length;i++){this[i]=this[i].decodeMorse();}return this;};
})();
//// LZW-compress a string
//function lzw_encode(s) {
//   var dict = {};
//   var data = (s + "").split("");
//   var out = [];
//   var currChar;
//   var phrase = data[0];
//   var code = 256;
//   for (var i=1; i<data.length; i++) {
//      currChar=data[i];
//      if (dict[phrase + currChar] != null) {
//         phrase += currChar;
//      }
//      else {
//         out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
//         dict[phrase + currChar] = code;
//         code++;
//         phrase=currChar;
//      }
//   }
//   out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
//   for (var i=0; i<out.length; i++) {
//      out[i] = String.fromCharCode(out[i]);
//   }
//   return out.join("");
//}
//
//// Decompress an LZW-encoded string
//function lzw_decode(s) {
//   var dict = {};
//   var data = (s + "").split("");
//   var currChar = data[0];
//   var oldPhrase = currChar;
//   var out = [currChar];
//   var code = 256;
//   var phrase;
//   for (var i=1; i<data.length; i++) {
//      var currCode = data[i].charCodeAt(0);
//      if (currCode < 256) {
//         phrase = data[i];
//      }
//      else {
//         phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
//      }
//      out.push(phrase);
//      currChar = phrase.charAt(0);
//      dict[code] = oldPhrase + currChar;
//      code++;
//      oldPhrase = phrase;
//   }
//   return out.join("");
//}