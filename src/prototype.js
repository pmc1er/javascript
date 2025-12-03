//------------------------
//---PROTOTYPE------------
//---String, Number-------
//---Date, Array, Math----
//------------------------
//Sur les chaînes de caractères

(function() {

   var atobUTF8 = (function(){
      "use strict";
      var log = Math.log;
      var LN2 = Math.LN2;
      var clz32 = Math.clz32 || function(x) {return 31 - log(x >>> 0) / LN2 | 0};
      var fromCharCode = String.fromCharCode;
      var original_atob = atob;
      function replacer(encoded){
         var codePoint = encoded.charCodeAt(0) << 24;
         var leadingOnes = clz32(~codePoint);
         var endPos = 0, stringLen = encoded.length;
         var result = "";
         if (leadingOnes < 5 && stringLen >= leadingOnes) {
            codePoint = (codePoint<<leadingOnes)>>>(24+leadingOnes);
            for (endPos = 1; endPos < leadingOnes; ++endPos)
               codePoint = (codePoint<<6) | (encoded.charCodeAt(endPos)&0x3f/*0b00111111*/);
            if (codePoint <= 0xFFFF) { // BMP code point
            result += fromCharCode(codePoint);
            } else if (codePoint <= 0x10FFFF) {
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            result += fromCharCode(
               (codePoint >> 10) + 0xD800,  // highSurrogate
               (codePoint & 0x3ff) + 0xDC00 // lowSurrogate
            );
            } else endPos = 0; // to fill it in with INVALIDs
         }
         for (; endPos < stringLen; ++endPos) result += "\ufffd"; // replacement character
         return result;
      }
      return function(inputString, keepBOM){
         if (!keepBOM && inputString.substring(0,3) === "\xEF\xBB\xBF")
            inputString = inputString.substring(3); // eradicate UTF-8 BOM
         // 0xc0 => 0b11000000; 0xff => 0b11111111; 0xc0-0xff => 0b11xxxxxx
         // 0x80 => 0b10000000; 0xbf => 0b10111111; 0x80-0xbf => 0b10xxxxxx
         return original_atob(inputString).replace(/[\xc0-\xff][\x80-\xbf]*/g, replacer);
      };
   })();


var btoaUTF8 = (function(btoa, replacer){"use strict";
	return function(inputString, BOMit){
		return btoa((BOMit ? "\xEF\xBB\xBF" : "") + inputString.replace(
			/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, replacer
		));
	}
})(btoa, function(fromCharCode){
	return function(nonAsciiChars){"use strict";
		// make the UTF string into a binary UTF-8 encoded string
		var point = nonAsciiChars.charCodeAt(0);
		if (point >= 0xD800 && point <= 0xDBFF) {
			var nextcode = nonAsciiChars.charCodeAt(1);
			if (nextcode !== nextcode) // NaN because string is 1 code point long
				return fromCharCode(0xef/*11101111*/, 0xbf/*10111111*/, 0xbd/*10111101*/);
			// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
				point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
				if (point > 0xffff)
					return fromCharCode(
						(0x1e/*0b11110*/<<3) | (point>>>18),
						(0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/),
						(0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
						(0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
					);
			} else return fromCharCode(0xef, 0xbf, 0xbd);
		}
		if (point <= 0x007f) return nonAsciiChars;
		else if (point <= 0x07ff) {
			return fromCharCode((0x6<<5)|(point>>>6), (0x2<<6)|(point&0x3f));
		} else return fromCharCode(
			(0xe/*0b1110*/<<4) | (point>>>12),
			(0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/),
			(0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/)
		);
	}
}(String.fromCharCode));
String.prototype.encode64=function() {return btoaUTF8(this);};
String.prototype.decode64=function() {return atobUTF8(this);};
})();

Object.merge(String.prototype,{
   isNull:function(d) {return this==null ? d : this;},
   isNull2:function(a,b) {return this==null ? a : b;},
   rate:6.55957, //Taux de conversion entre FF et Euro
   isArray:false, //Définit si c'est un tableau
   empty:function () {return this.length==0 || this==null;},
   patternDate:'^([1-9]|0[1-9]|[12][0-9]|3[01])[^0-9]*([1-9]|0[1-9]|1[0-2])[^0-9]*([0-9]{2,4})([ ]*([01][0-9]|2[0-3]|[0-9])[^0-9]*([0-4][0-9]|5[0-9]|[0-9])[^0-9]*([0-4][0-9]|5[0-9]|[0-9]))?$',
   HTML_ENTITIES: "&amp;&agrave;&aacute;&auml;&acirc;&egrave;&eacute;&euml;&ecirc;&igrave;&iacute;&iuml;&icirc;&ograve;&oacute;&ouml;&ocirc;&ugrave;&uacute;&uuml;&ucirc;&nbsp;&copy;&quot;&ccedil;&lt;&gt",
   TEXT_ENTITIES: "&àáäâèéëêìíïîòóöôùúüû ©\"ç<> ",
   has : function(c) {
      return this.indexOf(c) > -1;
   },
   truncate:function (length, truncation) {
      length = length || 30;
      truncation = truncation==null ? '...' : truncation;
      return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this);
   },
   isDate: function () {
      var rexp=new RegExp(this.patternDate);
      return rexp.test(this);
   },
   before:function (s) {
      var aTmp=this.split(s);
      return aTmp[0];
   },
   after:function (s) {
      var aTmp=this.split(s);
      aTmp.shift();
      return aTmp.join(s);
   },
   toDate: function () {
      var dDate=new Date();
      var rexp=new RegExp(this.patternDate, "gi");
      return this.isDate() ? dDate.set(this.replace(rexp, "$1\/$2\/$3 $4:$5:$6")) : null;
   },
   isUpper:function (l) {
      var tmp1=this.toLowerCase();
      if(l==null || l.length==0)
         return true;
      var tmp2=(new String(l)).toLowerCase();
      var i=0;
      while(i<tmp1.length && i<tmp2.length && tmp1.charCodeAt(i)==tmp2.charCodeAt(i))
         i++;
      if(i>=tmp1.length)
         return tmp1.charCodeAt(i-1)>tmp2.charCodeAt(i-1);
      else
      if(i>=tmp2.length)
         return tmp1.charCodeAt(i-1)>=tmp2.charCodeAt(i-1);
      else
         return tmp1.charCodeAt(i)>=tmp2.charCodeAt(i);
   },
   isLogin: function ()
   {
      var rexp=new RegExp("^[0-9a-zA-Z]{3,10}$", "g");
      return rexp.test(this);
   },
   isPasswd: function ()
   {
      var rexp=new RegExp("^[0-9a-zA-Z\$\*\%@çéèêëàä!\§ïîù_\-]{6,20}$", "gi");
      return rexp.test(this);
   },
   isEmail: function ()
   {
      return this.matches("^[-a-zA-Z0-9\\._]{3,}@[-a-zA-Z0-9_]{2,}\\.[a-z]{2,4}$");
   },
   isNumber: function ()
   {
      var reg=new RegExp("^[0-9]+$", "g");
      return reg.test(this);
   },
   isFloat: function ()
   {
      var n=(arguments.length>0) ? "{0,"+arguments[0]+"}" : "*";
      var reg=new RegExp("^[0-9]+[\.|,]?[0-9]"+n+"$", "g");
      return reg.test(this.trim());
   },
   intFormat:function(sep=" ") {
      var separate=function(integer, sep) {
         if(integer.length<3) {
            return integer;
         }
         else {
            return integer.substr(0,3)+sep+separate(integer.slice(3), sep);
         }
      };
      let [ integer, fraction = '' ] = this.split('.');
      let sign = '';
      if (integer.startsWith('-')) {
         integer = integer.slice(1);
         sign = '-';
      }
      let string = sign + separate(integer.reverse(), sep).reverse() + (fraction.length > 0 ? '.'+separate(fraction, sep) : '');
      return string;
   },
   isClassName:function (sClass)
   {
      var sName=this.toLowerCase();
      sClass=sClass.toLowerCase();
      return (sName==sClass) || (sName.startsWith(sClass+" ")) || (sName.endsWith(" "+sClass)) || (sName.contains(" "+sClass+" "));
   },
   repeat : function( num )
   {
      return new Array( num + 1 ).join( this );
   },
   toRep: function ()
   {
      var rexp=new RegExp("([\\\\|\/|\/|\:|\*|\"|\<|\>])", "gi");
      var sTmp=this.replace(rexp, "");
      return sTmp.replace(/\&/gi, "et");
   },
   ucWords: function () //Première lettre de chaque mot en majuscule
   {
      var tmp=new String(this);
      var tab=tmp.split(" ");
      for (var i=0; i<tab.length; i++)
         tab[i]=tab[i].charAt(0).toUpperCase() + tab[i].substring(1);
      tmp=tab.join(" ");
      tab=tmp.split("-");
      for (var i=0; i<tab.length; i++)
         tab[i]=tab[i].charAt(0).toUpperCase() + tab[i].substring(1);
      return tab.join("-");
   },
   getWordCount: function () //Retourne le nombre de mots
   {
      return this.split(" ").length;
   },
   getSubstrCount: function (s) //Nombre d'occurence du parametre
   {
      return this.split(s).length-1;
   },
   nl2br: function ()
   {
      var sRet=this.replace(/(\r\n|\r|\n)/g, "<br />");
      sRet=sRet.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;");
      return sRet;
   },
   br2nl: function ()
   {
      var sRet=this.replace(/\<br( \/)?>/g, "\n");
      return sRet.replace(/\&nbsp\;\&nbsp\;\&nbsp\;/g, "\t");
   },
   escapeRegexp: function () //Ajoute un \ devant tous les caractères suceptibles d'êtres interprétés à l'intérieur d'une expression régulière : \, +, *, [, ], (, ), {, } et -.
   {
      var reg=new RegExp("([\\.\\\\\\+\\-\\*\\[\\]\\{\\}\\(\\)\\?\\$\\^])", "g");
      return this.replace(reg, "\\$1");
   },
   unescapeRegexp: function () //Effectue le contraire de la fonction escapeRegex, c'est-à-dire qu'elle efface les \ avant les caractères suceptibles d'être interprétés par une expression régulière.
   {
      var reg=new RegExp("\\\\([\\.\\\\\\+\\-\\*\\[\\]\\{\\}\\(\\)\\?\\$\\^])", "g");
      return this.replace(reg, "$1");
   },
   matches: function (s)  //La chaine vérifie-t-elle l'expression régulière passée en paramètre ?
   {
      var reg=new RegExp(s);
      return reg.test(this);
   },
   insert: function (intIndex, strChar)
   {
      if (isNaN(intIndex) || (intIndex < 0) || (strChar==null)) {return this;}
      strChar += '';
      intIndex = parseInt(intIndex, 10);
      return this.substr(0, intIndex) + strChar + this.substr(intIndex, this.length);
   },
   remove: function (intIndex, intLength)
   {
      if (isNaN(intIndex) || isNaN(intLength) || (intIndex < 0) || (intLength < 0)) {return this;}
      intIndex = parseInt(intIndex, 10);
      intLength = parseInt(intLength, 10);
      return this.substr(0, intIndex) + this.substr(intIndex + intLength, this.length);
   },
   startsWith: function (strChar)
   {
      if (!strChar) {return false;}
      strChar += '';
      var intLength = strChar.length;
      return this.substr(0, intLength) == strChar;
   },
   endsWith: function (strChar)
   {
      if (!strChar) {return false;}
      strChar += '';
      var intLength = strChar.length;
      return this.substr(this.length - intLength, intLength) == strChar;
   },
   contains: function (strChar)
   {
      return this.getSubstrCount(strChar)>0;
   },
   between:function(debut, fin)
   {
      if(!this.contains(debut) || !this.contains(fin)) {
         return undefined;
      }
      return this.after(debut).before(fin);
   },
   extractPage:function ()
   {
      var tmp=this;
      tmp=tmp.substr(tmp.lastIndexOf("/")+1);
      tmp=tmp.substr(tmp.lastIndexOf("\\")+1);
      return tmp.before("?");
   },
   extractParam:function ()
   {
      var bSessID=arguments.length>0 ? arguments[0] : false;
      if(bSessID)
         return this.after("?").replace(/phpsessid=[a-z0-9]* ?/gi, "").replace(/\&\&/gi, "&").replace(/^\&/, "").replace(/\&$/, "");
      else
         return this.after("?").replace(/\&\&/gi, "&").replace(/^\&/, "").replace(/\&$/, "");
   },
   equalsIgnoreCase: function (s)
   {
      return this.toLowerCase()==s.toLowerCase();
   },
   reverse: function ()
   {
      return this.split("").reverse().join("");
   },
   escapeEntities: function (replaceSpace)
   {
      var tab = "".HTML_ENTITIES.split(";");
      var str = ""+this+"";
      for (var i=0; i<tab.length; i++)
      {
         var a="".TEXT_ENTITIES.charAt(i);
         var b=tab[i]+";";
         str=str.split(a).join(b);
      }
      if(replaceSpace) {
         str=str.replaceAll(' ', '&nbsp;');
      }
      return str;
   },
   unescapeEntities: function ()
   {
      var tab = "".HTML_ENTITIES.split(";");
      var str = ""+this+"";
      for (var i=0; i < tab.length; i++)
      {
         var b = "".TEXT_ENTITIES.charAt(i);
         var a = tab[i]+";";
         str = str.split(a).join(b);
      }
      return str;
   },
   removeAccents: function ()
   {
      var str=""+this+"";
      var a="ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñðÝý€";
      var b="AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNnoYyE";
      for (var i=0; i<a.length; i++)
         str=str.split(a.charAt(i)).join(b.charAt(i));
      return str;
   },
   removeNonChar:function ()
   {
      var rexp=new RegExp('[^a-zA-Z0-9\ ]', "gi");
      return this.removeAccents().replace(rexp, "");
   },
   PGCD: function (n) {
     if(this.isNumber() && n.isNumber()) {
       var x=Math.abs(this), y=Math.abs(n);
       if (x == 0) {
         return y;
       }
       else if (y == 0) {
         return x;
       }
       else if (x > y) {
         return y.PGCD(x % y);
       }
       else {
         return x.PGCD(y % x);
       }
     }
     else {
       return 0;
     }
   },
   /*
   PGCD: function (n)
   {
      var x=this, y=n, z=0;
      if(this.isNumber() && n.isNumber())
      {
         while(y != 0)
            {
            z = x%y;
            x = y;
            y = z;
            }
      }
      else
         x=0;
      return x;
   },
   */
   PPMC: function (n)
   {
      if(this.isNumber() && n.isNumber())
         return (this*n)/this.PGCD(n);
      else
         return 0;
   },
   convertEF:function () //Conversion Franc<=>Euro
   {
      var cTo=arguments.length>0 ? arguments[0] : "E";
      if(!this.isFloat())
         return "";
      else if(cTo=="E")
         return this/this.rate;
      else
         return this*this.rate;
   },
   toE: function () //Conversion FF=>€
   {
      return this.convertEF("E");
   },
   toF: function () //Conversion €=>FF
   {
      return this.convertEF("F");
   },
   lpad: function (nb)
   {
      var caractere=arguments.length>1 ? (arguments[1].length>0 ? arguments[1] : " ") : " ";
      var tmp=this;
      while (tmp.length < nb)
      tmp=caractere+tmp;
      return tmp;
   },
   rpad: function (nb)
   {
      var caractere=arguments.length>1 ? (arguments[1].length>0 ? arguments[1] : " ") : " ";
      var tmp=this;
      while (tmp.length < nb)
      tmp+=caractere;
      return tmp;
   },
   ltrimZ: function (){return this.replace(/(^0*)/, "");}, //Suppression des 0 devant un nombre. Exemple 0001 retourne 1
   ltrim: function (){return this.replace(/^\s+/g, '');},
   rtrim: function (){return this.replace(/\s*$/g, '');},
   trim: function () {return this.replace(/(^\s+)|(\s+$)/ig, '');},
   trimCr: function ()
   {
      for(var f=0,nChaine="",zb="\n\r"; f<this.length; f++)
      {
         if (zb.indexOf(this.charAt(f))==-1)
            nChaine+=this.charAt(f);
      }
      return nChaine;
   },
   replaceAll: function (sOld, sNew){return this.split(sOld).join(sNew);},
   encodeSQL: function (){return this.replaceAll(PMC.utils.chr(92), PMC.utils.chr(92)+PMC.utils.chr(92)).replaceAll("'", "\\'");},
   addSlashes: function (){return this.replace(/("|'|\\)/g, '\\$1');},
   stripSlashes: function (){return this.replace(/\\("|'|\\)/g, '$1');},
//   addSlashes: function (){return this.replace(/([""\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');},
//   stripSlashes: function (){return this.replace(/([""\\\.\|\[\]\^\*\+\?\$\(\)])/g, '$1');},
   toBase10: function () //Passage de base décimale en base "10" (par défaut 16)
   {
      var base=(arguments.length>0) ? arguments[0]:16;
      return parseInt(this, base);
   },
   toBase: function () //Passage de base décimale en base "b" (par défaut 16) et renvoie au moins 2 caractères
   {
      var b=(arguments.length>0) ? arguments[0]:16;
      if(parseInt(b)>36)
         return null;
      var digits=new Number(this).toString(b);
      if(this<b)
         digits='0'+digits;
      return digits.toUpperCase();
   },
   encodeUTF8: function ()
   {
      var string=this.replace(/\r\n/g,"\n");
      var utftext="";
      for (var n=0; n<string.length; n++)
      {
      var c=string.charCodeAt(n);
      if (c<128){utftext+=String.fromCharCode(c);}
      else if((c>127) && (c<2048)){utftext+=String.fromCharCode((c >> 6) | 192);utftext+=String.fromCharCode((c & 63) | 128);}
      else {utftext+=String.fromCharCode((c >> 12) | 224);utftext+=String.fromCharCode(((c >> 6) & 63) | 128);utftext+=String.fromCharCode((c & 63) | 128);}
      }
      return utftext;
   },
   decodeUTF8: function ()
   {
      utftext = this;
      var string = "";
      var i = 0;
      var c=c1=c2=0;
      while ( i < utftext.length )
      {
      c = utftext.charCodeAt(i);
      if (c < 128){string += String.fromCharCode(c);i++;}
      else if((c > 191) && (c < 224)){c2 = utftext.charCodeAt(i+1);string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));i+=2;}
      else{c2 = utftext.charCodeAt(i+1);c3 = utftext.charCodeAt(i+2);string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));i+=3;}
      }
      return string;
   },
/*
   encode64: function (isUrl) //Encodage en base64
   {
      var tmp= (PMC && PMC.Config && PMC.Config.isUtf8) ? this.encodeUTF8() : this;
      var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output="";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i=0;
      do {
         chr1=tmp.charCodeAt(i++);
         chr2=tmp.charCodeAt(i++);
         chr3=tmp.charCodeAt(i++);
         enc1=chr1 >> 2;
         enc2=((chr1 & 3) << 4) | (chr2 >> 4);
         enc3=((chr2 & 15) << 2) | (chr3 >> 6);
         enc4=chr3 & 63;
         if (isNaN(chr2)) {enc3=enc4=64;}
         else if (isNaN(chr3)) {enc4=64;}
         output=output+keyStr.charAt(enc1)+keyStr.charAt(enc2) +
            keyStr.charAt(enc3)+keyStr.charAt(enc4);
      } while(i < tmp.length);
      if(isUrl==true)
         output=output.replaceAll('=', '');
      return output;
   },
   decode64: function () //Décodage en base64
   {
      if(this.length==0)
         return "";
      var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output="";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i=0;
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var tmp=this.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      do {
         enc1=keyStr.indexOf(tmp.charAt(i++));
         enc2=keyStr.indexOf(tmp.charAt(i++));
         enc3=keyStr.indexOf(tmp.charAt(i++));
         enc4=keyStr.indexOf(tmp.charAt(i++));
         chr1=(enc1 << 2) | (enc2 >> 4);
         chr2=((enc2 & 15) << 4) | (enc3 >> 2);
         chr3=((enc3 & 3) << 6) | enc4;
         output=output+String.fromCharCode(chr1);
         if (enc3 != 64) {output=output+String.fromCharCode(chr2);}
         if (enc4 != 64) {output=output+String.fromCharCode(chr3);}
      } while(i < tmp.length);
      return output;
   },
*/
   camelize: function ()
   {
      var oStringList = this.split('-');
      if (oStringList.length == 1) return oStringList[0];
      var camelizedString=(this.indexOf('-')==0) ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];
      for (var i=1, len=oStringList.length; i<len; i++)
      {
         var s=oStringList[i];
         camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);
      }
      return camelizedString;
   },
   stripTags: function ()
   {
      return this.replace(/<\/?[^>]+>/gi, '');
   },
   stripScripts: function ()
   {
      return this.replace(new RegExp(PMC.utils.ScriptFragment, 'img'), '');
   },
   toUrl:function (){return arguments.length>0 ? arguments[0]+"="+this.encode64().encodeUrl() : this.encode64().encodeUrl();},
   encodeUrl:function (){return this.replaceAll("+", "%2B");},
   decodeUrl:function (){return this.replaceAll("%2B", "+");},
   toNumber: function (signe)
   {
      if(signe==null)
         signe=true;
      var ret=this.replace(/[^0-9]/gi, "");
      ret=ret.ltrimZ();
      if(ret=="")
         ret=0;
      else
      {
         if(signe && this.startsWith("-"))
            ret=this.charAt(0)+ret;
      }
      return parseInt(ret);
   },
   toTel: function ()
   {
      var tmp=this.toNumber(false);
      if((tmp.length>0) && (!tmp.startsWith("0")))
         tmp="0"+tmp;
      tmp=tmp.replace(/([0-9]{0,2})/gi, "$1\.");
      while(tmp.endsWith("."))
         tmp=tmp.substr(0, tmp.length-1);
      return tmp.substr(0, 14);
   },
   toArray:function ()
   {
      return this.split("");
   },
   extension:function ()
   {
      return this.replace(/^.*\.([^\.]*)$/gi, "$1").toLowerCase();
   },
   nameFile:function ()
   {
      return this.replace(/\.[^\.]*$/gi, "");
   },
   basename:function()
   {
      var sRet=this.replaceAll("\\", "/");
      sRet=sRet.split("/");
      return sRet[sRet.length-1];
   },
   isImage:function ()
   {
      var ex=this.extension().toLowerCase();
      return ex=="gif" || ex=="jpe" || ex=="jpg" || ex=="jpeg" || ex=="bmp" || ex=="png" || ex=="ico" || ex=="pcx" || ex=="tif" || ex=="tiff";
   },
   hexToStr:function()
   {
      var t=(this.startsWith("0x")) ? this.after("0x") : this;
      var l=parseInt(t.length/2);
      var ret="";
      for(var i=0;i<l;i++)
      {
         var ec=t[2*i]+t[2*i+1];
         ret+=String.fromCharCode(ec.toBase10())
      }
      return ret;
   },
   toHex:function()
   {
      var ret="";
      for(var i=0;i<this.length;i++)
      {
         ret+=this.charCodeAt(i).toBase();
      }
      return "0x"+ret;
   }
});

