//------------------------
//---Librairie de base----
//------------------------
/*
function eval() {
   var msg='Eval is evil !';
   if(oAlert)
      oAlert(msg);
   else
      alert(msg);
}
*/
//Définition du namespace
if(typeof(PMC)=='undefined') {
   var PMC = {};
}
//Fonction définissant l'extension d'un objet
(function () {
   PMC.utils = PMC.utils || {};
   //Test l'existance d'un objet ou d'une variable
   PMC.utils.exist = function (methode, objet) {
      objet = objet || window;
      return typeof(objet) !='undefined' && typeof(objet[methode]) !='undefined';
   };
   if(!PMC.utils.exist('extend', Object)) {
      Object.extend = function (destination, source) {
         for (var property in source) {
            destination[property] = source[property];
         }
//         return destination;
      };
   }
   /*
   if(!PMC.utils.exist(Object.extendNotExists)) {
   {
      Object.extendNotExists = function (destination, source) {
         for (var property in source) {
            if(destination[property]==undefined) {
               destination[property] = source[property];
            }
         }
//         return destination;
      };
   }*/

   if(!PMC.utils.exist('merge', Object))
   {
      Object.merge=function (oRecv, oGive)
      {
         for (var sPropName in oGive) {
            if (oGive.hasOwnProperty(sPropName)) {
               if(!oRecv.hasOwnProperty(sPropName)) {
                  oRecv[sPropName] = oGive[sPropName];
               }
               else {
                  Object.merge(oRecv[sPropName], oGive[sPropName]);
               }
            }
         }
      }
   }
})();
//Object.merge(Object.prototype, {isArray:false});