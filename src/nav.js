//------------------------
//---NAV------------------
//------------------------
//Intégration de la librairie de navigation dans les pages
(function (){
PMC.utils = PMC.utils || {};

   var tmp=null;
   var oldClass=Array();
Object.extend(PMC.utils,{
   roll:function (elem, balise, dossierImage) {
      if(dossierImage==null) {
         dossierImage=PM.Config.img;
      }
      if(elem.parentNode.getElementsByTagName(balise).length==0) {
         if(elem.tagName!="html") {
            self.roll(elem.parentNode, balise, dossierImage);
         }
      }
      else {
         var p=elem.parentNode.getElementsByTagName(balise);
         for(var i=0;i<p.length;i++) {
            var aff=(arguments.length>3) ? arguments[3] : p[i].style.display=="none";
            p[i].style.display=(aff) ? "block" : "none";
            var img=elem.getElementsByTagName("img");
            if(img[0]) {
               img[0].src=(p[i].style.display=="none") ? dossierImage+"b_right2.ico" : dossierImage+"b_down2.ico";
            }
         }
      }
      return true;
   },
   //Récupération des éléments d'un formulaire à envoyer en url
   ElemToUrl:function (frm, sSep, bReplace) {
      if(sSep==null) {
         sSep="&";
      }
      if(bReplace==null) {
         bReplace=false;
      }
      var elem;
      var i = 0;
      var chaine = new Array();
      for (var i=0; i<frm.elements.length; i++) {
         elem = frm.elements[i];
         switch (elem.type) {
            case "radio":
               if (elem.checked) {
                  chaine.push(elem.name+"="+elem.value.encode64());
               }
               break;
            case "select-one":
               chaine.push(elem.name+"="+elem.value.encode64());
               break;
            case "submit":
               break;
            case "button":
               break;
            default:
               chaine.push(elem.name+"="+elem.value.encode64());
               break;
         }
      }
      if(bReplace) {
         return chaine.join(sSep).encodeUrl();
      }
      else {
         return chaine.join(sSep);
      }
   },
   sendToZip:function (sPath, aRet, sLibelle) {
      var w=(arguments.length > 3) ? arguments[3] : "";
      var h=(arguments.length > 4) ? arguments[4] : "";
      var s=(arguments.length > 5) ? arguments[5] : "no";
      var r=(arguments.length > 6) ? arguments[6] : "no";
      s=((s==1) || (s=="yes")) ? "yes" : "no";
      r=((r==1) || (r=="yes")) ? "yes" : "no";
      var win=PMC.Page.popup("", w, h, s, r);
      win.document.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\" lang=\"fr\">\n");
      win.document.write("<head><title>"+PMC.Page.title+" [T&#233;l&#233;chargement de fichier ZIP]</title>\n<link rel=\"stylesheet\" type=\"text/css\" href=\""+PMC.Page.css+"\" media=\"all\"></link>\n");
      win.document.write("</head>\n<body onload=\"document.forms[0].submit();\">\n<div id=\"contenu\">");
      win.document.write("<p id=\"titrepage\" class=\"zip\">Pr&#233;paration du t&#233;l&#233;chargement.</p><form name=\"mpm\" action=\"../_php/zip.php\" method=\"POST\">\n");
      win.document.write("<input type=\"hidden\" name=\"nom\" value=\""+sLibelle+"\" />");
      win.document.write("<input type=\"hidden\" name=\"path\" value=\""+sPath+"\" />");
      for(var i=0; i<aRet.length; i++)
        win.document.write("<input type=\"hidden\" name=\"p[]\" value=\""+aRet[i]+"\" />");
      win.document.write("\n<input type=\"submit\" value=\"T&#233;l&#233;charger\" class=\"envoi\" />\n");
      win.document.write("<p id=\"end\"><a id=\"close\" onclick=\"javascript:window.close();\" title=\"Fermer la fenêtre\" href=\"javascript:void(0);\">Fermer</a></p>\n");
      win.document.write("</form></div></body></html>");
      win.document.close();
      return true;
   },
   openclose:function (elem) {
      elem.className=(elem.className=='ouvert') ? 'ferme' : 'ouvert';
      var pere=PMC.DOM.getParent(elem, 'dl');
      var elemDD=pere.getElementsByTagName('dd');
      PMC.utils.forEach(elemDD, function(element){PMC.Element.affDiv(element, elem.className=='ouvert');});
      /*
      for(var i=0;i<elemDD.length;i++)
         PMC.Element.affDiv(elemDD[i], elem.className=='ouvert');
      */
      PMC.Cookie.set(pere.id,elem.className);
      return true;
   },
   //Focus sur le premier champ text
   firstFocus:function () {
      var isFocus=false;
      PMC.utils.forEach(document.forms, function(frm) {
         if(!isFocus) {
            PMC.utils.forEach(frm.elements, function(elem) {
               if(((elem.type=="text") || (elem.type=="search") || (elem.type=="number")) && (!elem.disabled) && (frm.name!="conv") && PMC.Element.visible(elem) && (frm.name!="repertoire") && !isFocus) {
                  if(elem.id && elem.id!="timer") {
                     elem.focus();
                     isFocus=true;
                  }
                  else {
                     elem.focus();
                     isFocus=true;
                  }
               }
            });
         }
      });
      return;
   },
   getFocus:function () {
      if(PMC.MsgBox.hide) {
         PMC.MsgBox.hide();
      }
      if(tmp && tmp.focus) {
         tmp.focus();
      }
      return;
   },
   isNotEmpty: function (elem, libelle) {
      var sType=elem.type;
      var ret=arguments.length>2 ? arguments[2] : elem;
      tmp=ret;
      if(sType=="text") {
         if(PMC.utils.getVal(elem).length<=0) {
            alert("Le champ "+PMC.utils.chr(34)+libelle+PMC.utils.chr(34)+" est vide.\nMerci de le renseigner avant d'enregistrer les donn"+PMC.utils.chr(233)+"es.", "Un champ est vide", null, function (){PMC.utils.getFocus();});
            return false;
         }
      }
      else if(sType=="select-one") {
        if((PMC.utils.getVal(elem[elem.selectedIndex])=="0") || (PMC.utils.getVal(elem[elem.selectedIndex])=="") || (PMC.utils.getVal(elem[elem.selectedIndex])=="-")) {
            alert("La liste "+PMC.utils.chr(34)+libelle+PMC.utils.chr(34)+" n'est pas renseign"+PMC.utils.chr(233)+"e.\nMerci de s"+PMC.utils.chr(233)+"lectionner un "+PMC.utils.chr(233)+"l"+PMC.utils.chr(233)+"ment de la liste.", "Une liste est vide", null, function (){PMC.utils.getFocus();});
            ret.focus();
            return false;
         }
      }
      else if(sType=="hidden") {
         if(elem.value.length<=0) {
            alert("Le champ "+PMC.utils.chr(34)+libelle+PMC.utils.chr(34)+" est vide.\nMerci de le renseigner avant d'enregistrer les donn"+PMC.utils.chr(233)+"es.", "Un champ est vide", null, function (){PMC.utils.getFocus();});
            ret.focus();
            return false;
         }
      }
      return true;
   },
   openXLS:function () {
      var elem=arguments.length>0 ? arguments[0] : "";
      var sType=arguments.length>1 ? arguments[1] : "block";
      if(sType==null) {
        sType="block";
      }
      var sid=arguments.length>2 ? arguments[2] : "detailOutils";
      var gid=PMC.utils.$(sid);
      gid.style.display=(gid.style.display==""||gid.style.display=="none") ? sType : "none";
      if(elem) {
         for(var i=0; i<elem.getElementsByTagName("img").length; i++) {
            elem.getElementsByTagName("img")[i].src=(gid.style.display==sType) ? PMC.Config.img+"picto_apercuU.gif" : PMC.Config.img+"picto_apercuD.gif";
         }
      }
      return false;
   },
   modif_id:function (sid, elem) {
      var gid=PMC.utils.$(sid);
      gid.disabled=!gid.disabled;
      gid.className=gid.disabled ? "disabled" : "enabled";
      if(elem) {
        PMC.DOM.getChild(elem, "img").src=gid.disabled ? PMC.Image.enabled : PMC.Image.disabled;
      }
      if(!gid.disabled) {
         gid.focus();
      }
      return false;
   },
   selectionnerImg:function (elem) {
      elem.parentNode.className=(elem.checked ? "gris" : "");
      return true;
   },
   selImg:function (sType, sid) {
      if(sid==null) {
        sid="resultat";
      }
      var gid=PMC.utils.$(sid);
      if(gid) {
         var allElem=gid.getElementsByTagName("input");
         PMC.utils.forEach(allElem, function(elem){
            if(elem["type"] && elem.type=="checkbox") {
               elem.checked=(sType=="all") || !elem.checked;
               self.selectionnerImg(elem);
            }
         });
        /*
        for(var i=0;i<allElem.length;i++)
        {
          if(allElem[i]["type"] && allElem[i].type=="checkbox")
          {
            allElem[i].checked=(sType=="all") || !allElem[i].checked;
            self.selectionnerImg(allElem[i]);
          }
        }
        */
      }
      return true;
   },
   downloadSelection:function (sid, sPath, sLibelle, sType, fct, droit) {
      var ret=Array();
      if(sid==null) {
        sid="resultat";
      }
      if(sPath==null) {
        sPath=="";
      }
      if(sType==null) {
        sType="input";
      }
      if(sLibelle==null) {
         sLibelle="galerie".encode64();
      }
      if(droit==null) {
         droit="29".encode64();
      }
      var gid=PMC.utils.$(sid);
      if(gid) {
         if(sType=="input") {
            var allElem=gid.getElementsByTagName(sType);
            for(var i=0;i<allElem.length;i++) {
               if(allElem[i]["checked"] && allElem[i].checked) {
                  ret.push(PMC.utils.getVal(allElem[i]));
                  if(fct=="zip") {
                     break;
                  }
               }
            }
         }
         if(ret.length>0) {
            if(fct=="zip") {
               document.forms["mpm"].submit();
            }
            else if(fct=="java") {
               document.forms["mpm"].action="../_php/vault.php";
               document.forms["mpm"].submit();
            }
            else if(fct!=null) {
               fct(sPath, ret, droit);
            }
            else {
               PMC.utils.debug("Vous devez s&#233;lectionner au moins un fichier.");
            }
         }
         else {
            var allElem=gid.getElementsByTagName(sType);
            for(var i=0;i<allElem.length;i++) {
               if(allElem[i].parentNode.nodeName.toLowerCase()=="td") {
                  for(var j=0;j<allElem[i].attributes.length;j++) {
                     if(allElem[i].attributes[j].nodeName=="class") {
                        if(allElem[i].attributes[j].nodeValue=="fon") {
                           ret.push(PMC.utils.getVal(allElem[i]).encode64());
                        }
                        break;
                     }
                  }
               }
            }
            if(ret.length>0) {
               if(fct=="zip") {
                  self.sendToZip(sPath, ret, sLibelle, '300px','150px', true, true);
               }
               else if(fct!=null) {
                  fct(sPath, ret, droit);
               }
            }
            else {
               PMC.utils.debug("Vous devez s&#233;lectionner au moins un fichier.");
            }
         }
      }
      else {
         PMC.utils.debug("Impossible de r&#233;cup&#233;rer l'identifiant ".sid);
      }
      return true;
   },
   //Suppression d'un élément
   delRow:function (elem, pere) {
      if(pere==null) {
         pere="tr";
      }
      var row=PMC.DOM.getParent(elem, pere);
      row.parentNode.removeChild(row);
      return true;
   },
   //Déplacement de l'élément vers le haut
   upRow:function (elem, pere) {
      if(pere==null) {
         pere="tr";
      }
      var fPere=PMC.DOM.getParent(elem, pere);
      var gid=fPere.parentNode;
      var allChilds=gid.childNodes;
      if(gid.firstChild==fPere) {
         return true;
      }
      for(var i=0;i<allChilds.length;i++) {
         if(allChilds[i]==fPere) {
            var tmp=allChilds[i-1];
            gid.insertBefore(fPere, tmp);
            return true;
         }
      }
      return false;
   },
   //Déplacement de l'élément vers le bas
   downRow:function (elem, pere) {
      if(pere==null) {
         pere="tr";
      }
      var fPere=PMC.DOM.getParent(elem, pere);
      var gid=fPere.parentNode;
      var allChilds=gid.childNodes;
      if(gid.lastChild==fPere) {
         return true;
      }
      for(var i=0;i<allChilds.length;i++) {
         if(allChilds[i]==fPere) {
            var tmp=allChilds[i+1];
            gid.insertBefore(tmp, fPere);
            return true;
         }
      }
      return false;
   },
   AddTags:function (message, str_deb, str_fin) {
      if (PMC.utils.navigator.isMSIE) {
         message.focus();
         var txt = document.selection.createRange().text;
         var rng=document.selection.createRange();
         if (txt=="") {
            rng.text= str_deb + str_fin;
         }
         else {
            rng.text= str_deb + rng.text + str_fin;
         }
         rng.moveEnd("character", -str_fin.length);
         rng.select();
      }
      else if (message.selectionStart != null) {
         objectValue = PMC.utils.getVal(message);
         objectValueDeb = objectValue.substring(0, message.selectionStart);
         objectValueFin = objectValue.substring(message.selectionEnd, message.textLength);
         objectSelected = objectValue.substring(message.selectionStart, message.selectionEnd);
         message.value = objectValueDeb + str_deb + objectSelected + str_fin + objectValueFin;
         message.focus();
         message.selectionStart = message.value.length - objectValueFin.length;
         message.selectionEnd = message.selectionStart;
      }
      else {
         message.value += str_deb + str_fin;
      }
      return true;
   },
   AddScript:function (f) {self.AddTags(f, '[SCRIPT]\n', '[/SCRIPT]\n');return true;},
   AddUrl: function (f) {self.AddTags(f, '[A]', '[/A]');return true;},
   AddBold:function (f) {self.AddTags(f, '[B]', '[/B]');return true;},
   AddSmiley:function (sInput, smiley) {self.AddTags(sInput, ' '+smiley+' ', '');return true;},
   //Affiche le détail ou non d'une liste de commentaires
   afficheCommentaire:function (sid) {
      var gid=PMC.utils.$(sid);
      if(!gid) {
         return false;
      }
      var allLigne=gid.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
      var j=1;
      for(var i=0;i<allLigne.length;i++) {
         j=1-j;
         if(j==0) {
            allLigne[i].onclick=function () {
               var elem=this;var p=elem.parentNode.getElementsByTagName("tr");
               var b=0;
               for(var a=0;a<p.length;a++)
               {
                  if(p[a]==elem)
                  {
                     b=a;
                     break;
                  }
               }
               if(p[b+1]!=null) {
                  p[b+1].style.display=(p[b+1].style.display=="none") ? "" : "none";
               }
               return true;
            }
         }
      }
      return true;
   },
   disableSelection:function (target){
      if (typeof target.ondragstart!="undefined") //IE route
          target.ondragstart=function (){return false};
      if (typeof target.onselectstart!="undefined") //IE route
          target.onselectstart=function (){return false};
      else if (target.style!=null)
      {
         if(typeof target.style.MozUserSelect!="undefined") //Firefox route
            target.style.MozUserSelect="none";
         else //All other route (ie: Opera)
            target.onmousedown=function (){return false};
      }
      //target.style.cursor = "default";
      return false;
   },
   ModifierClass:function () {
      var sClass = (arguments.length>0) ? arguments[0] : "listeresultat";
      if(sClass=="")
         sClass="listeresultat";
      var allGid=PMC.utils.getClass(sClass);
      for(var iElem=0;iElem<allGid.length;iElem++)
      {
         var gid=allGid[iElem];
         var tbody=PMC.DOM.getChild(gid, "tbody");
         var elemTr=tbody.getElementsByTagName("tr");
         if (tbody)
         {
            for(var i=0;i<elemTr.length; i++)
            {
               PMC.Event.add(elemTr[i], "click",     function (e) {if (self.changeClass!=null) {return self.changeClass('click', PMC.Event.element(e));} else {return null;}}, false);
               PMC.Event.add(elemTr[i], "mouseout",  function (e) {if (self.changeClass!=null) {return self.changeClass('out', PMC.Event.element(e));} else {alert('Erreur');return null;}}, false);
               PMC.Event.add(elemTr[i], "mouseover", function (e) {if (self.changeClass!=null) {return self.changeClass('over', PMC.Event.element(e));} else {return null;}}, false);
               //elemTr[i].onmouseover= function () {if (self.changeClass!=null) {return self.changeClass('over', this);} else {return null;}};
               //elemTr[i].onmouseout= function () {if (self.changeClass!=null) {return self.changeClass('out', this);} else {return null;}};
               //elemTr[i].onclick= function () {if (self.changeClass!=null) {return self.changeClass('click', this);} else {return null;}};
            }
         }
      }
      return true;
   },
   changeClass:function (ev, elem) {
      elem=PMC.DOM.getParent(elem, 'tr');
      switch(ev) {
         case "over":
            if(elem.className.startsWith('ligne'))
               oldClass[elem.rowIndex]=elem.className;
            elem.className=((elem.className=="click") || (elem.className=="outclick")) ? "overclick" : "over";
            break;
         case "out":
            if((elem.className=="click") || (elem.className=="outclick") || (elem.className=="overclick"))
               elem.className="outclick";
            else
            {
               if(oldClass[elem.rowIndex])
                  elem.className= oldClass[elem.rowIndex];
            }
            break;
         case "click":
            elem.className=((elem.className=="overclick") || (elem.className=="click")) ? "over" : "click";
            break;
      }
      return true;
   },
   getListeTr:function (sid) {
      var gid=PMC.utils.$(sid);
      var tbody=null, listeTr=null;
      if(gid)
         tbody=PMC.DOM.getChild(gid, "tbody");
      if(tbody)
         listeTr=tbody.getElementsByTagName("tr");
      return listeTr;
   },
   selTable:function (sType) {
      var sid=(arguments.length>1) ? arguments[1] : "resultat";
      var listeTr=self.getListeTr(sid);
      var clName="";
      if(sType=="all")
         clName="outclick";

      if(listeTr)
      {
         for(var i=0; i<listeTr.length;i++)
         {
            if(PMC.Element.visible(listeTr[i]))
            {
               if(sType=="inverse")
                  listeTr[i].className=(listeTr[i].className!="outclick") ? "outclick" : "";
               else
                  listeTr[i].className=clName;
            }
         }
      }
      else
         alert("Impossible de trouver les lignes");
      return true;
   },
   affTable:function (val) {
      var sid=(arguments.length>1) ? arguments[1] : "resultat";
      var listeTr=self.getListeTr(sid);
      var nb=0, txt="";

      if(listeTr)
      {
         for(var i=0; i<listeTr.length;i++)
         {
            if(!val)
            {
               if (listeTr[i].className=="outclick")
                  listeTr[i].style.display="none";
            }
            else
               listeTr[i].style.display="";
         }
      }
      else
         alert("Impossible de trouver les lignes s"+PMC.utils.chr(233)+"lectionn"+PMC.utils.chr(233)+"es");
      return true;
   }
});
var self=PMC.utils;
})();