//------------------------
//---API------------------
//------------------------
(function () {
//Récupération de l'url de la frame mère
//var p=(function() {
//   return (function() {
//      var g=function(w, p) {
//         return (w==p) ? w : g(p, p.parent);
//      };
//      return window==window.parent ? window : g(window, window.parent);
//   })();
//})();
var p=window;
var KEY={"localhost":"BRjQWpxVMKxBTmY5TRnqij3OsosdAj4d"};
var getScript=(function() {
   var ret='';
   PMC.utils.forEach(document.getElementsByTagName("script"), function(elem) {
      if(elem && elem.src && elem.src!="") {
         var r=new RegExp(/1oneFile\.(min)?js/, "gi");
         var x=elem.src.match(/1oneFile\.(min\.)?js/, "gi");
         if(x) {
            ret=elem.src;
         }
      }
   });
   return ret;
})();
var getUrlVar=function (nomVariable, sUrl) {
   var infos=sUrl.split(String.fromCharCode(38));
   for(var i=0; i<infos.length; i++) {
      var ind=infos[i].indexOf(String.fromCharCode(61));
      var key=infos[i].substring(0, ind);
      if (key==nomVariable) {
         return infos[i].substring(ind+1);
      }
   }
   return null;
};
var getKey=getUrlVar("KEY", getScript.after("?"));
var getServer=function() {
   if(p.location.hostname && p.location.hostname!="") {
      return p.location.hostname;
   }
   else {
      var res=p.location.href.match(/^https?:\/\/([^\/]*)\/.*$/, "gi");
      return res.length>0 ? res[1].before(":") : false;
   }
};
if(KEY[getServer()]!=getKey) {
   PMC.utils.debug("Votre clé n'est pas valide. Merci d'en demander une.");
   PMC={};
   PMC={"utils":{"$":function(){}}, "Page":{"onLoad":{"add":function(){}, "exec":function(){}}}, "xhr":{"get":function(){}, "post":function(){}}, "onLoad":{"add":function(){}, "exec":function(){}}, "Config":{"fmwk":""}, "DOM":{"loaded":false}};
}
})();