//Sur les nombres
Object.merge(Number.prototype,{
   isNull:function(d) {return this==null ? d : this;},
   isNull2:function(a,b) {return this==null ? a : b;},
   isDate:function (){return new String(this).isDate();},
   toDate:function (){return new String(this).toDate();},
   intFormat:function(sep=" ") {return new String(this).intFormat(sep);},
   isArray:String.prototype.isArray,
   isUpper:function (a){return this>a;},
   before:function (s){return new String(this).before(s);},
   after:function (s){return new String(this).after(s);},
   sign:function (){return (this < 0) ? -1 : 1;},
   rate:String.prototype.rate,
   ucWords: function (){return new String(this).ucWords();},
   getWordCount: function (){return new String(this).getWordCount();},
   getSubstrCount: function (){return new String(this).getSubstrCount();},
   nl2br: function (){return new String(this).nl2br();},
   br2nl: function (){return new String(this).br2nl();},
   escapeRegexp: function (){return new String(this).escapeRegexp();},
   unescapeRegexp: function (){return new String(this).unescapeRegexp();},
   matches: function (s){return new String(this).matches(s);},
   startsWith: function (s){return new String(this).startsWith(s);},
   endsWith: function (s){return new String(this).endsWith(s);},
   equalsIgnoreCase: function (s){return new String(this).equalsIgnoreCase(s);},
   reverse: function (){return new String(this).reverse();},
   escapeEntities: function (){return new String(this).escapeEntities();},
   unescapeEntities: function (){return new String(this).unescapeEntities();},
   removeAccents: function (){return new String(this).removeAccents();},
   removeNonChar: function (){return new String(this).removeNonChar().toNumber();},
   isLogin: function (){return new String(this).isLogin();},
   isPasswd: function (){return new String(this).isPasswd();},
   isEmail: function (){return new String(this).isEmail();},
   isNumber: function (){return new String(this).isNumber();},
   isFloat: function (){return new String(this).isFloat();},
   PGCD:function (n){return new String(this).PGCD(n);},
   PPMC:function (n){return new String(this).PPMC(n);},
   toE:function (){return new String(this).toE();},
   toF:function (){return new String(this).toF();},
   toBase10: function (){return new String(this).toBase10(arguments.length>0?arguments[0]:16);},
   toBase: function (){return new String(this).toBase(arguments.length>0?arguments[0]:16);},
   lpad: function (nb){var caractere=arguments.length>1 ? (arguments[1].length>0 ? arguments[1] : "0") : "0";return new String(this).lpad(nb, caractere);},
   rpad: function (nb){var caractere=arguments.length>1 ? (arguments[1].length>0 ? arguments[1] : "0") : "0";return new String(this).rpad(nb, caractere);},
   ltrim: function (){return new String(this).ltrim();},
   rtrim: function (){return new String(this).rtrim();},
   trim: function (){return new String(this).trim();},
   trimCr: function (){return new String(this).trimCr();},
   replaceAll: function (sOld, sNew){return new String(this).replaceAll(sOld, sNew);},
   encodeSQL: function (){return new String(this).encodeSQL();},
   addSlashes: function (){return new String(this).addSlashes();},
   stripSlashes: function (){return new String(this).stripSlashes();},
   encodeUTF8: function (){return new String(this).encodeUTF8();},
   decodeUTF8: function (){return new String(this).decodeUTF8();},
   encode64: function (){return new String(this).encode64();},
   decode64: function (){return new String(this).decode64();},
   camelize: function (){return this;},
   stripTags: function (){return this;},
   stripScripts: function (){return this;},
   toUrl:function (){return arguments.length>0 ? new String(this).toUrl(arguments[0]) : new String(this).toUrl();},
   toNumber: function () {return this;},
   toTel: function (){return new String(this).toTel();},
   toArray:function () {return new String(this).toArray();},
   extension:function () {return new String(this).extension();},
   nameFile:function () {return new String(this).nameFile();},
   isImage:function () {return new String(this).isImage();}
});

