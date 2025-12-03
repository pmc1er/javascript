/**
 * Class for converting between HTML and RGB integer color formats.
 * Accepts either a HTML color string argument or three integers for R, G and B.
 * @constructor
*/
(function() {
Object.merge(PMC, {
   Color:function ()
   {
      if(arguments.length == 3) {
         this.red = arguments[0];
         this.green = arguments[1];
         this.blue = arguments[2];
      }
      else if(arguments.length == 1) {
         this.setHexColor(arguments[0]);
      }
   }
});
var reHex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
Object.merge(PMC.Color.prototype, {
   toString:function() {
      return "rgb("+this.red+", "+this.green+", "+this.blue+")";
   },
   /**
    * Set the color from the supplied HTML hex string.
    * @param {String} strHexColor A HTML hex color string e.g. '#00FF88'.
    */
   setHexColor : function (strHexColor)
   {
      var match = strHexColor.match(reHex);
      if(match) {
         // grab the code - strips off the preceding # if there is one
         strHexColor = match[1];
      }
      else {
         throw 'Invalid HEX color format, expected #000, 000, #000000 or 000000';
      }
      // if a three character hex code was provided, double up the values
      if(strHexColor.length == 3) {
         strHexColor = strHexColor.replace(/\w/g, function (str){return str.concat(str);});
      }
      this.red = parseInt(strHexColor.substr(0,2), 16);
      this.green = parseInt(strHexColor.substr(2,2), 16);
      this.blue = parseInt(strHexColor.substr(4,2), 16);
   },
   /**
    * Retrieve the color value as an HTML hex string.
    * @returns {String} Format '#00FF88'.
    */
   getHexColor : function ()
   {
      var rgb = this.blue | (this.green << 8) | (this.red << 16);
      var hexString = rgb.toString(16).toUpperCase();
      if(hexString.length <  6){
         hexString = '0' + hexString;
      }
      return '#' + hexString;
   }
});
})();