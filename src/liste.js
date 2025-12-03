//------------------------
//---Listes déroulantes---
//------------------------
(function (){
PMC.Liste = PMC.Liste || {};
Object.extend(PMC.Liste,{
   //Vérifie qu'un élément est dans une liste
   get:function (element, liste)
   {
      var i=0;
      var bfound=false;
      var tmp=(element.value!=null) ? PMC.utils.getVal(element) : element;
      while ((!bfound) && (i<liste.length)) {
         if (PMC.utils.getVal(liste[i])==tmp) {
            bfound = true;
         }
         else {
            i++;
         }
      }
      return i;
   },
   //Ajoute un élément dans une liste
   add: function (element, liste) {
      if(typeof element=="string") {
         element.value=(element.text=element);
      }
      var i=liste.length;
      liste.length=i+1;
      try {
         for(var sMethod in element) {
            liste[i][sMethod]=element[sMethod];
         }
      }
      catch(e) {
         liste[i]=element;
      }
      return i;
   },
   //Suppression d'un élément dans une liste à partir de son n° de ligne
   del:function (index_i, liste) {
      if (index_i<liste.length) {
         liste.removeChild(liste[index_i]);
      }
      return true;
   },
   //Suppression d'un élément sélectionné dans une liste à partir de sa valeur
   delByVal:function (val, liste) {
      var i=self.get(val, liste);
      if (i<liste.length) {
         self.del(i, liste);
      }
      return true;
   },
   //Supression de tous les éléments sélectionnés d'une liste
   delSelected:function (liste) {
      for (var i=liste.length-1;i>=0; i--) {
         if(liste[i].selected) {
            self.del(i,liste);
         }
      }
      return true;
   },
   //Ajoute les éléments sélectionnés d'une liste dans l'autre liste
   addSelected:function (list1, list2) {
      for (var i = list1.length - 1; i >= 0; i--) {
         if (list1[i].selected && self.get(list1[i], list2)>=list2.length) {
            self.add(list1[i], list2);
            list2[list2.length-1].selected=true;
         }
      }
      return true;
   },
   //Bascule les éléments sélectionnés d'une liste dans l'autre liste
   change:function (list1, list2) {
      //Définit la liste par défaut si besoin
      var list3=arguments.length>2 ? arguments[2] : null;
      var j = 0;
      for (var i=list1.length-1;i>=0;i--) {
         if (self.get(list1[i], list2)>=list2.length) {
            if (list1[i].selected) {
               //Supprime l'élément dans la liste par défaut si la liste et l'élément existent
               if(list3 && (self.get(list1[i], list3)<list3.length)) {
                  self.delByVal(list1[i].value, list3);
               }
               list1[i].selected = false;
               j++;
               self.add(list1[i], list2);
               //self.del(i, list1);
               list2[list2.length-1].selected = true;
            }
         }
         else {
            alert("Cet élément est déjà inséré !");
         }
      }
      if (j==0) {
         alert("Aucun élément sélectionné !");
      }
      return true;
   },
   //Ajoute un élément à partir d'un flux XML
   loadXML:function (fluxXML, sid, noeud) {
      var liste=$(sid);
      liste.length=0;
      var droit=fluxXML.getElementsByTagName(noeud);
      if(droit[0]) {
         droit=droit[0];
         PMC.utils.forEach(droit.childNodes, function(elem) {
            if(elem.childNodes.length>0) {
               self.add({value : elem.getAttribute("val"),
                         text  : elem.childNodes[0].nodeValue
               }, liste);
            }
         });
         /*
         for(var i=0;i<droit.childNodes.length;i++) {
            if(droit.childNodes[i].childNodes.length>0) {
               self.add({value : droit.childNodes[i].getAttribute("val"),
                       text  : droit.childNodes[i].childNodes[0].nodeValue
                      }, liste);
            }
         }
         */
      }
      return true;
   },
   //Déplace des éléments sélectionnés dans une liste
   changePos:function (sid, nb) {
      var elem=$(sid);
      if(!nb) {
         nb=-1;
      }
      nb=parseInt(nb);
      var j=0;
      for(var i=0;i<elem.length;i++) {
         j=nb>0 ? elem.length-1-i : i;
         if(elem[j].selected && (j>0 || nb>0) && (j<(elem.length-1) || nb<0)) {
            if(!elem[j+nb].selected) {
               self.swapPos(elem[j], elem[j+nb]);
               elem[j].selected=false;
               elem[j+nb].selected=true;
            }
         }
      }
      return true;
   },
   swapPos:function (elem1, elem2) {
      var oTmp={};
      for(var i in elem1) {
         oTmp[i]=elem1[i];
      }
      for(var i in elem2) {
         elem1[i]=elem2[i];
      }
      for(var i in oTmp) {
         elem2[i]=oTmp[i];
      }
      //elem1=elem2;
      //elem2=oTmp;
      //var tmpVal=elem1.value;
      //var tmpTxt=elem1.text;
      //var tmpCls=elem1.className ? elem1.className : "";
      //elem1.value=elem2.value;
      //elem2.value=tmpVal;
      //elem1.text=elem2.text;
      //elem2.text=tmpTxt;
      //if(elem1.className)
      //{
      //   elem1.className=elem2.className;
      //   elem2.className=tmpCls;
      //}
      return true;
   },
   toUrl:function (liste, param) {
      var aRet=Array();
      if(param==null || param=="") {
         param="";
      }
      else {
         param=param+"[]=";
      }
      liste=$(liste);
      PMC.utils.forEach(liste, function(elem){
            aRet.push(param+PMC.utils.getVal(elem).encode64(true));
         });
      /*
      for(var i=0;i<liste.length;i++) {
         aRet.push(param+PMC.utils.getVal(liste[i]).encode64(true));
      }
      */
      return aRet.join("&");
   }
});
var self=PMC.Liste;
var $=PMC.utils.$;
})();