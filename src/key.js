//------------------------
//---KEY------------------
//------------------------
(function (){
PMC.Key = PMC.Key || {};

   var tempsDernierClick=null;
   var dernierClick=null;
   var tempsEntreDeuxClics=500;

Object.extend(PMC.Key,{
   verifDoubleClic:function () {
      var elem=arguments.length>0 ? arguments[0] : this;
      var tempsClicEnCours = (new Date()).getTime();
      if ( (dernierClick == elem) && (tempsClicEnCours < tempsDernierClick + tempsEntreDeuxClics) ) {
         dernierClick = null; // on remet à zéro
         return true; // c'est bien un double-clic sur le même objet
      }
      else {
         dernierClick = elem;
         // pour être sûr de cliquer sur le même objet
         tempsDernierClick = tempsClicEnCours;
         return false; // c'est un simple clic pour le moment)
      }
   },
   recupCode:function (o_key) {
      return (o_key.keyCode) ? o_key.keyCode : o_key.which;
   },
   isSpecialKey:function (o_key) {
      var rec=self.recupCode(o_key);
      return (rec==8) || (rec==9) || (rec==13) || (rec==27) || ((rec>=33) && (rec<=40)) || (rec==116);
      //37: left arrow, 39: right arrow, 33: page up, 34: page down, 36: home, 35: end, 13: enter, 9: tab, 27: esc, 16: shift
      //17: ctrl, 18: alt, 20: caps lock, 8: backspace, 46: delete, 38: up arrow, 40: down arrow
   },
   //Test si la touche est escape
   isEsc:function (o_key) {
      return self.recupCode(o_key)==27;
   },
   returnCode:function (o_key, tst) {
      if (o_key.returnValue) {
        o_key.returnValue=tst;
        return true;
      }
      else {
         if (self.isSpecialKey(o_key)) {
            return true;
         }
         else {
          return tst;
         }
      }
   },
   //Vérification de la lettre tapée
   //o_key    : evenement
   //element  : champ texte
   verifString:function (o_key, element) {
      var N = new RegExp("^[éèêëàâäïîçùôöa-zA-Z0-9\ '-.%]");
      return self.returnCode(o_key, N.test(String.fromCharCode(self.recupCode(o_key))));
   },
   //Vérification de la lettre tapée
   verifIdent:function (o_key, element) {
      var N = new RegExp("^[a-zA-Z0-9]");
      return self.returnCode(o_key, N.test(String.fromCharCode(self.recupCode(o_key))));
   },
   //Mise en majuscule de la lettre tapée
   toUpper:function (o_key, element) {
      var N = new RegExp("^[a-zA-Z --'0-9]");
      if (N.test(String.fromCharCode(self.recupCode(o_key)))) {
         if(o_key.keyCode) {
            o_key.keyCode = String.fromCharCode(self.recupCode(o_key)).toUpperCase().charCodeAt(0);
         }
         else {
            o_key.wich = String.fromCharCode(self.recupCode(o_key)).toUpperCase().charCodeAt(0);
         }
         return self.returnCode(o_key, true);
      }
      else {
        return self.returnCode(o_key, true);
      }
   },
   //Empeche la saisie de caractères autres que des nombres entiers
   verifNumber:function (o_key, element) {
      var N = new RegExp("^[0-9]");
      //Si la première lettre tapée est le signe "-", on retourne vrai
      if((PMC.utils.getVal(element).length==0) && (self.recupCode(o_key) == 45)) {
         return self.returnCode(o_key, true);
      }
      return self.returnCode(o_key, N.test(String.fromCharCode(self.recupCode(o_key))));
   },
   //Empeche la saisie de caractères autres que des nombres décimaux
   verifFloat:function (o_key, element) {
      var N = new RegExp("^[0-9.]");
      var tmp=PMC.utils.getVal(element).split(".");
      //Si la première lettre tapée est le signe "-", on retourne vrai
      if((PMC.utils.getVal(element).length==0) && (self.recupCode(o_key) == 45)) {
         return self.returnCode(o_key, true);
      }
      if (N.test(String.fromCharCode(self.recupCode(o_key)))) {
         if ((tmp.length>1) && (self.recupCode(o_key) == 46)) {
            return self.returnCode(o_key, false);
         }
         else {
            return self.returnCode(o_key, true);
         }
      }
      else {
         return self.returnCode(o_key, false);
      }
   },
   //Empeche la saisie de caractères autres que des nombres hexadécimaux
   verifHexa:function (o_key, element) {
      var N = new RegExp("^[0-9a-fA-F%]");
      return self.returnCode(o_key, N.test(String.fromCharCode(self.recupCode(o_key))));
   }/*,
   createActiveXObject:function (id)
   {
      var error;
      var control = null;
      try
      {
        if (window.ActiveXObject)
          control = new ActiveXObject(id);
        else if (window.GeckoActiveXObject)
          control = new GeckoActiveXObject(id);
        else if(navigator.mimeTypes)
          control=navigator.mimeTypes["application/x-mplayer2"].enabledPlugin;
      }
      catch (error)
      {
        ;
      }
      return control;
   }*/
});
var self=PMC.Key;
})();