//------------------------
//---PAGE-----------------
//------------------------
(function (){
PMC.Page = PMC.Page || {};
var self=PMC.Page;
var chr=PMC.utils.chr;
Object.merge(self, {
   loaded:false, //loaded sert à déterminer si la page est complètement chargée (y compris les images, etc..)
   titre:"Famille Coste",
   css:PMC.Config.css+"framework.css",
   auteur:function () {
      alert("Paul-Marie Coste", "Cr"+chr(233)+"ateur du site");
      return false;
   },
   redirect:function (sUrl) {
      var isRedirect=arguments.length>1 ? arguments[1] : true;
      if(isRedirect) {
         window.location.href=sUrl;
      }
      return isRedirect;
   },
   print:function () {
      window.print();
      return;
   },
   goUrl:function (sAdresse, elem, isPopup) {
      isPopup=isPopup==null ? true : isPopup;
      if(isPopup) {
         self.popup(sAdresse);
      }
      else {
         elem.href=sAdresse;
      }
      return true;
   },
   getFileName:function () {
      var ret="";
      var rexp=new RegExp("(ht|f)tps?://.*\/([0-9a-z\_\+]*(.html?|.php))\\??.*", "i");
      if(arguments.length>0) {
         ret=arguments[0];
      }
      else {
         ret=window.location.href;
      }
      return ret.match(rexp)[2];
   },
   getUrlVars:function () {
      var ret="";
      if(arguments.length>0) {
         ret=arguments[0];
         if(ret.indexOf(chr(63))>0) {
            ret=ret.substring(ret.indexOf(chr(63))+1);
         }
      }
      else {
         ret=window.location.search.substring(1);
      }
      return ret;
   },
   getUrlVar:function (nomVariable) {
      var sUrl=(arguments.length>1) ? self.getUrlVars(arguments[1]) : self.getUrlVars();
      var infos=sUrl.split(chr(38));
      for(var i=0; i<infos.length; i++) {
         var ind=infos[i].indexOf(chr(61));
         var key=infos[i].substring(0, ind);
         if (key==nomVariable) {
            return infos[i].substring(ind+1);
         }
      }
      return null;
   },
   replaceUrl:function (nomVariable, newVal) {
      var sUrl=(arguments.length>2) ? self.getUrlVars(arguments[2]) : self.getUrlVars();
      if(self.getUrlVar(nomVariable, sUrl)==null) {
         return (sUrl.length>0 ? sUrl+chr(38) : "")+nomVariable+chr(61)+newVal;
      }
      var ret="";
      var infos=sUrl.split(chr(38));
      PMC.utils.forEach(infos, function(elem){
            var ind=elem.indexOf(chr(61));
            var key=elem.substring(0, ind);
            var val=elem.substring(ind+1);
            if (key==nomVariable) {
               val=newVal;
            }
            if(key!="") {
               if(ret=="") {
                  ret=key+chr(61)+val;
               }
               else {
                  ret+= chr(38)+key+chr(61)+val;
               }
            }
         });
      /*
      for(var i=0; i<infos.length; i++) {
         var ind=infos[i].indexOf(chr(61));
         var key=infos[i].substring(0, ind);
         var val=infos[i].substring(ind+1);
         if (key==nomVariable) {
            val=newVal;
         }
         if(key!="") {
            if(ret=="") {
               ret=key+chr(61)+val;
            }
            else {
               ret+= chr(38)+key+chr(61)+val;
            }
         }
      }
      */
      return ret;
   },
   /*include:function (file)
   {
     var rep=(arguments.length==1) ? PMC.Config.js : arguments[0];
     file=(arguments.length==1) ? arguments[0] : arguments[1];
     if(!PMC.DOM.loaded)
       document.write("<script type=\"text/javascript\" src=\""+rep+file+"\" xml:space=\"preserve\"></script>");
     else
     {
       var gid=document.createElement("script");
       var gbody=document.getElementsByTagName("head")[0];
       gid.setAttribute("type", "text/javascript");
       gid.setAttribute("src", rep+file);
       gbody.appendChild(gid);
     }
     return true;
   },*/
   loadScript: function (src, callback) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      if (callback) {
         if(script.addEventListener) {
            script.addEventListener('load', callback, true);
         }
         else if(script.attachEvent) {
            var done = false;
            script.attachEvent("onreadystatechange",function () {
               if ( !done && document.readyState === "complete" ) {
                  done = true;
                  callback();
               }
            });
         }
      }
      var h = document.getElementsByTagName('head')[0];
      h.appendChild(script);
      return;
   },
   popup:function (fichier) {
      var w=(arguments.length > 1) ? arguments[1] : "";
      var h=(arguments.length > 2) ? arguments[2] : "";
      var s=(arguments.length > 3) ? arguments[3] : "no";
      var r=(arguments.length > 4) ? arguments[4] : "no";
      s=((s==1) || (s=="yes")) ? "yes" : "no";
      r=((r==1) || (r=="yes")) ? "yes" : "no";
      var win=null;
      win=window.open(fichier, "pmc", "location=no,menubar=no,status=no,scrollbars="+s+",resizable="+r+",width="+w+",height="+h);
      if(win) {
         win.focus();
      }
      return win;
   },
   close:function (){opener=self;self.close();return;},
   msgError:function (nouvelle,fichier,ligne) {
      if(ligne>0) {
         PMC.utils.debug("1. Message d'erreur:\n"+nouvelle+"\n\n2. Fichier :\n"+fichier+"\n\n3. Ligne :\n"+ligne, "a");
      }
      return true;
   },
   reload:function (){window.location.href=window.location.href.before("#");return;},
   modifChamp:function (sSpan, oInput)  //affiche/cache un champ input et son libellé ==> cf date_crea, date_modif galerie
   {
      sSpan=PMC.utils.$(sSpan);
      oInput=PMC.utils.$(oInput);
      if(PMC.Element.visible(sSpan)) {
         PMC.Element.hide(sSpan);
         oInput.type="text";
         oInput.disabled=false;
         oInput.value=PMC.utils.getVal(sSpan);
      }
      else {
         PMC.Element.showinline(sSpan);
         oInput.type="hidden";
         oInput.disabled=true;
      }
      return;
   }
});
//Gestion des suppressions d'enregistrements
self.Delete = self.Delete || {};
var sUrl="";          //URL de suppression
var sRetour="";        //URL de retour à la liste des pages
var paramSubmit="";
Object.merge(self.Delete, {
   lance:function (sid)
   {
      if(sid==null) {
         sid="deleteenreg";
      }
      var aDel=PMC.utils.getClass(sid);
      PMC.utils.forEach(aDel, function(elem) {
            PMC.Event.add(elem, "click", function (e) {PMC.Event.returnFalse(e);return PMC.Page.Delete.confirmBeforeDelete(PMC.Event.element(e));return false;}, false);
         });
      /*
      for(var i=0;i<aDel.length; i++) {
         PMC.Event.add(aDel[i], "click", function (e) {PMC.Event.returnFalse(e);return PMC.Page.Delete.confirmBeforeDelete(PMC.Event.element(e));return false;}, false);
      }
      */
      return;
   },
   confirmBeforeDelete:function (oElem)
   {
      PMC.xhr.get(oElem.href, function (retXHR, param) {PMC.Page.Delete.afterConfirmBeforeDelete(retXHR, param);}, Array(oElem, oElem.href));
      //oElem.href="javascript:void(0);";
      return false;
   },
   afterConfirmBeforeDelete:function (retXHR, param)
   {
      param[0].href=param[1];//On remet l'url de départ
      sUrl=PMC.utils.getVal(retXHR.getElementsByTagName("url")[0]);
      sRetour=PMC.utils.getVal(retXHR.getElementsByTagName("retour")[0]);
      paramSubmit=PMC.utils.getVal(retXHR.getElementsByTagName("param")[0]);
      var message=PMC.utils.getVal(retXHR.getElementsByTagName("message")[0]);
      if(sUrl.length==0 || sRetour.length==0) {
         alert(message, PMC.utils.getVal(retXHR.getElementsByTagName("title")[0]));
      }
      else if(PMC.utils.exist('confirm', PMC.MsgBox)) {
         PMC.MsgBox.confirm(message, PMC.utils.getVal(retXHR.getElementsByTagName("title")[0]), null, null, {Confirmer:PMC.Page.Delete.confirmDelete, Annuler:null});
      }
      else if(PMC.utils.exist(oConfirm)) {
         return oConfirm(message);
      }
      else {
         return confirm(message);
      }
      return false;
   },
   confirmDelete:function ()
   {
      PMC.xhr.post(sUrl.decode64(), function(retXHR) {afterDelete(retXHR);}, null, paramSubmit+"&r="+sRetour);
      if(PMC.utils.exist('hide', PMC.MsgBox)) {
         PMC.MsgBox.hide();
      }
      return;
   }
});
var afterDelete=function (retXHR)
{
   self.redirect(sRetour.decode64());
   return;
};
})();
//Fin gestion des suppressions d'enregistrements