//Sur les dates
//o : Décalage par rapport à l'heure internationale exprimé en minutes
//O : décalage par rapport à l'heure internationale, exprimé en heures
//d : Numéro du jour du mois, précédé d'un 0 si nécessaire
//D : Numéro du jours du mois
//m : Numéro du mois de l'année, précédé d'un 0 si nécessaire
//M : Nom du mois de l'année
//y : Année sur 2 chiffres
//Y : année sur 4 chiffres
//h : Heure sur 12 heures, précédés d'un 0 si nécessaire
//H : heures sur 24 heures, précédés d'un 0 si nécessaire
//i : minutes précédés d'un 0 si nécessaire
//s : secondes précédés d'un 0 si nécessaire
//x : millisecondes précédés d'un 0 si nécessaire
//w : Numéro du jour de la semaine entre 0 et 6
//W : Nom du jour de la semaine
(function(){
var xformat={   o:function() {return this.getTimezoneOffset();},
            O:function() {return Math.floor(this.getTimezoneOffset()/60);},
            d:function() {return this.getDate().lpad(2);},
            D:function() {return this.getDate();},
            m:function() {return new String(parseInt(this.getMonth())+1).lpad(2, "0");},
            y:function() {return this.getYear();},
            Y:function() {return this.getFullYear();},
            H:function() {return this.getHours().lpad(2);},
            h:function() {return this.getHours12().lpad(2);},
            i:function() {return this.getMinutes().lpad(2);},
            s:function() {return this.getSeconds().lpad(2);},
            w:function() {return this.getDay();},
            x:function() {return this.getMilliseconds();},
            W:function() {return this.getDayName();},
            M:function() {return this.getMonthName();}
         };
var listIndex=(function()
{
   var sRet="(";
   var j=0;
   for(var i in this) {
      sRet+=(j>0 ? ";" : "")+i;
      j=1;
   }
   return sRet+")";
}).apply(xformat);
Object.extend(Date.prototype, {
   isNull:function(d) {return this==null ? d : this;},
   isNull2:function(a,b) {return this==null ? a : b;},
   format:function () {
      var motif=(arguments.length>0) ? arguments[0] : null;
      if (!motif)
         return this.toString();
      var str=motif+"";
      str = str.replace(new RegExp(listIndex, "g"), "%$1");
      for(var i in xformat) {
         if(str.indexOf(i)!=-1) {
            var t = xformat[i].apply(this);
            var r = new RegExp("%"+i, "g");
            str = str.replace(r, t);
         }
      }
      return str;
   },
   isDate:function (){return true;},
   isArray:String.prototype.isArray,
   isUpper:function (a){return this>a;},
   MONTH_NAMES: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
   DAY_NAMES: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
   TIME_DAY:1000*3600*24,
   IsPentecoteFerie:true,
   replaceAll:function (sOld, sNew){return (this.toString()==sOld.toString()) ? sNew : this;},
   set: function (sDate)
   {
      if(arguments.length==1 && arguments[0].length==0) {
       sDate=(new Date()).format("%d/%m/%Y");
      }
      if(arguments.length==1)
      {
         var h=sDate.after(" ").split(":");
         var tmp=sDate.before(" ").split("/");
         this.setYear(tmp[2]);
         this.setDate(1);
         this.setMonth(parseFloat(tmp[1])-1);
         this.setDate(parseFloat(tmp[0]));
         if(h.length>=3)
         {
            this.setHours(h[0]);
            this.setMinutes(h[1]);
            this.setSeconds(h[2]);
         }
      }
      if(arguments.length>=3)
      {
         this.setYear(arguments[2]);
         this.setDate(1);
         this.setMonth(parseFloat(arguments[1])-1);
         this.setDate(parseFloat(arguments[0]));
      }
      if(arguments.length>=6)
      {
         this.setHours(arguments[4]);
         this.setMinutes(arguments[5]);
         this.setSeconds(arguments[6]);
      }
      return this;
   },
   //Ajoute nb jours
   addDay:function (nb){return new Date(this.getFullYear(), this.getMonth(), this.getDate()+parseInt(nb));},
   //Ajoute nb month
   addMonth:function (nb){return new Date(this.getFullYear(), this.getMonth()+parseInt(nb), 1);},
   //Premier jour du mois
   firstDay:function (){return new Date(this.getFullYear(), this.getMonth(), 1);},
   //Dernier jour du mois
   lastDay:function (){return this.addMonth(1).addDay(-1);},
   //Ajoute nb jours ouvrés
   addNDay:function (nb){
      var j=Math.abs(parseInt(nb));
      var s=parseInt(nb).sign();
      while(j>0)
      {
         this.setDate(this.getDate()+s);
         if(this.isOuvert()=="O")
            j--;
      }
      return this;
   },
   isWE:function()
   {
      if (this.getDay()==0 || this.getDay()==6) {
         return "W";
      }
      else {
         return "O";
      }
   },
   isOuvert:function (){
      var all=this.listeFerie(true);
      var sThisString=this.format("%d/%m/%Y");
      if(all.inArray(sThisString)) {
         return "F";
      }
      return this.isWE();
   },
   listeFerie:function(returnString)
   {
      var annee=this.getFullYear();
      var date_paque=this.getEasterDate(annee);
      var LundiPaque=date_paque.addDay(1);
      var Ascension=date_paque.addDay(39);
      var LundiPentecote=date_paque.addDay(50);
      var all=[];
      if(returnString) {
         all=[   "01/01/"+annee,
               LundiPaque.format("%d/%m/%Y"),
               Ascension.format("%d/%m/%Y"),
               "05/01/"+annee,
               "05/08/"+annee,
               "07/14/"+annee,
               "08/15/"+annee,
               "11/01/"+annee,
               "11/11/"+annee,
               "12/25/"+annee
            ];
         if(this.IsPentecoteFerie) {
            all.push(LundiPentecote.format("%d/%m/%Y"));
         }
      }
      else {
         all=[   new Date("01/01/"+annee),
               LundiPaque,
               Ascension,
               new Date("05/01/"+annee),
               new Date("05/08/"+annee),
               new Date("07/14/"+annee),
               new Date("08/15/"+annee),
               new Date("11/01/"+annee),
               new Date("11/11/"+annee),
               new Date("12/25/"+annee)
            ];
         if(this.IsPentecoteFerie) {
            all.push(LundiPentecote);
         }
      }
      return all;
   },
   trunc: function ()
   {
      return new Date(this.getFullYear(), this.getMonth(), this.getDate());
   },
   getEasterDate: function ()
   {
      var annee=arguments.length>0 ? parseInt(arguments[0]) : parseInt(this.getFullYear());
      var date_paques = null;
      var b = annee - 1900;
      var c = annee % 19;
      var d = Math.floor((7*c+1)/19);
      var e = (11*c+4-d) % 29;
      var f = Math.floor(b/4);
      var g = (b+f+31-e) % 7;
      var avril = 25-e-g;
      if (avril > 0) {
         date_paques = new Date(annee, 3, avril);
      }
      else {
         date_paques = new Date(annee, 2, avril + 31);
      }
      return date_paques;
   },
   before:function (s){return this;},
   after:function (s){return this;},
   getDayName: function (){return Date.prototype.DAY_NAMES[this.getDay()];},
   getMonthName: function (){return Date.prototype.MONTH_NAMES[this.getMonth()];},
   getHours12: function ()
   {
      var n = this.getHours();
      return (n<=12) ? n : n%12;
   },
   getPrevSunday: function ()
   {
      var x = this.getDay();
      if (x==0)
         x=7;
      return new Date(this.getTime()-(this.TIME_DAY*x));
   },
   getNextSunday: function ()
   {
      return new Date(this.getTime()+(this.TIME_DAY*(7-this.getDay())));
   },
   getLastSunday: function ()
   {
      var d = new Date(this.getTime());
      var x = this.getMonth();
      while ((z=d.getNextSunday()).getMonth()==x) {d=z;}
      return d;
   },
   getFirstSunday: function ()
   {
      var d = new Date(this.getTime());
      var x = this.getMonth();
      while ((z = d.getPrevSunday()).getMonth()==x) {d=z;}
      return d;
   },
   encode64: function (){return this.format("%D/%m/%Y %H:%i:%s").encode64();},
   decode64: function (){return this;},
   camelize: function (){return this;},
   stripTags: function (){return this;},
   stripScripts: function (){return this;},
   toUrl:function (){return arguments.length>0 ? arguments[0]+"="+this.encode64() : this.encode64();},
   toNumber: function () {return this;},
   datediff: function (per,dDate)
   {
      var d = Math.abs((dDate.getTime()-this.getTime()))/1000;
      switch(per) {
         case "yyyy": d/=12;
         case "m": d*=12*7/365.25;
         case "ww": d/=7;
         case "d": d/=24;
         case "h": d/=60;
         case "n": d/=60;
      }
      return parseInt(d);
   },
   isBissextile:function()
   {
      var aa=this.getFullYear();
      return (aa%4==0 && aa%100!=0 || aa%400==0);
   },
   getWeek:function () {
		var d = new Date(this);
		var DoW = d.getDay();
		d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
		var ms = d.valueOf(); // GMT
		d.setMonth(0);
		d.setDate(4); // Thu in Week 1
		return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
	}
});
})();
//Sur les tableaux
Object.merge(Array.prototype,{
   isArray:true,
   inArray: function (sVal){for(var i=0; i<this.length; i++){if(this[i]==sVal) return true;} return false;}, //return this.indexOf(sVal)>=0;},
   getKey: function (sVal){for(var i=0; i<this.length; i++){if(this[i]==sVal) return i;} return -1;},
   ucWords: function (){for(var i=0; i<this.length; i++){this[i]=this[i].ucWords();} return this;},
   getWordCount: function (){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].getWordCount();} return ret;},
   getSubstrCount: function (){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].getSubstrCount();} return ret;},
   before: function (s){for(var i=0; i<this.length; i++){this[i]=this[i].before(s);} return this;},
   after: function (s){for(var i=0; i<this.length; i++){this[i]=this[i].after(s);} return this;},
   nl2br: function (){for(var i=0; i<this.length; i++){this[i]=this[i].nl2br();} return this;},
   br2nl: function (){for(var i=0; i<this.length; i++){this[i]=this[i].br2nl();} return this;},
   escapeRegexp: function (){for(var i=0; i<this.length; i++){this[i]=this[i].escapeRegexp();} return this;},
   unescapeRegexp: function (){for(var i=0; i<this.length; i++){this[i]=this[i].unescapeRegexp();} return this;},
   matches: function (s){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].matches(s);} return ret;},
   startsWith: function (s){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].startsWith(s);} return ret;},
   endsWith: function (s){var ret=new Array();for(var i=0; i<this.length; i++){this[i]=ret[i].endsWith(s);} return ret;},
   equalsIgnoreCase: function (s){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].equalsIgnoreCase(s);} return ret;},
   reverseString: function (){for(var i=0; i<this.length; i++){this[i]=this[i].reverse();} return this;},
   escapeEntities: function (){for(var i=0; i<this.length; i++){this[i]=this[i].escapeEntities();} return this;},
   unescapeEntities: function (){for(var i=0; i<this.length; i++){this[i]=this[i].unescapeEntities();} return this;},
   removeAccents: function (){for(var i=0; i<this.length; i++){this[i]=this[i].removeAccents();} return this;},
   removeNonChar: function (){for(var i=0; i<this.length; i++){this[i]=this[i].removeNonChar();} return this;},
   isEmail: function (){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].isEmail();} return ret;},
   isNumber: function (){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].isNumber();} return ret;},
   isFloat: function (){var ret=new Array();for(var i=0; i<this.length; i++){ret[i]=this[i].isFloat();} return ret;},
   toE: function (){for(var i=0; i<this.length; i++){this[i]=this[i].toE();} return this;},
   toF: function (){for(var i=0; i<this.length; i++){this[i]=this[i].toF();} return this;},
   toBase10: function (){for(var i=0; i<this.length; i++){this[i]=this[i].toBase10(arguments.length>0?arguments[0]:16);} return this;},
   toBase: function (){for(var i=0; i<this.length; i++){this[i]=this[i].toBase(arguments.length>0?arguments[0]:16);} return this;},
   lpad: function (nb){var caractere=arguments.length>1 ? arguments[1] : "";for(var i=0; i<this.length; i++){this[i]=this[i].lpad(nb, caractere);} return this;},
   rpad: function (nb){var caractere=arguments.length>1 ? arguments[1] : "";for(var i=0; i<this.length; i++){this[i]=this[i].rpad(nb, caractere);} return this;},
   ltrimZ: function (){for(var i=0; i<this.length; i++){this[i]=this[i].ltrimZ();} return this;},
   ltrim: function (){for(var i=0; i<this.length; i++){this[i]=this[i].ltrim();} return this;},
   rtrim: function (){for(var i=0; i<this.length; i++){this[i]=this[i].rtrim();} return this;},
   trim: function () {for(var i=0; i<this.length; i++){this[i]=this[i].trim();} return this;},
   trimCr: function (){for(var i=0; i<this.length; i++){this[i]=this[i].trimCr();} return this;},
   clone: function() {return this.slice(0);},
   max: function() {var self = this.clone(); self.sort(function(a, b){return b-a});return self[0];},
   min: function() {var self = this.clone(); self.sort(function(a, b){return a-b});return self[0];},
   last: function() {var nb=this.length; return nb>0 ? this[nb-1] : undefined;},
   first: function() {return this.length>0 ? this[0] : undefined;},
   //toString: function ()
   decale: function ()
   {
      var iNb=arguments.length>0 ? Math.abs(arguments[0]) : 0, sWhat=arguments.length>1 ? arguments[1] : "", sWhere=arguments.length>2 ? arguments[2].toUpperCase() : "F";
      sWhere=(sWhere=="D" || sWhere=="F") ? sWhere : "F";
      while(iNb>0)
      {
         iNb--;
         if(sWhere=="F")
            this.push(sWhat);
         else
            this.unshift(sWhat);
      }
      return this;
   },
   insertBefore: function (nKey, sVal)
   {
      if(this.length<=nKey)
      {
         this[this.length]=sVal;
         return;
      }
      for(var i=this.length;i>=nKey;i--)
         this[i]=this[i-1];
      this[nKey]=sVal;
      return;
   },
   insertAfter: function (nKey, sVal)
   {
      if(this.length<=nKey)
      {
         this[this.length]=sVal;
         return;
      }
      for(var i=this.length;i>nKey;i--)
         this[i]=this[i-1];
      this[nKey+1]=sVal;
      return;
   },
   sortCol: function (iCol)
   {
      var bSort=arguments.length>1 ? arguments[1] : 0;
      var sType=arguments.length>2 ? arguments[2] : "";
      var aTmp=new Array();
      var a="", b="";
      for(var i=0;i<this.length;i++)
      {
         if(this[i][iCol].trim()=="")
         {
            iCol=0;
            bSort=0;
         }
         if(this[i][iCol])
         {
            b=eval("new String('"+this[i][iCol]+"')"+sType);
            j=0;
            var bFound=false;
            while((j<aTmp.length) && !bFound)
            {
            if(sType!="")
               a=eval("new String('"+aTmp[j][iCol]+"')"+sType);
            else
               a=aTmp[j][iCol];
            if(a.isUpper)
               if((bSort==0 && a.isUpper(b)) || (bSort>0 && !a.isUpper(b)))
                  bFound=true;
               else
                  j++;
            else
               if((bSort==0 && a>b) || (bSort>0 && a<b))
                  bFound=true;
               else
                  j++;
            }
            aTmp.insertBefore(j, this[i]);
         }
         else
            aTmp[i]=this[i];
      }
      return aTmp;
   },
   replaceAll: function (sOld, sNew){for(var i=0; i<this.length; i++){this[i]=this[i].replaceAll(sOld, sNew);} return this;},
   encodeSQL: function (){for(var i=0; i<this.length; i++){this[i]=this[i].encodeSQL();} return this;},
   addSlashes: function (){for(var i=0; i<this.length; i++){this[i]=this[i].addSlashes();} return this;},
   stripSlashes: function (){for(var i=0; i<this.length; i++){this[i]=this[i].stripSlashes();} return this;},
   encodeUTF8: function (){for(var i=0; i<this.length; i++){this[i]=this[i].encodeUTF8();} return this;},
   decodeUTF8: function (){for(var i=0; i<this.length; i++){this[i]=this[i].encodeUTF8();} return this;},
   encode64: function (){for(var i=0; i<this.length; i++){this[i]=this[i].encode64();} return this;},
   decode64: function (){for(var i=0; i<this.length; i++){this[i]=this[i].decode64();} return this;},
   camelize: function (){for(var i=0; i<this.length; i++){this[i]=this[i].camelize();} return this;},
   stripTags: function (){for(var i=0; i<this.length; i++){this[i]=this[i].stripTags();} return this;},
   stripScripts: function (){for(var i=0; i<this.length; i++){this[i]=this[i].stripScripts();} return this;},
   toUrl: function (s){var ret="";for(var i=0; i<this.length; i++){if(i>0){ret+="&";}ret+=this[i].toUrl(s+"["+i+"]");} return ret;},
   toNumber:  function (){var ret=arguments.length>0 ? arguments[0] : true;for(var i=0; i<this.length; i++){this[i]=this[i].toNumber(ret);} return this;},
   toTel:  function (){for(var i=0; i<this.length; i++){this[i]=this[i].toTel();} return this;},
   extension: function (){for(var i=0; i<this.length; i++){this[i]=this[i].extension();} return this;},
   nameFile: function (){for(var i=0; i<this.length; i++){this[i]=this[i].nameFile();} return this;},
   isImage: function (){for(var i=0; i<this.length; i++){this[i]=this[i].isImage();} return this;},
   del: function (i){for(var j=i;j<this.length-1;j++){this[j]=this[j+1];}if(i<this.length){this.pop();}return;},
   removeValue:function (x) {
      const index = this.indexOf(x);
      if (index > -1) { // only splice array when item is found
         this.splice(index, 1); // 2nd parameter means remove one item only
      }
      if(this.indexOf(x)>-1) {
         return this.removeValue(x);
      }
      return this;
   },
   forEach:function(callback /*, thisp*/) {
      var len = this.length;
      if (typeof callback != "function") {
         throw new Error("Function callback not defined !");
      }
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
         if (i in this) {
            callback.call(thisp, this[i], i, this);
         }
      }
   }
});
/*
function printBr(element, index, array) {
  document.write("<br />[" + index + "] is " + element );
}

[12, 5, 8, 130, 44].forEach(printBr);
*/
// Prototype de Math
Object.merge(Math,{
   isArray:String.prototype.isArray,
   oldRandom:Math.random,
   oldRound:Math.round
});
Object.extend(Math,{
   //_________________________________________
   //| Nb |    Retour de la fonction      |
   //|---------------------------------------|
   //|  0 | nombre entre 0 et 1.          |
   //|  1 | nombre entre 0 et 1er argument   |
   //|  2 | nombre entre 1er et 2eme argument|
   //|____|__________________________________|
   random: function ()
   {
      var min=0;
      var max=1;
      var n=Math.oldRandom();
      if(arguments.length==1) {
         max=arguments[0];
      }
      if(arguments.length==2) {
         min=arguments[0];
         max=arguments[1];
      }
      return (n*(max-min))+min;
   },
   round: function (nb)
   {
      var n=arguments.length>1 ? arguments[1] : 0;
      return Math.oldRound(nb*Math.pow(10,n))/Math.pow(10,n);
   }
});

//Sur les fonctions
Object.merge(Function.prototype,{
   bind:function (elem)
   {
      if (arguments.length < 2 && arguments[0] === undefined) {
         return this;
      }
      var thisObj = this, args = Array.prototype.slice.call(arguments), obj = args.shift();
      return function () {
            return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
         };
   }
});
//----------------------------------
//---Fin définitions de prototype---
//----------------------------------