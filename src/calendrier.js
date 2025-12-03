//------------------------
//---CALENDRIER-----------
//------------------------
(function(){
//Intégration de la librairie de gestion du calendrier
//PMC.Calendrier=PMC.Calendrier || {};
//Liste des images contenues dans le calendrier
var IMG={"apply":PMC.Config.img+"imgChqDej/IcoActualiser.gif",
            "applyover":PMC.Config.img+"imgChqDej/IcoActualiserover.gif"
            };
//Suppression dans le DOM de la liste des mois
var removeListeMonth=function()
{
   if(this.ListMonth!=null) {
      PMC.DOM.remove(this.ListMonth);
      this.ListMonth=null;
   }
};
//Création dans le DOM de la liste des mois
var createListeMonth=function(oDiv)
{
   var liste=PMC.DOM.create(document.body, "div", {"class":"calendrier_listemois",
                                       "style":"display:none"
                                       });
   var sRet="";
   PMC.utils.forEach(this.date.MONTH_NAMES, function(oneMonth, i){
      var month=(function(elem, i, oneMonth) {
              return PMC.DOM.create(liste, "a",
                        {   "href":"javascript:void(0);",
                           "class":(i==elem.date.getMonth()) ? "thismonth" : "",
                           "innerHTML":oneMonth.ucWords().escapeEntities()
                        });
              })(this, i, oneMonth);
     var self=this;
     PMC.Event.add(month, "click", function(e) {
         return (function(month){
              self.date.set("01/"+(month+1)+"/"+self.date.getFullYear());
              self.draw();
         })(i);
       });
     }.bind(this));
   /*
   for(var i=0;i<this.date.MONTH_NAMES.length;i++)
   {
      var month=PMC.DOM.create(liste, "a",
                        {   "href":"javascript:void(0);",
                           "class":(i==this.date.getMonth()) ? "thismonth" : "",
                           "innerHTML":this.date.MONTH_NAMES[i].ucWords().escapeEntities()
                        });
      PMC.Event.add(month, "click", function(month){
               this.date.set("01/"+(month+1)+"/"+this.date.getFullYear());
               this.draw();
            }.bind(this, i), false);
   }
   */
   return liste;
};

//Création dans le DOM si le calendrier n'existe pas
var createDom=function(bVisible)
{
   Object.extend(this.style, {"display":(bVisible) ? "display:block" : "display:none"});
   this.gid=PMC.DOM.create(this.pere, "div", { "class":"calendrier",
                                    "style": PMC.utils.toCSS(this.style, ";")
                                   });
};
//Première ligne : contient le mois en cours et l'année
var enteteDate=function ()
{
   var sRet="";
   var oPereDiv=PMC.DOM.create(this.gid, "div", {"class":"navigationBar enteteCal center"});
   var oDiv=PMC.DOM.create(oPereDiv, "div", {"class":"center"});
   var oMonth=PMC.DOM.create(oDiv, "a", {  "href":"javascript:void(0);",
                                 "class":"month",
                                 "innerHTML":this.date.MONTH_NAMES[this.date.getMonth()].ucWords().escapeEntities()
                               });
   var oYear=PMC.DOM.create(oDiv, "a", {"href":"javascript:void(0);",
                                 "class":"year",
                                 "innerHTML":this.date.getFullYear()
                               });
   var oYearModif=PMC.DOM.create(oDiv, "input", {"type":"text",
                                       "class":"year",
                                       "style":"display:none",
                                       "value":this.date.getFullYear()
                                     });
   var oYearApply=PMC.DOM.create(oDiv, "input", {"type":"image",
                                       "class":"yearbutton",
                                       "src":IMG.apply,
                                       "style":"display:none",
                                       "value":"Go",alt:"Go"
                                     });
   if(this.buttonClose) {
      var oDClose=PMC.DOM.create(oPereDiv, "div", {"class":"close"
                                          , "style":"left:"+(PMC.Element.getDimensions(this.gid).width-19)+"px"
                                       });
      var oClose=PMC.DOM.create(oDClose, "a", {"href":"javascript:void(0);",
                                       "class":"close"
                                    });
      PMC.Event.add(oClose, "click", this.hide.bind(this), false);
   }
   PMC.Event.add(oYearApply, "mouseover", function(){this.src=IMG.applyover}, false);
   PMC.Event.add(oYearApply, "mouseout", function(){this.src=IMG.apply}, false);

   PMC.Event.add(oMonth, "click", function(oDiv, oMonth)
                           {
                              if(this.ListMonth==null) {
                                 this.ListMonth=createListeMonth.call(this, oDiv);
                              }
                              var pos=PMC.Element.cumulativeOffset(oMonth);
                              PMC.Element.moveTo(this.ListMonth, pos[0], pos[1]+20);
                              PMC.Element.toggle(this.ListMonth);
                           }.bind(this, oDiv, oMonth), false);
   PMC.Event.add(oYear, "click", function(oDiv, oYear, oYearModif, oYearApply)
                           {
                              PMC.Element.hide(oYear);
                              if(PMC.utils.getVal(oYearModif).length==0) {
                                 oYearModif.value=this.date.format("%Y");
                              }
                              PMC.Element.showinline(oYearModif);
                              PMC.Element.showinline(oYearApply);
                              oYearModif.select();
                           }.bind(this, oDiv, oYear, oYearModif, oYearApply), false);
   PMC.Event.add(oYearApply, "click", function(oDiv, oYear, oYearModif, oYearApply)
                           {
                              PMC.Element.showinline(oYear);
                              PMC.Element.hide(oYearModif);
                              PMC.Element.hide(oYearApply);
                              var sY=PMC.utils.getVal(oYearModif);
                              if(sY!=null && sY.length>0) {
                                 this.date.set("1/"+this.date.format("%m")+"/"+sY);
                                 this.draw();
                              }
                           }.bind(this, oDiv, oYear, oYearModif, oYearApply), false);
   return;
};
//Deuxième ligne : déplacement dans les années, mois et retour au mois courant
var deplaceDate=function()
{
   var oDeplace=PMC.DOM.create(this.gid, "div", {"class":"navigationBar deplaceCal"});
   var oPrevY=PMC.DOM.create(oDeplace, "div", {"class":"btnPreviousYear", "innerHTML":"<span></span>"});
   var oPrevM=PMC.DOM.create(oDeplace, "div", {"class":"btnPreviousMonth", "innerHTML":"<span></span>"});
   var oNextY=PMC.DOM.create(oDeplace, "div", {"class":"btnNextYear", "innerHTML":"<span></span>"});
   var oNextM=PMC.DOM.create(oDeplace, "div", {"class":"btnNextMonth", "innerHTML":"<span></span>"});
   var oToDay=PMC.DOM.create(oDeplace, "div", {"class":"center calendriertoday"});
   var aLinkToDay=PMC.DOM.create(oToDay, "a", {"href":"javascript:void(0);", "innerHTML":"Aujourd'hui"});

   PMC.Event.add(aLinkToDay, "click", today.bind(this), false);
   PMC.Event.add(oNextY, "click", nextY.bind(this), false);
   PMC.Event.add(oNextM, "click", nextM.bind(this), false);
   PMC.Event.add(oPrevY, "click", previousY.bind(this), false);
   PMC.Event.add(oPrevM, "click", previousM.bind(this), false);

   PMC.Event.add(oNextY, "mouseover", function(){this.className=this.className+" over";}.bind(oNextY), false);
   PMC.Event.add(oNextM, "mouseover", function(){this.className=this.className+" over";}.bind(oNextM), false);
   PMC.Event.add(oPrevY, "mouseover", function(){this.className=this.className+" over";}.bind(oPrevY), false);
   PMC.Event.add(oPrevM, "mouseover", function(){this.className=this.className+" over";}.bind(oPrevM), false);
   PMC.Event.add(oNextY, "mouseout", function(){this.className=this.className.before(" over");}.bind(oNextY), false);
   PMC.Event.add(oNextM, "mouseout", function(){this.className=this.className.before(" over");}.bind(oNextM), false);
   PMC.Event.add(oPrevY, "mouseout", function(){this.className=this.className.before(" over");}.bind(oPrevY), false);
   PMC.Event.add(oPrevM, "mouseout", function(){this.className=this.className.before(" over");}.bind(oPrevM), false);

   return;
};
//Création du mois complet
var createBody=function()
{
   var a=this.date.getFullYear();
   var m=(this.date.getMonth()+1).lpad(2,"0");
   var fin=this.date.lastDay().getDate();
   var iSaveToDay=PMC.Config.today.format("%d/%m/%Y").lpad(10,"0");
   var iSaveJour=null;
   if(this.input) {
      iSaveJour=Date.prototype.set(PMC.utils.getVal(this.input)).format("%d/%m/%Y");
   }
   //Gestion des jours fériés.
   //Pour des raisons de performances, on récupère d'abord l'ensemble des jours fériés de l'année, puis on ne ramène que les jours du mois en cours
   //Liste des jours fériés.
   var lFerie=this.date.listeFerie();
   //Liste des jours fériés du mois en cours
   var ferieInMonth=[];
   var thisMonth=this.date.getMonth();
   PMC.utils.forEach(lFerie, function(elem){
         if(elem.getMonth()==thisMonth) {
            ferieInMonth.push(elem.format("%d"));
         }
      });
   /*
   for(var i=0;i<lFerie.length;i++) {
      if(lFerie[i].getMonth()==this.date.getMonth()) {
         ferieInMonth.push(lFerie[i].format("%d"));
      }
   }
   */
   //Jour de la semaine du premier jour du mois.
   var tmp=parseInt(this.date.firstDay().format("%w"), 10)-1;
   if(tmp<0) {
      tmp=6;
   }
   //Création en-tête
   var ret="<table cellspacing=\"0\" cellpadding=\"0\">";
   ret+="<thead><tr><th class=\"firstColumn center\">W</th><th class=\"center\">L</th><th class=\"center\">M</th><th class=\"center\">M</th><th class=\"center\">J</th><th class=\"center\">V</th><th class=\"center\">S</th><th class=\"center\">D</th></tr></thead>";
   ret+="<tbody>";
   //On met le N° de semaine uniquement si le premier jour n'est pas un lundi, sinon, il sera mis plus loin
   if(tmp>0) {
      ret+="<tr><td class=\"center firstColumn\">"+this.date.firstDay().getWeek()+"</td>";
   }
   //On répète les espaces blancs jusqu'au 1er jour du mois
   ret+=("<td>"+PMC.utils.chr(160)+"</td>").repeat(tmp);
   var dDate=new Date();
   for(var i=1;i<=parseInt(fin);i++)
   {
      if(tmp==0) {
         dDate.set(i+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear());
         ret+="<tr><td class=\"center firstColumn\">"+dDate.getWeek()+"</td>";
      }
      ret+="<td class=\"center\"><a href=\"javascript:void(0);\" class=\"date";
      if(iSaveToDay==i.lpad(2,"0")+"/"+m+"/"+a) {
         ret+=" today";
      }
      if(iSaveJour==i.lpad(2,"0")+"/"+m+"/"+a) {
         ret+=" jour";
      }
      if(ferieInMonth.inArray(i)) {
         ret+=" ferie";
      }
      else if(tmp>4) {
         ret+=" weekend";
      }
      ret+="\">"+i+"</a></td>";
      if(tmp==6) {
         ret+="</tr>";
      }
      tmp=(tmp+1)%7;
   }
   //On répète les espaces blancs jusqu'au dimanche
   if(tmp>0) {
      ret+=("<td>"+PMC.utils.chr(160)+"</td>").repeat(7-tmp);
      ret+="</tr>";
   }
   ret+="</tbody>";
   ret+="</table>";
   var oDiv=PMC.DOM.create(this.gid, "div", {"class":"monthview", "innerHTML":ret});
   //On ajoute les évènements sur le click de chaque jour
   var all=PMC.utils.getClass("date", oDiv);
   PMC.utils.forEach(all, function(elem){PMC.Event.add(elem, "click", afterClick.bind(this), true);}.bind(this));
   /*
   for(var i=0;i<all.length;i++) {
      PMC.Event.add(all[i], "click", afterClick.bind(this), true);
   }
   */
   return;
};
//Dessine le mois complet
var draw=function(bVisible)
{
   //S'il n'existe pas, on créé le "div"
   if(this.gid==null) {
      createDom.call(this, bVisible);
   }
   //On commence par supprimer tous les fils
   PMC.DOM.removeChildren(this.gid, "div");
   //On supprime la liste des mois si elle existe
   removeListeMonth.apply(this);
   //Puis on recréé l'en-tête
   enteteDate.apply(this);
   //On recréé les déplacements dans les années
   deplaceDate.apply(this);
   //On recréé les jours
   createBody.apply(this);
   return;
};
//Déclenchement de cette procédure après click sur chaque jour.
//On exécute alors l'ensemble des fonctions passées en argument
var afterClick=function (e)
{
   PMC.utils.forEach(this.func, function(elem){
         elem.fct.call(this, elem.arg, PMC.Event.element(e));
      });
   /*
   for(var i=0;i<this.func.length;i++) {
      this.func[i].fct.call(this, this.func[i].arg, PMC.Event.element(e));
   }
   */
   return;
};
//Suppression du calendrier dans le DOM
var remove=function ()
{
   PMC.DOM.remove(this.gid);
   this.gid=null;
   return;
};
//Fonction de déplacement dans les mois et les années
//Retour à la date du jour
var today=function()
{
   this.date.set(PMC.Config.today.format("%d/%m/%Y"));
   this.draw();
};
//Année précédente
var previousY=function()
{
   this.date.setYear(this.date.getFullYear()-1);
   this.draw();
};
//Mois précédent
var previousM=function()
{
   this.date.setMonth(this.date.getMonth()-1);
   this.draw();
};
//Mois suivant
var nextM=function()
{
   this.date.setMonth(this.date.getMonth()+1);
   this.draw();
};
//Année suivante
var nextY=function()
{
   this.date.setYear(this.date.getFullYear()+1);
   this.draw();
};
//Affiche le calendrier lors du focus sur un champ texte.
var setInput=function()
{
   this.date=this.date.set(PMC.utils.getVal(this.input));
   this.show();
   deplaceCalendrier.apply(this);
};
var deplaceCalendrier=function()
{
   var position=PMC.Element.cumulativeOffset(this.input);
   PMC.Element.moveTo(this.gid, position[0], position[1]+22);
};
//Création de l'objet PMC.Calendrier
PMC.Calendrier=function (oPere)
{
   this.pere=oPere || document.body;
   this.date=new Date();
   this.date.set(PMC.Config.today.format("%d/%m/%Y"));
   this.gid=null;
   this.func=[];
   this.ListMonth=null; //Liste des mois de l'année pour changement de mois
   this.buttonClose=false;
   this.style={};
};
Object.extend(PMC.Calendrier.prototype,{
   //Ajout de fonctions lors du click sur un jour spécifique
   addFunction:function(fct, args)
   {
      if(!args) {
         args=[];
      }
      else if(!args.isArray) {
         args=[args];
      }
      this.func.push({"fct":fct, "arg":args});
   },
   //Affiche le calendrier
   show:function (oStyle)
   {
      this.style=oStyle || this.style;
      if(!this.gid) {
         draw.call(this, false);
      }
      PMC.Element.fade(this.gid, true);
      return;
   },
   //Cache le calendrier
   hide:function ()
   {
      removeListeMonth.apply(this);
      if(this.gid!=null) {
         PMC.Element.fade(this.gid, false, null, null, null, null, remove.bind(this));
      }
      return;
   },
   //Affiche / Cache le calendrier
   toggle:function()
   {
      PMC.Element.visible(this.gid) ? this.hide() : this.show();
   },
   //Supprime le calendrier en évitant les effets de transparence pour l'affichage
   remove:function()
   {
      removeListeMonth.apply(this);
      remove.call(this);
   },
   //Dessine le calendrier en évitant les effets de transparence pour l'affichage
   draw:function()
   {
      draw.call(this, true);
   },
   //Met en place le calendrier sur un champs input
   setInput:function(sid)
   {
      this.input=PMC.utils.$(sid);
      if(this.input) {
         this.buttonClose=true;
         this.addFunction(function(oCalendrier, jour){
               this.input.value=(jour.innerHTML.lpad(2,"0")+'/'+this.date.format('%m/%Y'));
               this.hide();
            }.bind(this), this);
         PMC.Event.add(this.input, "focus", this.focus=setInput.bind(this), false);
         PMC.Event.add(this.input, "keydown", this.remove.bind(this), false);
         //draw.call(this, true);deplaceCalendrier.apply(this);}, 400).apply(this);
         PMC.Event.add(this.input, "keyup", function(){this.input.blur();this.input.focus()}.bind(this), false);
         //PMC.Event.add(this.input,  "blur", function() {this.hide();}.bind(this), false);
      }
   },
   delInput:function(sid)
   {
      if(this.input) {
         PMC.Event.remove(this.input, "focus", this.focus, false);
      }
   }
});
/*
   lanceRemoveOnFocus:function (sid)
   {
     if(sid.isArray)
     for(var i=0;i<sid.length;i++)
       PMC.Event.add(PMC.utils.$(sid[i]), "focus", function (e){PMC.Calendrier.hide();}, false);
     else
       PMC.Event.add(PMC.utils.$(sid), "focus", function (e){PMC.Calendrier.hide();}, false);
     return;
   },
*/
/*
   var calend;
   calend=new PMC.Calendrier(oTmp);
   calend.addFunction(testcalend, "ok");
var testcalend=function(args, cellule)
{
   oAlert(cellule.innerHTML);
   oAlert(this.date.format("%d %M %Y"));
}
*/
})();