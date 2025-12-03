//------------------------
//---MSGBOX---------------
//------------------------
(function(){
//Largeur par défaut des boutons
var buttonWidth=100;
//Liste d'instances
var currentInstances = new PMC.Collection();

//On cache la popin
var hide=function() {
   if(this.gid) {
      PMC.Element.hide(this.gid);
   }
   if(this.gidpopin) {
      PMC.Element.hide(this.gidpopin);
   }
   return;
};
var remove=function() {
   currentInstances.remove(this);
   if(this.gid) {
      PMC.DOM.remove(this.gid);
   }
   if(this.gidpopin) {
      PMC.DOM.remove(this.gidpopin);
   }
};
//Si la popin doit être supprimée, on la supprime sinon on la cache
var close=function() {
   if(this.removeAfterClose) {
      remove.apply(this);
   }
   else {
      hide.apply(this);
   }
};
//On cache ou on affiche la popin
var toggle=function() {
   return PMC.Element.visible(this.gid) ? hide.apply(this) : show.apply(this);
};
var move=function() {
   if(this.gid) {
      //PMC.Element.moveTo(this.gidpopin, PMC.Screen.scrollX, PMC.Screen.scrollY);
      PMC.Element.moveTo(this.gid, PMC.Screen.windowX/2+PMC.Screen.scrollX, PMC.Screen.windowY/2+PMC.Screen.scrollY);
   }
   return;
};
//Lance l'exécution des fonctions après clique sur le bouton correspondant
var exec=function(idButton) {
   if(this.button[idButton]!=null) {
      if(this.button[idButton].fct) {
         if(typeof this.button[idButton].fct=="function") {
            this.button[idButton].fct.apply(this);
         }
      else {
         this.button[idButton].fct;
      }
   }
   else
      if(typeof this.button[idButton]=="function") {
         this.button[idButton].apply(this);
      }
      else {
         this.button[idButton];
      }
   }
   if(this.hideAfterCick) {
     hide.apply(this);
   }
   if(this.hideAfterCick && this.removeAfterClose) {
     remove.apply(this);
   }
   return;
};
//Nombre de boutons contenus dans la popin
var allButton=function() {
   var iNbRet=0;
   var iWidthTotal=0;
   for(var i in this.button) {
      iNbRet++;
      iWidthTotal += (this.button[i].width) ? this.button[i].width.toNumber() : buttonWidth;
   }
   return {nb:iNbRet, width:iWidthTotal};
};
//Dessine les boutons de la popin
var drawButton=function (gid) {
   var ret="";
   var nbButton=allButton.apply(this);
   for(var i in this.button) {
      //On enlève 2px de large car il y a une bordure de 1px
      var css="display:block;float:left;padding:0.3em 0 0.4em 0;width:"+(this.button[i].width.toNumber()-2)+"px;height:1em;text-align:center;margin:";
      css+="0 0 0 "+((this.getWidth()-nbButton.width)/(nbButton.nb+1))+"px;";
      var myButton=PMC.DOM.create(gid, "a", { "class":"button",
                                    "href":"javascript:void(0)",
                                    "style":css,
                                    "html":i.nl2br()
                                   });
      PMC.Event.add(myButton, "click", exec.bind(this, i), true);
   }
   return;
};
var afterXHR=function(retXHR, param) {
   this.gidMessage.innerHTML=PMC.utils.getVal(retXHR.getElementsByTagName("root")[0]).nl2br();
};
//Dessine la popin
var createPopin=function() {
   if(PMC.Screen.windowX<this.getWidth()) {
      this.dimension.width=PMC.Screen.windowX;
   }
   if(PMC.Screen.windowY<this.getHeight()) {
      this.dimension.height=PMC.Screen.windowY;
   }
   //On ajoute une div de 100% de large et de 100% de haut
   this.gidpopin=PMC.DOM.create(window.document, "div", {  "style":"z-index:"+this.index,
                                             "class":"msgbox_total"
                                           });
   //Lorsqu'on clique sur cette div, on ferme la popin
   PMC.Event.add(this.gidpopin, "click", close.bind(this), true);

   //On ajoute la popin
   this.gid=PMC.DOM.create(window.document, "div", {   "class":"msgbox",
                                          "style":"position:absolute;top:50%;left:50%;width:"+this.getWidth()+"px;height:"+this.getHeight()+"px;"+
                                               "margin:-"+(this.getHeight()/2)+"px 0 0 -"+(this.getWidth()/2)+"px;z-index:"+this.index
                                       });

   //On ajoute le lien pour la fermeture de la popin
   var oClose=PMC.DOM.create(this.gid, "a", {  "class":"close",
                                    "style":"display:block;position:relative;top:-14px;left:"+(this.getWidth()-15)+"px",
                                    "href":"javascript:void(0);"
                                  });
   //On ajoute l'image de fermeture
   PMC.DOM.create(oClose, "img", {"src":PMC.Config.img+"fancy_closebox.png"});
   //Lorsqu'on clique sur ce bouton, on ferme la popin
   PMC.Event.add(oClose, "click", close.bind(this), true);
   //On ajoute la div titre de la popin
   PMC.DOM.create(this.gid, "div", {   "class":"title",
                              "html":this.title.escapeEntities().nl2br()
                           });
   //On ajoute la div message de la popin
   this.gidMessage=PMC.DOM.create(this.gid, "div", {   "class":"message",
                                          "html":this.message.escapeEntities().nl2br()
                                       });
   //Redimensionnement hauteur popin
   var onAppend = function(elem, f) {
      var observer = new MutationObserver(function(mutations) {
         mutations.forEach(function(m) {
            if (m.addedNodes.length) {
               f(m.addedNodes);
            }
         });
      });
      observer.observe(elem, {childList: true})
   };
   var elem=this;
   onAppend(this.gidMessage, function(added) {
      if(elem.getHeight()<elem.gidMessage.scrollHeight+80) {
         elem.gid.style.height=(elem.gidMessage.scrollHeight+80)+"px";
         elem.gid.style.top=(parseInt(elem.gid.style.top)-(elem.gidMessage.scrollHeight - elem.getHeight())/2)+"px";
      }
   });

   if(this.prompt) {
      this.promptInput=PMC.DOM.create(this.gidMessage, "input", { "type":"text",
                                                   "style":"margin-left:0.3em"
                                                  });
   }
   //On créé une div pour les boutons de la popin
   if(this.button!={}) {
      var oButton=PMC.DOM.create(this.gid, "div", {"class":"button"});
      //On ajoute les boutons dans cette div
      drawButton.call(this, oButton);
   }
   //Appel xhr s'il y a une url à appeler
   if(this.url) {
      PMC.xhr.post(this.url, afterXHR.bind(this), null, this.urlParam);
   }
   return;
};

//Constructeur
PMC.MsgBox = function() {
   this.gid=null;
   this.gidpopin=null;
   this.xhr=null;
   this.gidMessage=null;
   this.title=PMC.Page.titre;
   this.url=null;
   this.urlParam=null;
   this.message="";
   this.dimension={"width":400, "height":150};
   this.removeAfterClose=true;
   this.hideAfterCick=true;
   this.button={};
   this.prompt=false;
   currentInstances.add(this);
   this.index=10*(parseInt(currentInstances.nb));
   this.getWidth =function() {return PMC.Screen.windowX<this.dimension.width ? PMC.Screen.windowX :this.dimension.width;};
   this.getHeight=function() {return PMC.Screen.windowY<this.dimension.height ? PMC.Screen.windowY :this.dimension.height;};
};
//Extensions du constructeur
Object.extend(PMC.MsgBox.prototype, {
   //On ajoute des boutons à la popin
   addButton:function(oButton)    {
      for(var i in oButton) {
         if(oButton[i]) {
            this.button[i]= {"fct":oButton[i].fct ? oButton[i].fct : oButton[i],
                         "width": oButton[i].width ? oButton[i].width : buttonWidth
                        };
         }
         else {
            this.button[i]= {"fct":null,
                         "width": buttonWidth
                        };
         }
      }
      return this.button;
   },
   //On supprime le bouton à la popin
   delButton:function(sidButton) {
      for(var i in this.button) {
         if(i==sidButton) {
            delete this.button[i];
         }
      }
      return;
   },
   //On affiche la popin. Si elle n'existe pas dans le DOM, on la créé.
   show:function() {
      if(!this.gid) {
         createPopin.apply(this);
         if(this.url!=null) {
            this.gidMessage.innerHTML="<img src=\""+PMC.Image.loading+"\" /> Chargement en cours</div>"+this.message.escapeEntities().nl2br();
         }
      }
      move.apply(this);
      PMC.Element.show(this.gidpopin);
      PMC.Element.show(this.gid);
      return;
   },
   //On cache la popin
   hide:function() {
      hide.apply(this);
   },
   //On cache ou on affiche la popin
   toggle:function() {
      toggle.apply(this);
   }
});
//On bouge toutes les popins
PMC.MsgBox.move=function() {
   currentInstances.forEach(function(elem) {move.apply(elem)});
   /*
   for(var i=0;i<currentInstances.nb;i++) {
      move.apply(currentInstances[i]);
   }*/
};
//On cache la dernière popin visible
PMC.MsgBox.close=function() {
   var i=currentInstances.nb-1;
   while(i>=0 && !PMC.Element.visible(currentInstances[i].gid)) {
      i--;
   }
   if(i>=0) {
      close.apply(currentInstances[i]);
   }
   return;
};
//On créé une popin
PMC.MsgBox.popin=function(message, title, dimension, button) {
   var myPopin=new PMC.MsgBox();
   myPopin.title=title || myPopin.title;
   myPopin.dimension=dimension || myPopin.dimension;
   if(button) {
      myPopin.addButton(button);
   }
   myPopin.message=message;
   myPopin.removeAfterClose=true;
   myPopin.show();
   return myPopin;
};
//Remplace le window.alert
PMC.MsgBox.alert=function(message, title, dimension, fnAfterClose) {
   if(!PMC.DOM.loaded) {
      oAlert(message);
      if(fnAfterClose) {
         fnAfterClose();
      }
      return null;
   }
   else {
      var myAlert=new PMC.MsgBox();
      myAlert.title=title || myAlert.title;
      myAlert.message=message;
      myAlert.addButton({"Ok":fnAfterClose});
      myAlert.dimension=dimension || myAlert.dimension;
      myAlert.removeAfterClose=true;
      myAlert.show();
      return myAlert;
   }
};
//Remplace le window.confirm
PMC.MsgBox.confirm=function(message, title, afterConfirm, dimension) {
   if(!PMC.DOM.loaded) {
      var x=oConfirm(message);
      if(x && afterConfirm) {
         return afterConfirm();
      }
      else {
         return null;
      }
   }
   else {
      var myConfirm=new PMC.MsgBox();
      myConfirm.title=title || myConfirm.title;
      myConfirm.message=message;
      if(afterConfirm) {
         myConfirm.addButton({"Oui":function(){afterConfirm.apply(this);}, "Non":null});
      }
      else {
         myConfirm.addButton({"Ok":null});
      }
      myConfirm.dimension=dimension || myConfirm.dimension;
      myConfirm.removeAfterClose=true;
      myConfirm.show();
      return myConfirm;
   }
};
//Remplace le window.prompt
PMC.MsgBox.prompt=function(message, title, afterPrompt, dimension) {
   if(!PMC.DOM.loaded) {
      var x=oPrompt(message);
      return afterPrompt(x);
   }
   else {
      var myPrompt=new PMC.MsgBox();
      myPrompt.title=title || myPrompt.title;
      myPrompt.message=message;
      myPrompt.prompt=true;
      if(afterPrompt) {
         myPrompt.addButton({"Ok":function(){afterPrompt.call(this, PMC.utils.getVal(myPrompt.promptInput));}, "Annuler":null});
      }
      else {
         myPrompt.addButton({"Annuler":null});
      }
      myPrompt.dimension=dimension || myPrompt.dimension;
      myPrompt.removeAfterClose=true;
      myPrompt.show();
      return myPrompt;
   }
};
//Gestion du clavier. On ferme la popin visible sans fermer les autres en-dessous
PMC.Event.add(window.document, "keydown", function (o_key) {if(PMC.Key.isEsc(o_key)){PMC.MsgBox.close()};}, false);
})();
//On remplace les anciennes alert par les nouvelles
var oAlert=window.alert;
var oConfirm=window.confirm;
var oPrompt=window.prompt;
window.alert=PMC.MsgBox.alert;
window.confirm=PMC.MsgBox.confirm;
window.prompt=PMC.MsgBox.prompt;