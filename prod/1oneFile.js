/*
 * PMC JavaScript Library V2.5
 * 13/04/2023 : Amélioration XMLHttpRequest
 * 08/11/2024 : correctif array.removeValue et toggleClass
 * 05/12/2024 : correctif Base 64
 * 16/01/2025 : ajout PMC.utils.copy
 * 24/06/2025 : ajout prototype isNull
 * Copyleft 2013, Paul-Marie Coste
 * Date: 24/06/2025  9:28:28,03
*/
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
//Object.merge(Object.prototype, {isArray:false});/*fin object.js*/ 
//------------------------
//---NAVIGATOR------------
//------------------------
PMC.utils.navigator=PMC.utils.navigator || {};
PMC.utils.navigator.dom=(function (){return document.getElementById ? true : false;})();             //Navigateur comprend-il le ID ?
PMC.utils.navigator.ie=(function (){return document.all ? true : false;})();                         //Navigateur est-il IE ?
PMC.utils.navigator.ns4=(function (){return document.layers ? true : false;})();                     //Navigateur est-il netscape 4 ?
PMC.utils.navigator.agt          =window.navigator.userAgent.toLowerCase();
PMC.utils.navigator.is_nav       =(function (){return (PMC.utils.navigator.agt.indexOf('mozilla')!=-1) && (PMC.utils.navigator.agt.indexOf('spoofer')==-1)
   && (PMC.utils.navigator.agt.indexOf('compatible') == -1) && (PMC.utils.navigator.agt.indexOf('opera')==-1)
   && (PMC.utils.navigator.agt.indexOf('webtv')==-1);})();
// detect browser version
// Note: On IE5, these return 4, so use is_ie5up to detect IE5.
PMC.utils.navigator.is_major     =parseInt(window.navigator.appVersion);
PMC.utils.navigator.is_minor     =parseFloat(window.navigator.appVersion);
PMC.utils.navigator.is_ie        =PMC.utils.navigator.agt.indexOf('msie')!=-1;              //Navigateur est-il IE ?
PMC.utils.navigator.is_opera     =(PMC.utils.navigator.agt.indexOf('opera')!=-1);
PMC.utils.navigator.is_safari    =(PMC.utils.navigator.agt.indexOf('safari')!=-1);
PMC.utils.navigator.is_konqueror =(PMC.utils.navigator.agt.indexOf('konqueror')!=-1);
PMC.utils.navigator.is_khtml     =(PMC.utils.navigator.agt.indexOf('khtml')!=-1);
PMC.utils.navigator.is_opera6up  =(PMC.utils.navigator.is_opera && (PMC.utils.navigator.is_major >= 6));
PMC.utils.navigator.is_nav4up    =(PMC.utils.navigator.is_nav && (PMC.utils.navigator.is_major >= 4));
PMC.utils.navigator.is_nav6up    =(PMC.utils.navigator.is_nav && (PMC.utils.navigator.is_major >= 6));
PMC.utils.navigator.is_ie3       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major < 4));
PMC.utils.navigator.is_ie4       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major == 4) && (PMC.utils.navigator.agt.indexOf("msie 5.0")==-1) );
PMC.utils.navigator.is_ie5       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major == 4) && (PMC.utils.navigator.agt.indexOf("msie 5.0")!=-1) );
PMC.utils.navigator.is_ie5up     =(PMC.utils.navigator.is_ie  && !PMC.utils.navigator.is_ie3 && !PMC.utils.navigator.is_ie4);
PMC.utils.navigator.nav_ok=(PMC.utils.navigator.dom || PMC.utils.navigator.ie || PMC.utils.navigator.ns4) ? true : false; //Navigateur comprend-il le DOM ?
/*fin navigator.js*/ 
//------------------------
//---Gestion des objets---
//------------------------
(function() {
var print_r_html = function (oElem, nbmenu, maxmenu) {
   if(nbmenu==null) {
      nbmenu=0;
   }
   var tmpMax=maxmenu==null ? nbmenu+1 : maxmenu;
   var sRet="<ul"+(nbmenu>0 ? " style=display:none;" : "")+">";
   var sretour="";
   if(nbmenu<tmpMax && (oElem!=window || nbmenu==0)) {
      if(typeof(oElem)!='object') {
         if(typeof(oElem)=='boolean') {
            sRet+="<li><span class=\"gras titremsg\">"+oElem+" : </span><span class=\"typeoffunction\">"+typeof(oElem)+"</span></li>";
         }
         else if(typeof(oElem)==undefined) {
            sRet+="<li><span class=\"gras titremsg\">"+oElem+" : </span><span class=\"typeofundefined\">"+typeof(oElem)+"</span></li>";
         }
         else {
            sRet+="<li><span class=\"gras titremsg\">"+oElem.toString().escapeEntities(true)+" : </span><span class=\"typeof\">"+typeof(oElem)+"</span></ul></li>";
         }
      }
      else {
         for(var i in oElem) {
            if(typeof(oElem[i])=='object') {
               sRet+="<li><span class=\"gras titremsg\" onclick=\"PMC.Element.toggle(PMC.DOM.getChild(this.parentNode, 'ul'));\">"+i+" : </span>";
               sRet+=(oElem[i]!=window) ? "<span class=\"typeofobject\">"+typeof(oElem[i]) : "<span class=\"typeofwindow\">window";
               sRet+="</span>"+print_r_html(oElem[i], nbmenu+1, maxmenu)+"</li>";
            }
            else if(typeof(oElem[i])=='function') {
               sRet+="<li><span class=\"gras titremsg\" onclick=\"PMC.Element.toggle(PMC.DOM.getChild(this.parentNode, 'ul'));\">"+i+" : </span><span class=\"typeoffunction\">"+typeof(oElem[i])+"</span><ul style=\"display:none;\"><li>"+oElem[i].toString().escapeEntities(true)+"</li></ul></li>";
            }
            else if(typeof(oElem[i])=='boolean') {
               sRet+="<li><span class=\"gras titremsg\" onclick=\"PMC.Element.toggle(PMC.DOM.getChild(this.parentNode, 'ul'));\">"+i+" : </span><span class=\"typeoffunction\">"+typeof(oElem[i])+"</span><ul style=\"display:none;\"><li>"+oElem[i]+"</li></ul></li>";
            }
            else if(oElem[i]==undefined) {
               sRet+="<li><span class=\"gras titremsg\">"+i+" : </span><span class=\"typeofundefined\">undefined</span></li>";
            }
            else {
               sRet+="<li><span class=\"gras titremsg\" onclick=\"PMC.Element.toggle(PMC.DOM.getChild(this.parentNode, 'ul'));\">"+i+" : </span><span class=\"typeof\">"+typeof(oElem[i])+"</span><ul style=\"display:none;\"><li>"+oElem[i].toString().escapeEntities(true)+"</li></ul></li>";
            }
         }
      }
   }
   return sRet+"</ul>";
};

Object.merge(PMC.utils, {
   Version: "<?php echo __JSVERSION;?>",
   isUtf8: true,
   ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',
   emptyFunction: function () {},
   K: function (x) {return x;},
   min:function (a,b){return a.isUpper(b) ? b:a;},
   max:function (a,b){return a.isUpper(b) ? a:b;},
   comparer:function(a, b) {
     return parseInt(a)-parseInt(b);
   },
   op:{
      "+": function(a, b){return a + b;},
      "-": function(a, b){return a - b;},
      "*": function(a, b){return a * b;},
      "/": function(a, b){return a / b;},
      ">": function(a, b){return a > b;},
      "<": function(a, b){return a < b;},
      ">=": function(a, b){return a >= b;},
      "<=": function(a, b){return a <= b;},
      "==": function(a, b){return a == b;},
      "===": function(a, b){return a === b;},
      "!": function(a){return !a;}
   },
   //Affichage récursif de tous les objets
   print_r:function (oElem, nbmenu, maxmenu) {
      self.debug(print_r_html(oElem, nbmenu, maxmenu));
   },
   toCSS:function(Objet, sSep) {
      var sRet=[];
      if(sSep==null) {
         sSep=";";
      }
      if(typeof(Objet)=="object") {
         for(var i in Objet) {
            sRet.push(i+":"+self.toCSS(Objet[i], sSep));
         }
      }
      else if(typeof(Objet)=="string") {
         sRet.push(Objet)
      }
      else if(typeof(Objet)=="array") {
         sRet=Objet;
      }
      return sRet.join(sSep);
   },
   toHTML:function (sHTML, oElem) {
      if(oElem!=null) {
         oElem.innerHTML=sHTML;
      }
      else {
         var oDiv=document.createElement('div');
         oDiv.innerHTML=sHTML;
         document.body.appendChild(oDiv);
         return oDiv;
      }
      return oElem;
   },
   //Affichage taille d'un fichier.
   //En entrée : le nombre d'octets (73611)
   //En sortie : la taille avec l'unité (71.89 Ko)
   getSize:function(sizeInByte, precision=2) {
      var units = ['O', 'Ko', 'Mo', 'Go', 'To'];
      return sizeInByte==0 ? sizeInByte+" "+units[0] : Math.round(sizeInByte / Math.pow(1024, (i = Math.floor(Math.log(sizeInByte)/Math.log(1024)))), precision)+" "+units[i];
   },
   //Récupération d'un élément par son identifiant
   getID:function () {
      if(!PMC.utils.navigator.nav_ok) {return function (){return null;};}
      if(PMC.utils.navigator.dom) {return function (sID){return document.getElementById(sID.id ? sID.id : sID);};}
      else if(PMC.utils.navigator.is_ie4) {return function (sID){return document.all(sID);};}
      else if(PMC.utils.navigator.ns4) {return function (sID){return document.layers(sID);};}
      else {return function (sID){alert('Erreur PMC.utils.getID :'+(sID.id?sID.id : sID)); return null;};}
   }(),
   //Récupération d'un élément par sa class
   getClass:function (sClass, obj) {
      var ret=[];
      if(obj==null)
         obj=document;
      obj=self.$(obj);
      if(obj) {
         var all=obj.getElementsByTagName('*');
         self.forEach(all, function(elem){
            try {
               if(elem.className!=null && elem.className.isClassName(sClass)) {
                  ret.push(elem);
               }
            }
            catch(e) {
            }
         });
         /*
         for(var i=0;i<all.length;i++)
         {
            if(all[i].className!=null && all[i].className.isClassName(sClass))
               ret.push(all[i]);
         }
         */
      }
      return ret;
   },
   getVal:function (elem) {
      if(elem==null) {
         return '';
      }
      if(typeof elem!="string" && elem.selectedIndex!=null) {
         return elem[elem.selectedIndex].value;
      }
      if(elem["value"]) {
         return elem["value"];
      }
      if(elem["text"]) {
         return elem["text"];
      }
      if(elem["textContent"]) {
         return elem["textContent"];
      }
      if(elem["innerText"]!=null) {
         return elem["innerText"];
      }
      if(elem["nodeType"]) {
         if(elem["nodeValue"]!=null) {
            return elem["nodeValue"];
         }
         else {
            return '';
         }
      }
      if(elem) {
         return elem;
      }
      return '';
   },
   setVal:function (elem, txt) {
      if((typeof elem["value"])=="string") {
         return elem["value"]=txt;
      }
      if((typeof elem["text"])=="string") {
         return elem["text"]=txt;
      }
      if((typeof elem["textContent"])=="string") {
         return elem["textContent"]=txt;
      }
      if((typeof elem["innerText"])=="string") {
         return elem["innerText"]=txt;
      }
      if((typeof elem["nodeType"])=="string") {
         if((typeof elem["nodeValue"])=="string") {
            return elem["nodeValue"]=txt;
         }
         else {
            return false;
         }
      }
      if(elem) {
         return elem=txt;
      }
      return null;
   },
   //fonction serialize et unserialize ---
   //auteur : XoraX
   //email : xxorax@gmail.com
   //info : http://www.xorax.info/blog/programmation/40-javascript-serialize-php.html
   //version : 1.2 - 2007/04/23
   serialize:function (txt) {
      switch(typeof(txt)) {
      case 'string':
         return 's:'+txt.length+':"'+txt+'";';
      case 'number':
         if(txt>=0 && String(txt).indexOf('.') == -1 && txt < 65536) return 'i:'+txt+';';
         return 'd:'+txt+';';
      case 'boolean':
         return 'b:'+( (txt)?'1':'0' )+';';
      case 'object':
         var i=0,k,ret='';
         for(k in txt){
            //alert(isNaN(k));
            if(!isNaN(k)) k = Number(k);
            ret += self.serialize(k)+self.serialize(txt[k]);
            i++;
         }
         return 'a:'+i+':{'+ret+'}';
      default:
         return 'N;';
         alert('var undefined: '+typeof(txt));return undefined;
      }
   },
   unserialize:function (txt) {
      var level=0,arrlen=[],del=0,final=[],key=[],save=txt;
      while(1){
         switch(txt.substr(0,1)){
         case 'N':
            del = 2;
            ret = null;
            break;
         case 'b':
            del = txt.indexOf(';')+1;
            ret = (txt.substring(2,del-1) == '1')?true:false;
            break;
         case 'i':
            del = txt.indexOf(';')+1;
            ret = Number(txt.substring(2,del-1));
            break;
         case 'd':
            del = txt.indexOf(';')+1;
            ret = Number(txt.substring(2,del-1));
            break;
         case 's':
            del = txt.substr(2,txt.substr(2).indexOf(':'));
            ret = txt.substr( 1+txt.indexOf('"'),del);
            del = txt.indexOf('"')+ 1 + ret.length + 2;
            break;
         case 'a':
            del = txt.indexOf(':{')+2;
            ret = [];
            arrlen[level+1] = Number(txt.substring(txt.indexOf(':')+1, del-2))*2;
            break;
         case 'O':
            txt = txt.substr(2);
            var tmp = txt.indexOf(':"')+2;
            var nlen = Number(txt.substring(0, txt.indexOf(':')));
            name = txt.substring(tmp, tmp+nlen );
            //alert(name);
            txt = txt.substring(tmp+nlen+2);
            del = txt.indexOf(':{')+2;
            ret = {};
            arrlen[level+1] = Number(txt.substring(0, del-2))*2;
            break;
         case '}':
            txt = txt.substr(1);
            if(arrlen[level] != 0){alert('var missed : '+save); return undefined;};
            //alert(arrlen[level]);
            level--;
            continue;
         default:
            if(level==0) return final;
            alert('syntax invalid(1) : '+save+"\nat\n"+txt+"level is at "+level);
            return undefined;
         }
         if(arrlen[level]%2 == 0) {
            if(typeof(ret) == 'object'){alert('array index object no accepted : '+save);return undefined;}
            if(!self.exist(ret)){alert('syntax invalid(2) : '+save);return undefined;}
            key[level] = ret;
         } else {
            var ev = '';
            for(var i=1;i<=level;i++) {
               if(typeof(key[i]) == 'number') {
                  ev += '['+key[i]+']';
               }
               else {
                  ev += '["'+key[i]+'"]';
               }
            }
            eval('final'+ev+'= ret;');
         }
         arrlen[level]--;//alert(arrlen[level]-1);
         if(typeof(ret) == 'object') {
            level++;
         }
         txt = txt.substr(del);
         continue;
      }
//    return;
   },
   //Affichage de caractères à partir de caractères ASCII
   chr:function () {
      var ret="";
      self.forEach(arguments, function(elem) {
         if(elem.isArray) {
            self.forEach(elem, function(el) {
               ret+=self.chr(el);
            });
         }
         else {
            ret+=String.fromCharCode(elem);
         }
      });
      /*
      for(var i=0;i<arguments.length;i++)
        if(arguments[i].isArray)
         for(var j=0;j<arguments[i].length;j++)
          ret+=self.chr(arguments[i][j]);
       else
         ret+=String.fromCharCode(arguments[i]);
      */
      return ret;
   },
   //Récupération codes ASCII à partir de caractères
   chrCode:function () {
      if(arguments.length==0) {
         return '';
      }
      var ret=Array();
      for(var i=0;i<arguments.length;i++) {
         ret[i]=Array();
         if(arguments[i].isArray) {
            for(var j=0;j<arguments[i].length;j++) {
               ret[i][j]=self.chrCode(arguments[i][j]);
            }
         }
         else {
            var tmp=new String(arguments[i]);
            for(var j=0;j<tmp.length;j++) {
               ret[i][j]=tmp.charCodeAt(j);
            }
         }
      }
      if(arguments.length==1) {
         if(arguments[0].isArray) {
            ret=ret[0];
         }
         else if(arguments[0].length==1) {
            ret=ret[0][0];
         }
         else {
            ret=ret[0];
         }
      }
      return ret;
   },
   //Retourne un élément ou plusieurs
   $:function () {
      var elements=[];
      self.forEach(arguments, function(elem) {
         if (typeof elem=='string') {
            elem=self.getID(elem);
         }
         elements.push(elem);
      });
      /*
      for (var i=0; i<arguments.length; i++) {
         var element=arguments[i];
         if (typeof element=='string') {
            element=self.getID(element);
         }
         if (arguments.length==1) {
            return element;
         }
         elements.push(element);
      }
      */
      return arguments.length==1 ? elements[0] : elements;
   },
   //Retourne un élément ou plusieurs
   $$:function (p, t) {
      return (p && t) ? p.getElementsByTagName(t) : (p ? p.childNodes() : null);
   },
   //Retourne le premier élément de trouvé
   $$1:function (p, t) {
      return self.$$(p, t) || null;
   },
   //Affichage pour débuggage
   debug:function () {
      var rsp=(arguments.length>0) ? arguments[0] : "";
      var arg=(arguments.length>1) ? arguments[1] : "a";
      var sid=(arguments.length>2) ? arguments[2] : "debug";
      var gid=self.$(sid);
      if(gid) {
         if(gid.getElementsByTagName("dl").length>0) {
            gid=gid.getElementsByTagName("dl")[0];
         }
         if(rsp=="") {
            PMC.DOM.removeChildren(gid, "dd");
            PMC.Element.hide(sid);
         }
         else {
            PMC.Element.show(sid);
            if(arg!="a") {
               PMC.DOM.removeChildren(gid, "dd");
            }
            PMC.DOM.createChildren(gid, "dd", rsp.nl2br());
         }
      }
      else if(typeof(rsp)!='object') {
         alert(rsp.unescapeEntities());
      }
      else {
         alert(rsp);
      }
      return;
   },
   var_dump:function (tab, indent, withdebug) {
      indent=(arguments.length>1) ? arguments[1]+"\t" : "\t";
      withdebug=(arguments.length>2) ? arguments[2] : true;
      var i=0;
      var elements="";
      for (var elt in tab) {
         elements += (i ? ",\n " : " ") + indent + "[" + elt + "]:";
         switch (typeof tab[elt]) {
            case "string" :
               elements += "\"" + tab[elt] + "\"";
               break;
            case "number" :
               elements += tab[elt];
               break;
            case "object" :
               if (tab[elt] == null) {
                  elements += "*null*";
               }
               else if (tab[elt]) {
                  elements += self.var_dump(tab[elt], indent, withdebug);
               }
               break;
            case "undefined" :
               elements += "*undefined*";
               break;
            default :
               elements += tab[elt];
               break;
         }
         i++;
      }
      if(withdebug) {
         self.debug("<pre>tableau(" + i + "){\n" + elements + "\n" + (arguments[1] ? arguments[1] : "") + "}</pre>");
      }
      return "tableau(" + i + "){\n" + elements + "\n" + (arguments[1] ? arguments[1] : "") + "}";
   },
   forEach:function(aArray, callback) {
      if(!callback) {
         throw new Exception("Erreur dans PMC.utils.forEach, callback not defined !");
      }
      var iNb=aArray.length;
      for(var i=0;i<iNb;i++) {
         callback(aArray[i], i);
      }
   },
   asArray:function(quasimentUnTableau, debut) {
      var resultat = [];
      for (var i = (debut || 0); i < quasimentUnTableau.length; i++) {
         resultat.push(quasimentUnTableau[i]);
      }
      return resultat;
   },
   partial:function (func) {
      var argumentsFixes = self.asArray(arguments, 1);
      return function(){
         return func.apply(null, argumentsFixes.concat(self.asArray(arguments)));
      };
   },
   compose:function (func1, func2) {
      return function() {
         return func1(func2.apply(null, arguments));
      };
   },
   findIndice:function(test, tableau, minIndice) {
      minIndice=minIndice||0;
      for (var i = minIndice; i < tableau.length; i++) {
         if (test(tableau[i])) {
            return i;
         }
      }
      return false;
   },
   any:function (test, tableau) {
      for (var i = 0; i < tableau.length; i++) {
         var trouve = test(tableau[i]);
         if (trouve) {
            return trouve;
         }
      }
      return false;
   },
   every:function (test, tableau) {
      for (var i = 0; i < tableau.length; i++) {
         var trouve = test(tableau[i]);
         if (!trouve) {
            return trouve;
         }
      }
      return true;
   },
   flatten:function (tableaux) {
      var resultat = [];
      self.forEach(tableaux, function (tableau) {
         self.forEach(tableau, function (element){resultat.push(element);});
      });
      return resultat;
   },
   map:function (func, tableau) {
      var resultat = [];
      self.forEach(tableau, function (element) {
         resultat.push(func(element));
      });
      return resultat;
   },
   member:function (tableau, valeur) {
      return self.any(self.partial(self.op["==="], valeur), tableau);
   },
   filter:function (test, tableau, valueSearched) {
      var resultat = [];
      self.forEach(tableau, function (element) {
         if(test(element, valueSearched)) {
            resultat.push(element);
         }
      });
      return resultat;
   },
   forEachIn:function (objet, action) {
      for (var property in objet) {
         if (Object.prototype.hasOwnProperty.call(objet, property)) {
            action(property, objet[property]);
         }
      }
   },
   clone:function(oObjet) {
      //Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne
      if(typeof(oObjet) != 'object' || oObjet == null) {
         return oObjet;
      }
      //On appel le constructeur de l'instance source pour crée une nouvelle instance de la même classe
      var newInstance = new oObjet.constructor();
      for(var i in oObjet) {
         newInstance[i] = PMC.utils.clone(oObjet[i]);
      }
      return newInstance;
   },
   copy:function(el) {
      var body = document.body, range, sel;
      if (document.createRange && window.getSelection) {
         range = document.createRange();
         sel = window.getSelection();
         sel.removeAllRanges();
         try {
            range.selectNodeContents(el);
            //range.selectNodeContents(el);
            //range.selectNode(el);
            sel.addRange(range);
         } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
         }
      } else if (body.createTextRange) {
         range = body.createTextRange();
         range.moveToElementText(el);
         range.select();
      }
      try {
         //navigator.clipboard.writeText(range.select());
         var result = document.execCommand('copy');
         if (result) {
            // La copie a réussi
            //alert('Copié !');
         }
      }
      catch(err) {
           // Une erreur est surevnue lors de la tentative de copie
         alert(err);
      }

      sel = window.getSelection();

      if (typeof sel.removeRange === 'function') {
         sel.removeRange(range);
      } else if (typeof sel.removeAllRanges === 'function') {
         sel.removeAllRanges();
      }
   }
});
function printBr(element, index, array) {
  document.write("<br />[" + index + "] is " + element );
}
var self=PMC.utils;
PMC.utils.isUndefined=self.partial(self.op["==="], undefined);
PMC.utils.isDefined=self.compose(self.op["!"], self.isUndefined);
})();/*fin pmc.js*/ 
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
//----------------------------------/*fin prototype.js*/ 
//------------------------
//---CRYPTAGE-------------
//------------------------
(function(){
//forward=true/false pour crypt/decrypt
var Vigenere = function (input, key, forward) {
   if(key==null) {
      key="a";
   }
   if(forward==null) {
      forward=true;
   }
   var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             + "abcdefghijklmnopqrstuvwxyz";

   // Validate key:
   key=key.toUpperCase();
   //input=input.removeNonChar();
   var key_len=key.length;
   var i;
   var adjusted_key="";

   for (i=0;i<key_len;i++) {
      var key_char=alphabet.indexOf(key.charAt(i));
      if (key_char<0) {
         continue;
      }
      adjusted_key+=alphabet.charAt(key_char);
   }

   key=adjusted_key;
   key_len=key.length;

   // Transform input:
   var input_len=input.length;
   var output="";
   var key_index=0;
   var in_tag=false;

   for (i=0;i<input_len;i++) {
      var input_char=input.charAt(i);
      if (input_char=="<") {
         in_tag=true;
      }
      else if (input_char==">") {
         in_tag = false;
      }
      if (in_tag) {
         output+=input_char;
         continue;
      }
      var input_char_value=alphabet.indexOf(input_char);
      if (input_char_value<0) {
         output+=input_char;
         continue;
      }
      var lowercase=input_char_value>=26 ? true : false;
      if (forward) {
         input_char_value+=alphabet.indexOf (key.charAt(key_index));
      }
      else {
         input_char_value-=alphabet.indexOf(key.charAt(key_index));
      }
      input_char_value+=26;
      if (lowercase) {
         input_char_value=input_char_value%26+26;
      }
      else {
         input_char_value%=26;
      }
      output+=alphabet.charAt(input_char_value);
      key_index=(key_index+1)%key_len;
   }
   return output;
};
var sha1 = function (msg) {
   var rotate_left=function rotate_left(n,s) {
         var t4 = ( n<<s ) | (n>>>(32-s));
         return t4;
   };

   var lsb_hex=function(val) {
         var str="";
         var i;
         var vh;
         var vl;
         for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
         }
         return str;
   };

   var cvt_hex=function (val) {
      var str="";
      var i;
      var v;

      for( i=7; i>=0; i-- ) {
         v = (val>>>(i*4))&0x0f;
         str += v.toString(16);
      }
      return str;
   };

   var blockstart;
   var i, j;
   var W = new Array(80);
   var H0 = 0x67452301;
   var H1 = 0xEFCDAB89;
   var H2 = 0x98BADCFE;
   var H3 = 0x10325476;
   var H4 = 0xC3D2E1F0;
   var A, B, C, D, E;
   var temp;

   msg = msg.encodeUTF8();

   var msg_len = msg.length;

   var word_array = new Array();
   for( i=0; i<msg_len-3; i+=4 ) {
      j = msg.charCodeAt(i)<<24 |
         msg.charCodeAt(i+1)<<16 |
         msg.charCodeAt(i+2)<<8 |
         msg.charCodeAt(i+3);
      word_array.push( j );
   }

   switch( msg_len % 4 ) {
      case 0:
         i = 0x080000000;
         break;
      case 1:
         i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
         break;
      case 2:
         i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
         break;
      case 3:
         i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8   | 0x80;
         break;
   }

   word_array.push(i);

   while( (word_array.length % 16) != 14 ) {
      word_array.push(0);
   }

   word_array.push( msg_len>>>29 );
   word_array.push( (msg_len<<3)&0x0ffffffff );

   for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

      for( i=0; i<16; i++ ) {
         W[i] = word_array[blockstart+i];
      }
      for( i=16; i<=79; i++ ) {
         W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
      }

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for( i= 0; i<=19; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=20; i<=39; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=40; i<=59; i++ ) {
         temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      for( i=60; i<=79; i++ ) {
         temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
         E = D;
         D = C;
         C = rotate_left(B,30);
         B = A;
         A = temp;
      }

      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;

   }

   var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

   return temp.toLowerCase();
};
var sha2 = {
   chrsz:8,                            // bits per input character. 8 - ASCII; 16 - Unicode
   hexcase:0,                          // hex output format. 0 - lowercase; 1 - uppercase
   safe_add:function (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
   },
   S:function  (X, n){return ( X >>> n ) | (X << (32 - n));},
   R:function (X, n) {return ( X >>> n );},
   Ch:function (x, y, z) {return ((x & y) ^ ((~x) & z));},
   Maj:function (x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));},
   Sigma0256:function (x) {return sha2.S(x, 2) ^ sha2.S(x, 13) ^ sha2.S(x, 22);},
   Sigma1256:function (x) {return sha2.S(x, 6) ^ sha2.S(x, 11) ^ sha2.S(x, 25);},
   Gamma0256:function (x) {return sha2.S(x, 7) ^ sha2.S(x, 18) ^ sha2.R(x, 3);},
   Gamma1256:function (x) {return sha2.S(x, 17) ^ sha2.S(x, 19) ^ sha2.R(x, 10);},
   Sigma0512:function (x) {return sha2.S(x, 28) ^ sha2.S(x, 34) ^ sha2.S(x, 39);},
   Sigma1512:function (x) {return sha2.S(x, 14) ^ sha2.S(x, 18) ^ sha2.S(x, 41);},
   Gamma0512:function (x) {return sha2.S(x, 1) ^ sha2.S(x, 8) ^ sha2.R(x, 7);},
   Gamma1512:function (x) {return sha2.S(x, 19) ^ sha2.S(x, 61) ^ sha2.R(x, 6);},
   core_sha256:function (m, l) {
      var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
      var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;

      // append padding
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;

      for ( var i = 0; i<m.length; i+=16 ) {
         a = HASH[0];
         b = HASH[1];
         c = HASH[2];
         d = HASH[3];
         e = HASH[4];
         f = HASH[5];
         g = HASH[6];
         h = HASH[7];

         for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = sha2.safe_add(sha2.safe_add(sha2.safe_add(sha2.Gamma1256(W[j - 2]), W[j - 7]), sha2.Gamma0256(W[j - 15])), W[j - 16]);

            T1 = sha2.safe_add(sha2.safe_add(sha2.safe_add(sha2.safe_add(h, sha2.Sigma1256(e)), sha2.Ch(e, f, g)), K[j]), W[j]);
            T2 = sha2.safe_add(sha2.Sigma0256(a), sha2.Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = sha2.safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = sha2.safe_add(T1, T2);
         }

         HASH[0] = sha2.safe_add(a, HASH[0]);
         HASH[1] = sha2.safe_add(b, HASH[1]);
         HASH[2] = sha2.safe_add(c, HASH[2]);
         HASH[3] = sha2.safe_add(d, HASH[3]);
         HASH[4] = sha2.safe_add(e, HASH[4]);
         HASH[5] = sha2.safe_add(f, HASH[5]);
         HASH[6] = sha2.safe_add(g, HASH[6]);
         HASH[7] = sha2.safe_add(h, HASH[7]);
      }
      return HASH;
   },
   str2binb:function  (str) {
      var bin = Array();
      var mask = (1 << sha2.chrsz) - 1;
      for(var i = 0; i < str.length * sha2.chrsz; i += sha2.chrsz) {
         bin[i>>5] |= (str.charCodeAt(i / sha2.chrsz) & mask) << (24 - i%32);
      }
      return bin;
   },
   binb2str:function (bin) {
      var str = "";
      var mask = (1 << sha2.chrsz) - 1;
      for(var i = 0; i < bin.length * 32; i += sha2.chrsz) {
         str += String.fromCharCode((bin[i>>5] >>> (24 - i%32)) & mask);
      }
      return str;
   },
   binb2hex:function (binarray) {
      var hex_tab = sha2.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i++) {
         str +=  hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
               hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
      }
      return str;
   },
   binb2b64:function (binarray) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i += 3) {
         var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16) |
                    (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 ) |
                    ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
         for(var j = 0; j < 4; j++) {
            if(i * 8 + j * 6 > binarray.length * 32) {
               str += b64pad;
            }
            else {
               str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
         }
      }
      return str;
   },
   hex_sha256:function (s){return sha2.binb2hex(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));},
   b64_sha256:function (s){return sha2.binb2b64(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));},
   str_sha256:function (s){return sha2.binb2str(sha2.core_sha256(sha2.str2binb(s),s.length * sha2.chrsz));}
};
var md5 = {
   hex_chr:"0123456789abcdef",
   rhex:function (num) {
      str = "";
      for(j = 0; j <= 3; j++) {
         str +=  md5.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
               md5.hex_chr.charAt((num >> (j * 8)) & 0x0F);
      }
      return str;
   },
   int32toarray:function (int32) {
      data = new Array();
      j=0;
      for (i=0;i<int32.length;i++) {
         for (k=0;k<4;k++) {
            data[j++] = (int32[i]>>(8*k))&255;
         }
      }
      return data;
   },
   //Convert a string to a sequence of 16-word blocks, stored as an array.
   //Append padding bits and the length, as described in the MD5 standard.
   str2blks_MD5:function (str,type) {
      nblk = ((str.length + 8) >> 6) + 1;
      blks = new Array(nblk * 16);
      for(i = 0; i < nblk * 16; i++) {
         blks[i] = 0;
      }
      if (type == 0) {
         for(i = 0; i < str.length; i++) {
            blks[i >> 2] |= str[i] << ((i % 4) * 8);
         }
      }
      else {
         for(i = 0; i < str.length; i++) {
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
         }
      }
      blks[i >> 2] |= 0x80 << ((i % 4) * 8);
      blks[nblk * 16 - 2] = str.length * 8;
      return blks;
   },
   //Add integers, wrapping at 2^32. This uses 16-bit operations internally
   //to work around bugs in some JS interpreters.
   add:function (x, y) {
       var lsw = (x & 0xFFFF) + (y & 0xFFFF);
       var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
       return (msw << 16) | (lsw & 0xFFFF);
   },
   //Bitwise rotate a 32-bit number to the left
   rol:function (num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
   },
   //These functions implement the basic operation for each round of the algorithm.
   cmn:function (q, a, b, x, s, t) {
      return md5.add(md5.rol(md5.add(md5.add(a, q), md5.add(x, t)), s), b);
   },
   ff:function (a, b, c, d, x, s, t) {
      return md5.cmn((b & c) | ((~b) & d), a, b, x, s, t);
   },
   gg:function (a, b, c, d, x, s, t) {
      return md5.cmn((b & d) | (c & (~d)), a, b, x, s, t);
   },
   hh:function (a, b, c, d, x, s, t) {
      return md5.cmn(b ^ c ^ d, a, b, x, s, t);
   },
   ii:function (a, b, c, d, x, s, t) {
      return md5.cmn(c ^ (b | (~d)), a, b, x, s, t);
   },
   //Take a string and return the hex representation of its MD5.
   //bTypeRet=0 : return a string (default)
   //bTypeRet=1 : return an array
   calcmd5:function (str,type, bTypeRet) {
      if(bTypeRet==null) {
         bTypeRet=0;
      }
      //Modified by MC
      x = md5.str2blks_MD5(str,type);
      a =  1732584193;
      b = -271733879;
      c = -1732584194;
      d =  271733878;
      for(i = 0; i < x.length; i += 16) {
         olda = a;
         oldb = b;
         oldc = c;
         oldd = d;
         a = md5.ff(a, b, c, d, x[i+ 0], 7 , -680876936);
         d = md5.ff(d, a, b, c, x[i+ 1], 12, -389564586);
         c = md5.ff(c, d, a, b, x[i+ 2], 17,  606105819);
         b = md5.ff(b, c, d, a, x[i+ 3], 22, -1044525330);
         a = md5.ff(a, b, c, d, x[i+ 4], 7 , -176418897);
         d = md5.ff(d, a, b, c, x[i+ 5], 12,  1200080426);
         c = md5.ff(c, d, a, b, x[i+ 6], 17, -1473231341);
         b = md5.ff(b, c, d, a, x[i+ 7], 22, -45705983);
         a = md5.ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
         d = md5.ff(d, a, b, c, x[i+ 9], 12, -1958414417);
         c = md5.ff(c, d, a, b, x[i+10], 17, -42063);
         b = md5.ff(b, c, d, a, x[i+11], 22, -1990404162);
         a = md5.ff(a, b, c, d, x[i+12], 7 ,  1804603682);
         d = md5.ff(d, a, b, c, x[i+13], 12, -40341101);
         c = md5.ff(c, d, a, b, x[i+14], 17, -1502002290);
         b = md5.ff(b, c, d, a, x[i+15], 22,  1236535329);
         a = md5.gg(a, b, c, d, x[i+ 1], 5 , -165796510);
         d = md5.gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
         c = md5.gg(c, d, a, b, x[i+11], 14,  643717713);
         b = md5.gg(b, c, d, a, x[i+ 0], 20, -373897302);
         a = md5.gg(a, b, c, d, x[i+ 5], 5 , -701558691);
         d = md5.gg(d, a, b, c, x[i+10], 9 ,  38016083);
         c = md5.gg(c, d, a, b, x[i+15], 14, -660478335);
         b = md5.gg(b, c, d, a, x[i+ 4], 20, -405537848);
         a = md5.gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
         d = md5.gg(d, a, b, c, x[i+14], 9 , -1019803690);
         c = md5.gg(c, d, a, b, x[i+ 3], 14, -187363961);
         b = md5.gg(b, c, d, a, x[i+ 8], 20,  1163531501);
         a = md5.gg(a, b, c, d, x[i+13], 5 , -1444681467);
         d = md5.gg(d, a, b, c, x[i+ 2], 9 , -51403784);
         c = md5.gg(c, d, a, b, x[i+ 7], 14,  1735328473);
         b = md5.gg(b, c, d, a, x[i+12], 20, -1926607734);

         a = md5.hh(a, b, c, d, x[i+ 5], 4 , -378558);
         d = md5.hh(d, a, b, c, x[i+ 8], 11, -2022574463);
         c = md5.hh(c, d, a, b, x[i+11], 16,  1839030562);
         b = md5.hh(b, c, d, a, x[i+14], 23, -35309556);
         a = md5.hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
         d = md5.hh(d, a, b, c, x[i+ 4], 11,  1272893353);
         c = md5.hh(c, d, a, b, x[i+ 7], 16, -155497632);
         b = md5.hh(b, c, d, a, x[i+10], 23, -1094730640);
         a = md5.hh(a, b, c, d, x[i+13], 4 ,  681279174);
         d = md5.hh(d, a, b, c, x[i+ 0], 11, -358537222);
         c = md5.hh(c, d, a, b, x[i+ 3], 16, -722521979);
         b = md5.hh(b, c, d, a, x[i+ 6], 23,  76029189);
         a = md5.hh(a, b, c, d, x[i+ 9], 4 , -640364487);
         d = md5.hh(d, a, b, c, x[i+12], 11, -421815835);
         c = md5.hh(c, d, a, b, x[i+15], 16,  530742520);
         b = md5.hh(b, c, d, a, x[i+ 2], 23, -995338651);
         a = md5.ii(a, b, c, d, x[i+ 0], 6 , -198630844);
         d = md5.ii(d, a, b, c, x[i+ 7], 10,  1126891415);
         c = md5.ii(c, d, a, b, x[i+14], 15, -1416354905);
         b = md5.ii(b, c, d, a, x[i+ 5], 21, -57434055);
         a = md5.ii(a, b, c, d, x[i+12], 6 ,  1700485571);
         d = md5.ii(d, a, b, c, x[i+ 3], 10, -1894986606);
         c = md5.ii(c, d, a, b, x[i+10], 15, -1051523);
         b = md5.ii(b, c, d, a, x[i+ 1], 21, -2054922799);
         a = md5.ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
         d = md5.ii(d, a, b, c, x[i+15], 10, -30611744);
         c = md5.ii(c, d, a, b, x[i+ 6], 15, -1560198380);
         b = md5.ii(b, c, d, a, x[i+13], 21,  1309151649);
         a = md5.ii(a, b, c, d, x[i+ 4], 6 , -145523070);
         d = md5.ii(d, a, b, c, x[i+11], 10, -1120210379);
         c = md5.ii(c, d, a, b, x[i+ 2], 15,  718787259);
         b = md5.ii(b, c, d, a, x[i+ 9], 21, -343485551);
         a = md5.add(a, olda);
         b = md5.add(b, oldb);
         c = md5.add(c, oldc);
         d = md5.add(d, oldd);
      }
      //return rhex(a) + rhex(b) + rhex(c) + rhex(d);
      int32 = new Array(a,b,c,d);
      if(bTypeRet==1) {
         return md5.int32toarray(int32);
      }
      else {
         return md5.int32toarray(int32).toBase().join('').toLowerCase();
      }
   }
};
var Morse = {
   letters:"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 &\PMC.utils.$\@\+\-_.,:;=?'-/()\"€\n\r\t",
   morse:Array(
       ".-","-...","-.-.","-..",".","..-.",
       "--.","....","..",".---","-.-",".-..",
       "--","-.","---",".--.","--.-",".-.",
       "...","-","..-","...-",".--","-..-",
       "-.--","--..","-----",".----","..---",
       "...--","....-",".....","-....","--...",
       "---..","----."," ",
       "·-···","···-··-","·--·-·",".-.-.","-····-","··--·-",".-.-.-","--..--","---...","-·-·-·","-···-","..--..",".----.","-....-","-..-.",
       "-·--·","-.--.-",".-..-.", "...-.-.---", "\n", "\r", "\t"),
   crypt:function (sIn)
   {
      sIn=sIn.removeAccents().toUpperCase();
      var aRet=Array();
      var iLen=sIn.length;
      for (var i=0;i<iLen;i++) {
         var input_char=sIn.charAt(i);
         var key=this.letters.indexOf(input_char);
         if (key<0) {
            aRet.push(" ");
            continue;
         }
         aRet.push(this.morse[key]);
      }
      return aRet.join(" ");
   },
   decrypt:function (sIn) {
      var aIn=sIn.replaceAll("_", "-").split(" ");
      var aRet=Array();
      for(var i=0;i<aIn.length;i++) {
         var key=this.morse.getKey(aIn[i]);
         if(key>-1) {
            aRet.push(this.letters.charAt(key));
         }
         else if(aIn[i]=="") {
            aRet.push(" ");
         }
      }
      return aRet.join("").replaceAll("  ", " ");
   }
};

String.prototype.encodeVigenere=function (key){return Vigenere(this, key, true);};
Number.prototype.encodeVigenere=function (key){return new String(this).encodeVigenere(key);};
Array.prototype.encodeVigenere=function (key){for(var i=0;i<this.length;i++){this[i]=this[i].encodeVigenere(key);}return this;};

String.prototype.decodeVigenere=function (key){return Vigenere(this, key, false);};
Number.prototype.decodeVigenere=function (key){return new String(this).decodeVigenere(key);};
Array.prototype.decodeVigenere=function (key){for(var i=0;i<this.length;i++){this[i]=this[i].decodeVigenere(key);}return this;};

String.prototype.sha1=function (){return sha1(this);};
Number.prototype.sha1=function (){return new String(this).sha1();};
Array.prototype.sha1=function (){for(var i=0;i<this.length;i++){this[i]=this[i].sha1();}return this;};

String.prototype.sha2=function (){return sha2.str_sha256(this);};
Number.prototype.sha2=function (){return new String(this).sha2();};
Array.prototype.sha2=function (){for(var i=0;i<this.length;i++){this[i]=this[i].sha2();}return this;};

String.prototype.md5=function (){return md5.calcmd5(this);};
Number.prototype.md5=function (){return new String(this).md5();};
Array.prototype.md5=function (){for(var i=0;i<this.length;i++){this[i]=this[i].md5();}return this;};

String.prototype.encodeMorse=function (){return Morse.crypt(this);};
Number.prototype.encodeMorse=function (){return new String(this).encodeMorse();};
Array.prototype.encodeMorse=function (){for(var i=0;i<this.length;i++){this[i]=this[i].encodeMorse();}return this;};

String.prototype.decodeMorse=function (){return Morse.decrypt(this);};
Number.prototype.decodeMorse=function (){return new String(this).decodeMorse();};
Array.prototype.decodeMorse=function (){for(var i=0;i<this.length;i++){this[i]=this[i].decodeMorse();}return this;};
})();
//// LZW-compress a string
//function lzw_encode(s) {
//   var dict = {};
//   var data = (s + "").split("");
//   var out = [];
//   var currChar;
//   var phrase = data[0];
//   var code = 256;
//   for (var i=1; i<data.length; i++) {
//      currChar=data[i];
//      if (dict[phrase + currChar] != null) {
//         phrase += currChar;
//      }
//      else {
//         out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
//         dict[phrase + currChar] = code;
//         code++;
//         phrase=currChar;
//      }
//   }
//   out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
//   for (var i=0; i<out.length; i++) {
//      out[i] = String.fromCharCode(out[i]);
//   }
//   return out.join("");
//}
//
//// Decompress an LZW-encoded string
//function lzw_decode(s) {
//   var dict = {};
//   var data = (s + "").split("");
//   var currChar = data[0];
//   var oldPhrase = currChar;
//   var out = [currChar];
//   var code = 256;
//   var phrase;
//   for (var i=1; i<data.length; i++) {
//      var currCode = data[i].charCodeAt(0);
//      if (currCode < 256) {
//         phrase = data[i];
//      }
//      else {
//         phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
//      }
//      out.push(phrase);
//      currChar = phrase.charAt(0);
//      dict[code] = oldPhrase + currChar;
//      code++;
//      oldPhrase = phrase;
//   }
//   return out.join("");
//}/*fin crypt.js*/ 
//------------------------
//---ZIP/UNZIP------------
//------------------------
/*
 * $Id: rawdeflate.js,v 0.5 2013/04/09 14:25:38 dankogai Exp $
 *
 * GNU General Public License, version 2 (GPL-2.0)
 *   http://opensource.org/licenses/GPL-2.0
 * Original:
 *  http://www.onicos.com/staff/iz/amuse/javascript/expert/deflate.txt
 */

(function(ctx){

/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0.1
 * LastModified: Dec 25 1999
 */

/* Interface:
 * data = zip_deflate(src);
 */

/* constant parameters */
var zip_WSIZE = 32768;      // Sliding Window size
var zip_STORED_BLOCK = 0;
var zip_STATIC_TREES = 1;
var zip_DYN_TREES    = 2;

/* for deflate */
var zip_DEFAULT_LEVEL = 6;
var zip_FULL_SEARCH = true;
var zip_INBUFSIZ = 32768;   // Input buffer size
var zip_INBUF_EXTRA = 64;   // Extra buffer
var zip_OUTBUFSIZ = 1024 * 8;
var zip_window_size = 2 * zip_WSIZE;
var zip_MIN_MATCH = 3;
var zip_MAX_MATCH = 258;
var zip_BITS = 16;
// for SMALL_MEM
var zip_LIT_BUFSIZE = 0x2000;
var zip_HASH_BITS = 13;
// for MEDIUM_MEM
// var zip_LIT_BUFSIZE = 0x4000;
// var zip_HASH_BITS = 14;
// for BIG_MEM
// var zip_LIT_BUFSIZE = 0x8000;
// var zip_HASH_BITS = 15;
if(zip_LIT_BUFSIZE > zip_INBUFSIZ) {
   alert("error: zip_INBUFSIZ is too small");
}
if((zip_WSIZE<<1) > (1<<zip_BITS)) {
   alert("error: zip_WSIZE is too large");
}
if(zip_HASH_BITS > zip_BITS-1) {
   alert("error: zip_HASH_BITS is too large");
}
if(zip_HASH_BITS < 8 || zip_MAX_MATCH != 258) {
   alert("error: Code too clever");
}
var zip_DIST_BUFSIZE = zip_LIT_BUFSIZE;
var zip_HASH_SIZE = 1 << zip_HASH_BITS;
var zip_HASH_MASK = zip_HASH_SIZE - 1;
var zip_WMASK = zip_WSIZE - 1;
var zip_NIL = 0; // Tail of hash chains
var zip_TOO_FAR = 4096;
var zip_MIN_LOOKAHEAD = zip_MAX_MATCH + zip_MIN_MATCH + 1;
var zip_MAX_DIST = zip_WSIZE - zip_MIN_LOOKAHEAD;
var zip_SMALLEST = 1;
var zip_MAX_BITS = 15;
var zip_MAX_BL_BITS = 7;
var zip_LENGTH_CODES = 29;
var zip_LITERALS =256;
var zip_END_BLOCK = 256;
var zip_L_CODES = zip_LITERALS + 1 + zip_LENGTH_CODES;
var zip_D_CODES = 30;
var zip_BL_CODES = 19;
var zip_REP_3_6 = 16;
var zip_REPZ_3_10 = 17;
var zip_REPZ_11_138 = 18;
var zip_HEAP_SIZE = 2 * zip_L_CODES + 1;
var zip_H_SHIFT = parseInt((zip_HASH_BITS + zip_MIN_MATCH - 1) / zip_MIN_MATCH);

/* variables */
var zip_free_queue;
var zip_qhead, zip_qtail;
var zip_initflag;
var zip_outbuf = null;
var zip_outcnt, zip_outoff;
var zip_complete;
var zip_window;
var zip_d_buf;
var zip_l_buf;
var zip_prev;
var zip_bi_buf;
var zip_bi_valid;
var zip_block_start;
var zip_ins_h;
var zip_hash_head;
var zip_prev_match;
var zip_match_available;
var zip_match_length;
var zip_prev_length;
var zip_strstart;
var zip_match_start;
var zip_eofile;
var zip_lookahead;
var zip_max_chain_length;
var zip_max_lazy_match;
var zip_compr_level;
var zip_good_match;
var zip_nice_match;
var zip_dyn_ltree;
var zip_dyn_dtree;
var zip_static_ltree;
var zip_static_dtree;
var zip_bl_tree;
var zip_l_desc;
var zip_d_desc;
var zip_bl_desc;
var zip_bl_count;
var zip_heap;
var zip_heap_len;
var zip_heap_max;
var zip_depth;
var zip_length_code;
var zip_dist_code;
var zip_base_length;
var zip_base_dist;
var zip_flag_buf;
var zip_last_lit;
var zip_last_dist;
var zip_last_flags;
var zip_flags;
var zip_flag_bit;
var zip_opt_len;
var zip_static_len;
var zip_deflate_data;
var zip_deflate_pos;

/* objects (deflate) */

var zip_DeflateCT = function() {
   this.fc = 0; // frequency count or bit string
   this.dl = 0; // father node in Huffman tree or length of bit string
};

var zip_DeflateTreeDesc = function() {
   this.dyn_tree = null;   // the dynamic tree
   this.static_tree = null;   // corresponding static tree or NULL
   this.extra_bits = null;   // extra bits for each code or NULL
   this.extra_base = 0;   // base index for extra_bits
   this.elems = 0;      // max number of elements in the tree
   this.max_length = 0;   // max bit length for the codes
   this.max_code = 0;      // largest code with non zero frequency
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
var zip_DeflateConfiguration = function(a, b, c, d) {
   this.good_length = a; // reduce lazy search above this match length
   this.max_lazy = b;    // do not perform lazy search above this match length
   this.nice_length = c; // quit search above this match length
   this.max_chain = d;
};

var zip_DeflateBuffer = function() {
   this.next = null;
   this.len = 0;
   this.ptr = new Array(zip_OUTBUFSIZ);
   this.off = 0;
};

/* constant tables */
var zip_extra_lbits = new Array(0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0);
var zip_extra_dbits = new Array(0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13);
var zip_extra_blbits = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7);
var zip_bl_order = new Array(16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15);
var zip_configuration_table = new Array(
   new zip_DeflateConfiguration(0,    0,   0,    0),
   new zip_DeflateConfiguration(4,    4,   8,    4),
   new zip_DeflateConfiguration(4,    5,  16,    8),
   new zip_DeflateConfiguration(4,    6,  32,   32),
   new zip_DeflateConfiguration(4,    4,  16,   16),
   new zip_DeflateConfiguration(8,   16,  32,   32),
   new zip_DeflateConfiguration(8,   16, 128,  128),
   new zip_DeflateConfiguration(8,   32, 128,  256),
   new zip_DeflateConfiguration(32, 128, 258, 1024),
   new zip_DeflateConfiguration(32, 258, 258, 4096));


/* routines (deflate) */

var zip_deflate_start = function(level) {
   var i;

   if(!level) {
      level = zip_DEFAULT_LEVEL;
   }
   else {
      if(level < 1) {
         level = 1;
      }
      else {
         if(level > 9) {
            level = 9;
         }
      }
   }
   zip_compr_level = level;
   zip_initflag = false;
   zip_eofile = false;
   if(zip_outbuf != null) {
      return;
   }
   zip_free_queue = zip_qhead = zip_qtail = null;
   zip_outbuf = new Array(zip_OUTBUFSIZ);
   zip_window = new Array(zip_window_size);
   zip_d_buf = new Array(zip_DIST_BUFSIZE);
   zip_l_buf = new Array(zip_INBUFSIZ + zip_INBUF_EXTRA);
   zip_prev = new Array(1 << zip_BITS);
   zip_dyn_ltree = new Array(zip_HEAP_SIZE);
   for(i = 0; i < zip_HEAP_SIZE; i++) {
      zip_dyn_ltree[i] = new zip_DeflateCT();
   }
   zip_dyn_dtree = new Array(2*zip_D_CODES+1);
   for(i = 0; i < 2*zip_D_CODES+1; i++) {
      zip_dyn_dtree[i] = new zip_DeflateCT();
   }
   zip_static_ltree = new Array(zip_L_CODES+2);
   for(i = 0; i < zip_L_CODES+2; i++) {
      zip_static_ltree[i] = new zip_DeflateCT();
   }
   zip_static_dtree = new Array(zip_D_CODES);
   for(i = 0; i < zip_D_CODES; i++) {
      zip_static_dtree[i] = new zip_DeflateCT();
   }
   zip_bl_tree = new Array(2*zip_BL_CODES+1);
   for(i = 0; i < 2*zip_BL_CODES+1; i++) {
      zip_bl_tree[i] = new zip_DeflateCT();
   }
   zip_l_desc = new zip_DeflateTreeDesc();
   zip_d_desc = new zip_DeflateTreeDesc();
   zip_bl_desc = new zip_DeflateTreeDesc();
   zip_bl_count = new Array(zip_MAX_BITS+1);
   zip_heap = new Array(2*zip_L_CODES+1);
   zip_depth = new Array(2*zip_L_CODES+1);
   zip_length_code = new Array(zip_MAX_MATCH-zip_MIN_MATCH+1);
   zip_dist_code = new Array(512);
   zip_base_length = new Array(zip_LENGTH_CODES);
   zip_base_dist = new Array(zip_D_CODES);
   zip_flag_buf = new Array(parseInt(zip_LIT_BUFSIZE / 8));
};

var zip_deflate_end = function() {
   zip_free_queue = zip_qhead = zip_qtail = null;
   zip_outbuf = null;
   zip_window = null;
   zip_d_buf = null;
   zip_l_buf = null;
   zip_prev = null;
   zip_dyn_ltree = null;
   zip_dyn_dtree = null;
   zip_static_ltree = null;
   zip_static_dtree = null;
   zip_bl_tree = null;
   zip_l_desc = null;
   zip_d_desc = null;
   zip_bl_desc = null;
   zip_bl_count = null;
   zip_heap = null;
   zip_depth = null;
   zip_length_code = null;
   zip_dist_code = null;
   zip_base_length = null;
   zip_base_dist = null;
   zip_flag_buf = null;
};

var zip_reuse_queue = function(p) {
   p.next = zip_free_queue;
   zip_free_queue = p;
};

var zip_new_queue = function() {
   var p;

   if(zip_free_queue != null) {
      p = zip_free_queue;
      zip_free_queue = zip_free_queue.next;
   }
   else {
      p = new zip_DeflateBuffer();
   }
   p.next = null;
   p.len = p.off = 0;

   return p;
};

var zip_head1 = function(i) {
   return zip_prev[zip_WSIZE + i];
};

var zip_head2 = function(i, val) {
   return zip_prev[zip_WSIZE + i] = val;
};

/* put_byte is used for the compressed output, put_ubyte for the
 * uncompressed output. However unlzw() uses window for its
 * suffix table instead of its output buffer, so it does not use put_ubyte
 * (to be cleaned up).
 */
var zip_put_byte = function(c) {
   zip_outbuf[zip_outoff + zip_outcnt++] = c;
   if(zip_outoff + zip_outcnt == zip_OUTBUFSIZ)
   zip_qoutbuf();
};

/* Output a 16 bit value, lsb first */
var zip_put_short = function(w) {
   w &= 0xffff;
   if(zip_outoff + zip_outcnt < zip_OUTBUFSIZ - 2) {
      zip_outbuf[zip_outoff + zip_outcnt++] = (w & 0xff);
      zip_outbuf[zip_outoff + zip_outcnt++] = (w >>> 8);
   }
   else {
      zip_put_byte(w & 0xff);
      zip_put_byte(w >>> 8);
   }
};

/* ==========================================================================
 * Insert string s in the dictionary and set match_head to the previous head
 * of the hash chain (the most recent string with same hash key). Return
 * the previous length of the hash chain.
 * IN  assertion: all calls to to INSERT_STRING are made with consecutive
 *    input characters and the first MIN_MATCH bytes of s are valid
 *    (except for the last MIN_MATCH-1 bytes of the input file).
 */
var zip_INSERT_STRING = function() {
    zip_ins_h = ((zip_ins_h << zip_H_SHIFT)
       ^ (zip_window[zip_strstart + zip_MIN_MATCH - 1] & 0xff))
   & zip_HASH_MASK;
   zip_hash_head = zip_head1(zip_ins_h);
   zip_prev[zip_strstart & zip_WMASK] = zip_hash_head;
   zip_head2(zip_ins_h, zip_strstart);
};

/* Send a code of the given tree. c and tree must not have side effects */
var zip_SEND_CODE = function(c, tree) {
   zip_send_bits(tree[c].fc, tree[c].dl);
};

/* Mapping from a distance to a distance code. dist is the distance - 1 and
 * must not have side effects. dist_code[256] and dist_code[257] are never
 * used.
 */
var zip_D_CODE = function(dist) {
   return (dist < 256 ? zip_dist_code[dist]
       : zip_dist_code[256 + (dist>>7)]) & 0xff;
};

/* ==========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
var zip_SMALLER = function(tree, n, m) {
    return tree[n].fc < tree[m].fc ||
      (tree[n].fc == tree[m].fc && zip_depth[n] <= zip_depth[m]);
};

/* ==========================================================================
 * read string data
 */
var zip_read_buff = function(buff, offset, n) {
   var i;
   for(i = 0; i < n && zip_deflate_pos < zip_deflate_data.length; i++) {
      buff[offset + i] =zip_deflate_data.charCodeAt(zip_deflate_pos++) & 0xff;
   }
   return i;
};

/* ==========================================================================
 * Initialize the "longest match" routines for a new file
 */
var zip_lm_init = function() {
   var j;

   /* Initialize the hash table. */
   for(j = 0; j < zip_HASH_SIZE; j++) {
      //   zip_head2(j, zip_NIL);
      zip_prev[zip_WSIZE + j] = 0;
   }
    /* prev will be initialized on the fly */

    /* Set the default configuration parameters:
     */
   zip_max_lazy_match = zip_configuration_table[zip_compr_level].max_lazy;
   zip_good_match     = zip_configuration_table[zip_compr_level].good_length;
   if(!zip_FULL_SEARCH) {
      zip_nice_match = zip_configuration_table[zip_compr_level].nice_length;
   }
   zip_max_chain_length = zip_configuration_table[zip_compr_level].max_chain;

   zip_strstart = 0;
   zip_block_start = 0;

   zip_lookahead = zip_read_buff(zip_window, 0, 2 * zip_WSIZE);
   if(zip_lookahead <= 0) {
      zip_eofile = true;
      zip_lookahead = 0;
      return;
   }
   zip_eofile = false;
    /* Make sure that we always have enough lookahead. This is important
     * if input comes from a device such as a tty.
     */
   while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
      zip_fill_window();
   }

    /* If lookahead < MIN_MATCH, ins_h is garbage, but this is
     * not important since only literal bytes will be emitted.
     */
   zip_ins_h = 0;
   for(j = 0; j < zip_MIN_MATCH - 1; j++) {
      //      UPDATE_HASH(ins_h, window[j]);
      zip_ins_h = ((zip_ins_h << zip_H_SHIFT) ^ (zip_window[j] & 0xff)) & zip_HASH_MASK;
   }
};

/* ==========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 */
var zip_longest_match = function(cur_match) {
   var chain_length = zip_max_chain_length; // max hash chain length
   var scanp = zip_strstart; // current string
   var matchp;      // matched string
   var len;      // length of current match
   var best_len = zip_prev_length;   // best match length so far

    /* Stop when cur_match becomes <= limit. To simplify the code,
     * we prevent matches with the string of window index 0.
     */
   var limit = (zip_strstart > zip_MAX_DIST ? zip_strstart - zip_MAX_DIST : zip_NIL);

   var strendp = zip_strstart + zip_MAX_MATCH;
   var scan_end1 = zip_window[scanp + best_len - 1];
   var scan_end  = zip_window[scanp + best_len];

    /* Do not waste too much time if we already have a good match: */
   if(zip_prev_length >= zip_good_match) {
      chain_length >>= 2;
   }

//  Assert(encoder->strstart <= window_size-MIN_LOOKAHEAD, "insufficient lookahead");

    do {
      //    Assert(cur_match < encoder->strstart, "no future");
      matchp = cur_match;

      /* Skip to next match if the match length cannot increase
         * or if the match length is less than 2:
      */
      if(zip_window[matchp + best_len]   != scan_end  ||
         zip_window[matchp + best_len - 1]   != scan_end1 ||
         zip_window[matchp]         != zip_window[scanp] ||
         zip_window[++matchp]         != zip_window[scanp + 1]) {
         continue;
      }

      /* The check at best_len-1 can be removed because it will be made
            * again later. (This heuristic is not always a win.)
            * It is not necessary to compare scan[2] and match[2] since they
            * are always equal when the other bytes match, given that
            * the hash keys are equal and that HASH_BITS >= 8.
            */
      scanp += 2;
      matchp++;

      /* We check for insufficient lookahead only every 8th comparison;
            * the 256th check will be made at strstart+258.
            */
      do {
      } while(zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         zip_window[++scanp] == zip_window[++matchp] &&
         scanp < strendp);

      len = zip_MAX_MATCH - (strendp - scanp);
      scanp = strendp - zip_MAX_MATCH;

      if(len > best_len) {
         zip_match_start = cur_match;
         best_len = len;
         if(zip_FULL_SEARCH) {
               if(len >= zip_MAX_MATCH) break;
         } else {
               if(len >= zip_nice_match) break;
         }

         scan_end1  = zip_window[scanp + best_len-1];
         scan_end   = zip_window[scanp + best_len];
      }
   } while((cur_match = zip_prev[cur_match & zip_WMASK]) > limit
       && --chain_length != 0);

   return best_len;
};

/* ==========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead, and sets eofile if end of input file.
 * IN assertion: lookahead < MIN_LOOKAHEAD && strstart + lookahead > 0
 * OUT assertions: at least one byte has been read, or eofile is set;
 *    file reads are performed for at least two bytes (required for the
 *    translate_eol option).
 */
var zip_fill_window = function() {
   var n, m;

   // Amount of free space at the end of the window.
   var more = zip_window_size - zip_lookahead - zip_strstart;

   /* If the window is almost full and there is insufficient lookahead,
    * move the upper half to the lower one to make room in the upper half.
    */
   if(more == -1) {
   /* Very unlikely, but possible on 16 bit machine if strstart == 0
         * and lookahead == 1 (input done one byte at time)
         */
      more--;
   }
   else {
      if(zip_strstart >= zip_WSIZE + zip_MAX_DIST) {
         /* By the IN assertion, the window is not empty so we can't confuse
            * more == 0 with more == 64K on a 16 bit machine.
            */
         //   Assert(window_size == (ulg)2*WSIZE, "no sliding with BIG_MEM");

         //   System.arraycopy(window, WSIZE, window, 0, WSIZE);
         for(n = 0; n < zip_WSIZE; n++) {
            zip_window[n] = zip_window[n + zip_WSIZE];
         }
         zip_match_start -= zip_WSIZE;
         zip_strstart    -= zip_WSIZE; /* we now have strstart >= MAX_DIST: */
         zip_block_start -= zip_WSIZE;

         for(n = 0; n < zip_HASH_SIZE; n++) {
            m = zip_head1(n);
            zip_head2(n, m >= zip_WSIZE ? m - zip_WSIZE : zip_NIL);
         }
         for(n = 0; n < zip_WSIZE; n++) {
            /* If n is not on any hash chain, prev[n] is garbage but
            * its value will never be used.
            */
            m = zip_prev[n];
            zip_prev[n] = (m >= zip_WSIZE ? m - zip_WSIZE : zip_NIL);
         }
         more += zip_WSIZE;
      }
   }
   // At this point, more >= 2
   if(!zip_eofile) {
      n = zip_read_buff(zip_window, zip_strstart + zip_lookahead, more);
      if(n <= 0) {
       zip_eofile = true;
      }
      else {
       zip_lookahead += n;
      }
   }
};

/* ==========================================================================
 * Processes a new input file and return its compressed length. This
 * function does not perform lazy evaluationof matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
var zip_deflate_fast = function() {
   while(zip_lookahead != 0 && zip_qhead == null) {
      var flush; // set if current block must be flushed

      /* Insert the string window[strstart .. strstart+2] in the
      * dictionary, and set hash_head to the head of the hash chain:
      */
      zip_INSERT_STRING();

      /* Find the longest match, discarding those <= prev_length.
      * At this point we have always match_length < MIN_MATCH
      */
      if(zip_hash_head != zip_NIL &&
         zip_strstart - zip_hash_head <= zip_MAX_DIST) {
         /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
         zip_match_length = zip_longest_match(zip_hash_head);
         /* longest_match() sets match_start */
         if(zip_match_length > zip_lookahead) {
            zip_match_length = zip_lookahead;
         }
      }
      if(zip_match_length >= zip_MIN_MATCH) {
   //       check_match(strstart, match_start, match_length);

         flush = zip_ct_tally(zip_strstart - zip_match_start,
               zip_match_length - zip_MIN_MATCH);
         zip_lookahead -= zip_match_length;

         /* Insert new strings in the hash table only if the match length
         * is not too large. This saves time but degrades compression.
         */
         if(zip_match_length <= zip_max_lazy_match) {
            zip_match_length--; // string at strstart already in hash table
            do {
               zip_strstart++;
               zip_INSERT_STRING();
               /* strstart never exceeds WSIZE-MAX_MATCH, so there are
               * always MIN_MATCH bytes ahead. If lookahead < MIN_MATCH
               * these bytes are garbage, but it does not matter since
               * the next lookahead bytes will be emitted as literals.
               */
            } while(--zip_match_length != 0);
            zip_strstart++;
         }
         else {
            zip_strstart += zip_match_length;
            zip_match_length = 0;
            zip_ins_h = zip_window[zip_strstart] & 0xff;
            //      UPDATE_HASH(ins_h, window[strstart + 1]);
            zip_ins_h = ((zip_ins_h<<zip_H_SHIFT) ^ (zip_window[zip_strstart + 1] & 0xff)) & zip_HASH_MASK;

            //#if MIN_MATCH != 3
            //      Call UPDATE_HASH() MIN_MATCH-3 more times
            //#endif

         }
      } else {
         /* No match, output a literal byte */
         flush = zip_ct_tally(0, zip_window[zip_strstart] & 0xff);
         zip_lookahead--;
         zip_strstart++;
      }
      if(flush) {
         zip_flush_block(0);
         zip_block_start = zip_strstart;
      }

      /* Make sure that we always have enough lookahead, except
      * at the end of the input file. We need MAX_MATCH bytes
      * for the next match, plus MIN_MATCH bytes to insert the
      * string following the next match.
      */
      while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
         zip_fill_window();
      }
   }
};

var zip_deflate_better = function() {
    /* Process the input block. */
   while(zip_lookahead != 0 && zip_qhead == null) {
      /* Insert the string window[strstart .. strstart+2] in the
      * dictionary, and set hash_head to the head of the hash chain:
      */
      zip_INSERT_STRING();

      /* Find the longest match, discarding those <= prev_length.
      */
      zip_prev_length = zip_match_length;
      zip_prev_match = zip_match_start;
      zip_match_length = zip_MIN_MATCH - 1;

      if(zip_hash_head != zip_NIL &&
         zip_prev_length < zip_max_lazy_match &&
         zip_strstart - zip_hash_head <= zip_MAX_DIST) {
         /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
         zip_match_length = zip_longest_match(zip_hash_head);
         /* longest_match() sets match_start */
         if(zip_match_length > zip_lookahead) {
            zip_match_length = zip_lookahead;
         }

         /* Ignore a length 3 match if it is too distant: */
         if(zip_match_length == zip_MIN_MATCH &&
            zip_strstart - zip_match_start > zip_TOO_FAR) {
         /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
            zip_match_length--;
         }
      }
      /* If there was a match at the previous step and the current
      * match is not better, output the previous match:
      */
      if(zip_prev_length >= zip_MIN_MATCH &&
         zip_match_length <= zip_prev_length) {
         var flush; // set if current block must be flushed

   //       check_match(strstart - 1, prev_match, prev_length);
         flush = zip_ct_tally(zip_strstart - 1 - zip_prev_match,
               zip_prev_length - zip_MIN_MATCH);

         /* Insert in hash table all strings up to the end of the match.
         * strstart-1 and strstart are already inserted.
         */
         zip_lookahead -= zip_prev_length - 1;
         zip_prev_length -= 2;
         do {
            zip_strstart++;
            zip_INSERT_STRING();
            /* strstart never exceeds WSIZE-MAX_MATCH, so there are
            * always MIN_MATCH bytes ahead. If lookahead < MIN_MATCH
            * these bytes are garbage, but it does not matter since the
            * next lookahead bytes will always be emitted as literals.
            */
         } while(--zip_prev_length != 0);
         zip_match_available = 0;
         zip_match_length = zip_MIN_MATCH - 1;
         zip_strstart++;
         if(flush) {
            zip_flush_block(0);
            zip_block_start = zip_strstart;
         }
      } else {
         if(zip_match_available != 0) {
            /* If there was no match at the previous position, output a
            * single literal. If there was a match but the current match
            * is longer, truncate the previous match to a single literal.
            */
            if(zip_ct_tally(0, zip_window[zip_strstart - 1] & 0xff)) {
               zip_flush_block(0);
               zip_block_start = zip_strstart;
            }
            zip_strstart++;
            zip_lookahead--;
         }
         else {
            /* There is no previous match to compare with, wait for
            * the next step to decide.
            */
            zip_match_available = 1;
            zip_strstart++;
            zip_lookahead--;
         }
      }

      /* Make sure that we always have enough lookahead, except
      * at the end of the input file. We need MAX_MATCH bytes
      * for the next match, plus MIN_MATCH bytes to insert the
      * string following the next match.
      */
      while(zip_lookahead < zip_MIN_LOOKAHEAD && !zip_eofile) {
         zip_fill_window();
      }
   }
};

var zip_init_deflate = function() {
   if(zip_eofile) {
      return;
   }
   zip_bi_buf = 0;
   zip_bi_valid = 0;
   zip_ct_init();
   zip_lm_init();

   zip_qhead = null;
   zip_outcnt = 0;
   zip_outoff = 0;
   zip_match_available = 0;

   if(zip_compr_level <= 3) {
      zip_prev_length = zip_MIN_MATCH - 1;
      zip_match_length = 0;
   }
   else {
      zip_match_length = zip_MIN_MATCH - 1;
      zip_match_available = 0;
      zip_match_available = 0;
   }

   zip_complete = false;
};

/* ==========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
var zip_deflate_internal = function(buff, off, buff_size) {
   var n;

   if(!zip_initflag) {
      zip_init_deflate();
      zip_initflag = true;
      if(zip_lookahead == 0) { // empty
         zip_complete = true;
         return 0;
      }
   }

   if((n = zip_qcopy(buff, off, buff_size)) == buff_size) {
      return buff_size;
   }

   if(zip_complete) {
      return n;
   }

   if(zip_compr_level <= 3) { // optimized for speed
      zip_deflate_fast();
   }
   else {
      zip_deflate_better();
   }
   if(zip_lookahead == 0) {
      if(zip_match_available != 0) {
         zip_ct_tally(0, zip_window[zip_strstart - 1] & 0xff);
      }
      zip_flush_block(1);
      zip_complete = true;
   }
   return n + zip_qcopy(buff, n + off, buff_size - n);
};

var zip_qcopy = function(buff, off, buff_size) {
   var n, i, j;

   n = 0;
   while(zip_qhead != null && n < buff_size) {
      i = buff_size - n;
      if(i > zip_qhead.len) {
         i = zip_qhead.len;
      }
      //      System.arraycopy(qhead.ptr, qhead.off, buff, off + n, i);
      for(j = 0; j < i; j++) {
         buff[off + n + j] = zip_qhead.ptr[zip_qhead.off + j];
      }

      zip_qhead.off += i;
      zip_qhead.len -= i;
      n += i;
      if(zip_qhead.len == 0) {
         var p;
         p = zip_qhead;
         zip_qhead = zip_qhead.next;
         zip_reuse_queue(p);
      }
   }

   if(n == buff_size) {
      return n;
   }

   if(zip_outoff < zip_outcnt) {
      i = buff_size - n;
      if(i > zip_outcnt - zip_outoff) {
         i = zip_outcnt - zip_outoff;
      }
      // System.arraycopy(outbuf, outoff, buff, off + n, i);
      for(j = 0; j < i; j++) {
         buff[off + n + j] = zip_outbuf[zip_outoff + j];
      }
      zip_outoff += i;
      n += i;
      if(zip_outcnt == zip_outoff) {
         zip_outcnt = zip_outoff = 0;
      }
   }
   return n;
};

/* ==========================================================================
 * Allocate the match buffer, initialize the various tables and save the
 * location of the internal file attribute (ascii/binary) and method
 * (DEFLATE/STORE).
 */
var zip_ct_init = function() {
   var n;   // iterates over tree elements
   var bits;   // bit counter
   var length;   // length value
   var code;   // code value
   var dist;   // distance index

   if(zip_static_dtree[0].dl != 0) {
      return; // ct_init already called
   }

   zip_l_desc.dyn_tree     = zip_dyn_ltree;
   zip_l_desc.static_tree  = zip_static_ltree;
   zip_l_desc.extra_bits   = zip_extra_lbits;
   zip_l_desc.extra_base   = zip_LITERALS + 1;
   zip_l_desc.elems        = zip_L_CODES;
   zip_l_desc.max_length   = zip_MAX_BITS;
   zip_l_desc.max_code     = 0;

   zip_d_desc.dyn_tree     = zip_dyn_dtree;
   zip_d_desc.static_tree  = zip_static_dtree;
   zip_d_desc.extra_bits   = zip_extra_dbits;
   zip_d_desc.extra_base   = 0;
   zip_d_desc.elems        = zip_D_CODES;
   zip_d_desc.max_length   = zip_MAX_BITS;
   zip_d_desc.max_code     = 0;

   zip_bl_desc.dyn_tree    = zip_bl_tree;
   zip_bl_desc.static_tree = null;
   zip_bl_desc.extra_bits  = zip_extra_blbits;
   zip_bl_desc.extra_base  = 0;
   zip_bl_desc.elems       = zip_BL_CODES;
   zip_bl_desc.max_length  = zip_MAX_BL_BITS;
   zip_bl_desc.max_code    = 0;

   // Initialize the mapping length (0..255) -> length code (0..28)
   length = 0;
   for(code = 0; code < zip_LENGTH_CODES-1; code++) {
      zip_base_length[code] = length;
      for(n = 0; n < (1<<zip_extra_lbits[code]); n++) {
          zip_length_code[length++] = code;
      }
   }
   // Assert (length == 256, "ct_init: length != 256");

   /* Note that the length 255 (match length 258) can be represented
    * in two different ways: code 284 + 5 bits or code 285, so we
    * overwrite length_code[255] to use the best encoding:
    */
   zip_length_code[length-1] = code;

   /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
   dist = 0;
   for(code = 0 ; code < 16; code++) {
      zip_base_dist[code] = dist;
      for(n = 0; n < (1<<zip_extra_dbits[code]); n++) {
          zip_dist_code[dist++] = code;
      }
   }
   // Assert (dist == 256, "ct_init: dist != 256");
   dist >>= 7; // from now on, all distances are divided by 128
   for( ; code < zip_D_CODES; code++) {
      zip_base_dist[code] = dist << 7;
      for(n = 0; n < (1<<(zip_extra_dbits[code]-7)); n++) {
         zip_dist_code[256 + dist++] = code;
      }
   }
   // Assert (dist == 256, "ct_init: 256+dist != 512");

   // Construct the codes of the static literal tree
   for(bits = 0; bits <= zip_MAX_BITS; bits++) {
      zip_bl_count[bits] = 0;
   }
   n = 0;
   while(n <= 143) { zip_static_ltree[n++].dl = 8; zip_bl_count[8]++; }
   while(n <= 255) { zip_static_ltree[n++].dl = 9; zip_bl_count[9]++; }
   while(n <= 279) { zip_static_ltree[n++].dl = 7; zip_bl_count[7]++; }
   while(n <= 287) { zip_static_ltree[n++].dl = 8; zip_bl_count[8]++; }
   /* Codes 286 and 287 do not exist, but we must include them in the
    * tree construction to get a canonical Huffman tree (longest code
    * all ones)
    */
   zip_gen_codes(zip_static_ltree, zip_L_CODES + 1);

   /* The static distance tree is trivial: */
   for(n = 0; n < zip_D_CODES; n++) {
      zip_static_dtree[n].dl = 5;
      zip_static_dtree[n].fc = zip_bi_reverse(n, 5);
   }
   // Initialize the first block of the first file:
   zip_init_block();
};

/* ==========================================================================
 * Initialize a new block.
 */
var zip_init_block = function() {
   var n; // iterates over tree elements

   // Initialize the trees.
   for(n = 0; n < zip_L_CODES;  n++) {zip_dyn_ltree[n].fc = 0;}
   for(n = 0; n < zip_D_CODES;  n++) {zip_dyn_dtree[n].fc = 0;}
   for(n = 0; n < zip_BL_CODES; n++) {zip_bl_tree[n].fc = 0;}

   zip_dyn_ltree[zip_END_BLOCK].fc = 1;
   zip_opt_len = zip_static_len = 0;
   zip_last_lit = zip_last_dist = zip_last_flags = 0;
   zip_flags = 0;
   zip_flag_bit = 1;
};

/* ==========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
var zip_pqdownheap = function(
    tree,   // the tree to restore
    k) {   // node to move down
   var v = zip_heap[k];
   var j = k << 1;   // left son of k

   while(j <= zip_heap_len) {
      // Set j to the smallest of the two sons:
      if(j < zip_heap_len &&
         zip_SMALLER(tree, zip_heap[j + 1], zip_heap[j])) {
         j++;
      }

      // Exit if v is smaller than both sons
      if(zip_SMALLER(tree, v, zip_heap[j])) {
         break;
      }

      // Exchange v with the smallest son
      zip_heap[k] = zip_heap[j];
      k = j;

      // And continue down the tree, setting j to the left son of k
      j <<= 1;
   }
   zip_heap[k] = v;
};

/* ==========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
var zip_gen_bitlen = function(desc) { // the tree descriptor
   var tree       = desc.dyn_tree;
   var extra      = desc.extra_bits;
   var base       = desc.extra_base;
   var max_code   = desc.max_code;
   var max_length = desc.max_length;
   var stree      = desc.static_tree;
   var h;         // heap index
   var n, m;      // iterate over the tree elements
   var bits;      // bit length
   var xbits;     // extra bits
   var f;         // frequency
   var overflow   = 0;   // number of elements with bit length too large

   for(bits = 0; bits <= zip_MAX_BITS; bits++) {
      zip_bl_count[bits] = 0;
   }

   /* In a first pass, compute the optimal bit lengths (which may
    * overflow in the case of the bit length tree).
    */
   tree[zip_heap[zip_heap_max]].dl = 0; // root of the heap

   for(h = zip_heap_max + 1; h < zip_HEAP_SIZE; h++) {
      n = zip_heap[h];
      bits = tree[tree[n].dl].dl + 1;
      if(bits > max_length) {
         bits = max_length;
         overflow++;
      }
      tree[n].dl = bits;
      // We overwrite tree[n].dl which is no longer needed

      if(n > max_code) {
         continue; // not a leaf node
      }
      zip_bl_count[bits]++;
      xbits = 0;
      if(n >= base) {
         xbits = extra[n - base];
      }
      f = tree[n].fc;
      zip_opt_len += f * (bits + xbits);
      if(stree != null) {
         zip_static_len += f * (stree[n].dl + xbits);
      }
   }
   if(overflow == 0) {
      return;
   }

    // This happens for example on obj2 and pic of the Calgary corpus

    // Find the first bit length which could increase:
    do {
      bits = max_length - 1;
      while(zip_bl_count[bits] == 0) {
         bits--;
      }
      zip_bl_count[bits]--;      // move one leaf down the tree
      zip_bl_count[bits + 1] += 2;   // move one overflow item as its brother
      zip_bl_count[max_length]--;
      /* The brother of the overflow item also moves one step up,
      * but this does not affect bl_count[max_length]
      */
      overflow -= 2;
   } while(overflow > 0);

   /* Now recompute all bit lengths, scanning in increasing frequency.
    * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
    * lengths instead of fixing only the wrong ones. This idea is taken
    * from 'ar' written by Haruhiko Okumura.)
    */
   for(bits = max_length; bits != 0; bits--) {
      n = zip_bl_count[bits];
      while(n != 0) {
         m = zip_heap[--h];
         if(m > max_code) {
            continue;
         }
         if(tree[m].dl != bits) {
            zip_opt_len += (bits - tree[m].dl) * tree[m].fc;
            tree[m].fc = bits;
         }
         n--;
      }
   }
};

  /* ==========================================================================
   * Generate the codes for a given tree and bit counts (which need not be
   * optimal).
   * IN assertion: the array bl_count contains the bit length statistics for
   * the given tree and the field len is set for all tree elements.
   * OUT assertion: the field code is set for all tree elements of non
   *     zero code length.
   */
var zip_gen_codes = function(tree,   // the tree to decorate
         max_code) {   // largest code with non zero frequency
   var next_code = new Array(zip_MAX_BITS+1); // next code value for each bit length
   var code = 0;      // running code value
   var bits;         // bit index
   var n;         // code index

   /* The distribution counts are first used to generate the code values
    * without bit reversal.
    */
   for(bits = 1; bits <= zip_MAX_BITS; bits++) {
      code = ((code + zip_bl_count[bits-1]) << 1);
      next_code[bits] = code;
   }

   /* Check that the bit counts in bl_count are consistent. The last code
    * must be all ones.
    */
//    Assert (code + encoder->bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
//       "inconsistent bit counts");
//    Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

   for(n = 0; n <= max_code; n++) {
      var len = tree[n].dl;
      if(len == 0) {
         continue;
      }
      // Now reverse the bits
      tree[n].fc = zip_bi_reverse(next_code[len]++, len);
      //      Tracec(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
      //     n, (isgraph(n) ? n : ' '), len, tree[n].fc, next_code[len]-1));
   }
};

/* ==========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
var zip_build_tree = function(desc) { // the tree descriptor
   var tree       = desc.dyn_tree;
   var stree      = desc.static_tree;
   var elems      = desc.elems;
   var n, m;      // iterate over heap elements
   var max_code   = -1;   // largest code with non zero frequency
   var node       = elems;   // next internal node of the tree

   /* Construct the initial heap, with least frequent element in
    * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
    * heap[0] is not used.
    */
   zip_heap_len = 0;
   zip_heap_max = zip_HEAP_SIZE;

   for(n = 0; n < elems; n++) {
      if(tree[n].fc != 0) {
         zip_heap[++zip_heap_len] = max_code = n;
         zip_depth[n] = 0;
      }
      else {
         tree[n].dl = 0;
      }
   }

   /* The pkzip format requires that at least one distance code exists,
    * and that at least one bit should be sent even if there is only one
    * possible code. So to avoid special checks later on we force at least
    * two codes of non zero frequency.
    */
   while(zip_heap_len < 2) {
      var xnew = zip_heap[++zip_heap_len] = (max_code < 2 ? ++max_code : 0);
      tree[xnew].fc = 1;
      zip_depth[xnew] = 0;
      zip_opt_len--;
      if(stree != null) {
         zip_static_len -= stree[xnew].dl;
      }
      // new is 0 or 1 so it does not have extra bits
   }
   desc.max_code = max_code;

   /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
    * establish sub-heaps of increasing lengths:
    */
   for(n = zip_heap_len >> 1; n >= 1; n--) {
      zip_pqdownheap(tree, n);
   }

   /* Construct the Huffman tree by repeatedly combining the least two
    * frequent nodes.
    */
   do {
      n = zip_heap[zip_SMALLEST];
      zip_heap[zip_SMALLEST] = zip_heap[zip_heap_len--];
      zip_pqdownheap(tree, zip_SMALLEST);

      m = zip_heap[zip_SMALLEST];  // m = node of next least frequency

      // keep the nodes sorted by frequency
      zip_heap[--zip_heap_max] = n;
      zip_heap[--zip_heap_max] = m;

      // Create a new node father of n and m
      tree[node].fc = tree[n].fc + tree[m].fc;
      //   depth[node] = (char)(MAX(depth[n], depth[m]) + 1);
      if(zip_depth[n] > zip_depth[m] + 1) {
         zip_depth[node] = zip_depth[n];
      }
      else {
         zip_depth[node] = zip_depth[m] + 1;
      }
      tree[n].dl = tree[m].dl = node;

      // and insert the new node in the heap
      zip_heap[zip_SMALLEST] = node++;
      zip_pqdownheap(tree, zip_SMALLEST);

   } while(zip_heap_len >= 2);

   zip_heap[--zip_heap_max] = zip_heap[zip_SMALLEST];

   /* At this point, the fields freq and dad are set. We can now
    * generate the bit lengths.
    */
   zip_gen_bitlen(desc);

   // The field len is now set, we can generate the bit codes
   zip_gen_codes(tree, max_code);
};

/* ==========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree. Updates opt_len to take into account the repeat
 * counts. (The contribution of the bit length codes will be added later
 * during the construction of bl_tree.)
 */
var zip_scan_tree = function(tree,// the tree to be scanned
             max_code) {  // and its largest code of non zero frequency
   var n;         // iterates over all tree elements
   var prevlen = -1;      // last emitted length
   var curlen;         // length of current code
   var nextlen = tree[0].dl;   // length of next code
   var count = 0;      // repeat count of the current code
   var max_count = 7;      // max repeat count
   var min_count = 4;      // min repeat count

   if(nextlen == 0) {
      max_count = 138;
      min_count = 3;
   }
   tree[max_code + 1].dl = 0xffff; // guard

   for(n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[n + 1].dl;
      if(++count < max_count && curlen == nextlen) {
         continue;
      }
      else {
         if(count < min_count) {
            zip_bl_tree[curlen].fc += count;
         }
         else {
            if(curlen != 0) {
               if(curlen != prevlen) {
                  zip_bl_tree[curlen].fc++;
               }
               zip_bl_tree[zip_REP_3_6].fc++;
            } else {
               if(count <= 10) {
                  zip_bl_tree[zip_REPZ_3_10].fc++;
               }
               else {
                  zip_bl_tree[zip_REPZ_11_138].fc++;
               }
            }
            count = 0; prevlen = curlen;
            if(nextlen == 0) {
               max_count = 138;
               min_count = 3;
            } else if(curlen == nextlen) {
               max_count = 6;
               min_count = 3;
            } else {
               max_count = 7;
               min_count = 4;
            }
         }
      }
   }
};

  /* ==========================================================================
   * Send a literal or distance tree in compressed form, using the codes in
   * bl_tree.
   */
var zip_send_tree = function(tree, // the tree to be scanned
         max_code) { // and its largest code of non zero frequency
   var n;         // iterates over all tree elements
   var prevlen = -1;      // last emitted length
   var curlen;         // length of current code
   var nextlen = tree[0].dl;   // length of next code
   var count = 0;      // repeat count of the current code
   var max_count = 7;      // max repeat count
   var min_count = 4;      // min repeat count

   /* tree[max_code+1].dl = -1; */  /* guard already set */
   if(nextlen == 0) {
     max_count = 138;
     min_count = 3;
   }

   for(n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[n+1].dl;
      if(++count < max_count && curlen == nextlen) {
         continue;
      } else if(count < min_count) {
         do { zip_SEND_CODE(curlen, zip_bl_tree); } while(--count != 0);
      } else if(curlen != 0) {
         if(curlen != prevlen) {
            zip_SEND_CODE(curlen, zip_bl_tree);
            count--;
         }
         // Assert(count >= 3 && count <= 6, " 3_6?");
         zip_SEND_CODE(zip_REP_3_6, zip_bl_tree);
         zip_send_bits(count - 3, 2);
      } else if(count <= 10) {
         zip_SEND_CODE(zip_REPZ_3_10, zip_bl_tree);
         zip_send_bits(count-3, 3);
      } else {
         zip_SEND_CODE(zip_REPZ_11_138, zip_bl_tree);
         zip_send_bits(count-11, 7);
      }
      count = 0;
      prevlen = curlen;
      if(nextlen == 0) {
         max_count = 138;
         min_count = 3;
      } else if(curlen == nextlen) {
         max_count = 6;
         min_count = 3;
      } else {
         max_count = 7;
         min_count = 4;
      }
   }
};

/* ==========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
var zip_build_bl_tree = function() {
   var max_blindex;  // index of last bit length code of non zero freq

   // Determine the bit length frequencies for literal and distance trees
   zip_scan_tree(zip_dyn_ltree, zip_l_desc.max_code);
   zip_scan_tree(zip_dyn_dtree, zip_d_desc.max_code);

   // Build the bit length tree:
   zip_build_tree(zip_bl_desc);
   /* opt_len now includes the length of the tree representations, except
    * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
    */

   /* Determine the number of bit length codes to send. The pkzip format
    * requires that at least 4 bit length codes be sent. (appnote.txt says
    * 3 but the actual value used is 4.)
    */
   for(max_blindex = zip_BL_CODES-1; max_blindex >= 3; max_blindex--) {
      if(zip_bl_tree[zip_bl_order[max_blindex]].dl != 0) {
         break;
      }
   }
   /* Update opt_len to include the bit length tree and counts */
   zip_opt_len += 3*(max_blindex+1) + 5+5+4;
   //    Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
   //       encoder->opt_len, encoder->static_len));
   return max_blindex;
};

/* ==========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
var zip_send_all_trees = function(lcodes, dcodes, blcodes) { // number of codes for each tree
   var rank; // index in bl_order

//    Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
//    Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
//       "too many codes");
//    Tracev((stderr, "\nbl counts: "));
   zip_send_bits(lcodes-257, 5); // not +255 as stated in appnote.txt
   zip_send_bits(dcodes-1,   5);
   zip_send_bits(blcodes-4,  4); // not -3 as stated in appnote.txt
   for(rank = 0; rank < blcodes; rank++) {
      //      Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
      zip_send_bits(zip_bl_tree[zip_bl_order[rank]].dl, 3);
   }

   // send the literal tree
   zip_send_tree(zip_dyn_ltree,lcodes-1);

   // send the distance tree
   zip_send_tree(zip_dyn_dtree,dcodes-1);
};

/* ==========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
var zip_flush_block = function(eof) { // true if this is the last block for a file
   var opt_lenb, static_lenb; // opt_len and static_len in bytes
   var max_blindex;   // index of last bit length code of non zero freq
   var stored_len;   // length of input block

   stored_len = zip_strstart - zip_block_start;
   zip_flag_buf[zip_last_flags] = zip_flags; // Save the flags for the last 8 items

   // Construct the literal and distance trees
   zip_build_tree(zip_l_desc);
   //    Tracev((stderr, "\nlit data: dyn %ld, stat %ld",
   //       encoder->opt_len, encoder->static_len));

   zip_build_tree(zip_d_desc);
   //    Tracev((stderr, "\ndist data: dyn %ld, stat %ld",
   //       encoder->opt_len, encoder->static_len));
   /* At this point, opt_len and static_len are the total bit lengths of
    * the compressed block data, excluding the tree representations.
    */

   /* Build the bit length tree for the above two trees, and get the index
    * in bl_order of the last bit length code to send.
    */
   max_blindex = zip_build_bl_tree();

   // Determine the best encoding. Compute first the block length in bytes
   opt_lenb   = (zip_opt_len   +3+7)>>3;
   static_lenb = (zip_static_len+3+7)>>3;

   //    Trace((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u dist %u ",
   //      opt_lenb, encoder->opt_len,
   //      static_lenb, encoder->static_len, stored_len,
   //      encoder->last_lit, encoder->last_dist));

   if(static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
   }
   if(stored_len + 4 <= opt_lenb // 4: two words for the lengths
       && zip_block_start >= 0) {
      var i;

      /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
      * Otherwise we can't have processed more than WSIZE input bytes since
      * the last block flush, because compression would have been
      * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
      * transform a block into a stored block.
      */
      zip_send_bits((zip_STORED_BLOCK<<1)+eof, 3);  /* send block type */
      zip_bi_windup();       /* align on byte boundary */
      zip_put_short(stored_len);
      zip_put_short(~stored_len);

      // copy block
   /*
         p = &window[block_start];
         for(i = 0; i < stored_len; i++)
      put_byte(p[i]);
   */
      for(i = 0; i < stored_len; i++)
          zip_put_byte(zip_window[zip_block_start + i]);

   }
   else if(static_lenb == opt_lenb) {
      zip_send_bits((zip_STATIC_TREES<<1)+eof, 3);
      zip_compress_block(zip_static_ltree, zip_static_dtree);
   } else {
      zip_send_bits((zip_DYN_TREES<<1)+eof, 3);
      zip_send_all_trees(zip_l_desc.max_code+1,
               zip_d_desc.max_code+1,
               max_blindex+1);
      zip_compress_block(zip_dyn_ltree, zip_dyn_dtree);
   }

   zip_init_block();

   if(eof != 0) {
      zip_bi_windup();
   }
};

/* ==========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
var zip_ct_tally = function(
      dist, // distance of matched string
      lc) { // match length-MIN_MATCH or unmatched char (if dist==0)
   zip_l_buf[zip_last_lit++] = lc;
   if(dist == 0) {
      // lc is the unmatched char
      zip_dyn_ltree[lc].fc++;
   } else {
      // Here, lc is the match length - MIN_MATCH
      dist--;          // dist = match distance - 1
      //      Assert((ush)dist < (ush)MAX_DIST &&
      //        (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
      //        (ush)D_CODE(dist) < (ush)D_CODES,  "ct_tally: bad match");

      zip_dyn_ltree[zip_length_code[lc]+zip_LITERALS+1].fc++;
      zip_dyn_dtree[zip_D_CODE(dist)].fc++;

      zip_d_buf[zip_last_dist++] = dist;
      zip_flags |= zip_flag_bit;
   }
   zip_flag_bit <<= 1;

   // Output the flags if they fill a byte
   if((zip_last_lit & 7) == 0) {
      zip_flag_buf[zip_last_flags++] = zip_flags;
      zip_flags = 0;
      zip_flag_bit = 1;
   }
   // Try to guess if it is profitable to stop the current block here
   if(zip_compr_level > 2 && (zip_last_lit & 0xfff) == 0) {
      // Compute an upper bound for the compressed length
      var out_length = zip_last_lit * 8;
      var in_length = zip_strstart - zip_block_start;
      var dcode;

      for(dcode = 0; dcode < zip_D_CODES; dcode++) {
         out_length += zip_dyn_dtree[dcode].fc * (5 + zip_extra_dbits[dcode]);
      }
      out_length >>= 3;
      //      Trace((stderr,"\nlast_lit %u, last_dist %u, in %ld, out ~%ld(%ld%%) ",
      //        encoder->last_lit, encoder->last_dist, in_length, out_length,
      //        100L - out_length*100L/in_length));
      if(zip_last_dist < parseInt(zip_last_lit/2) &&
         out_length < parseInt(in_length/2))
         return true;
      }
   return (zip_last_lit == zip_LIT_BUFSIZE-1 ||
       zip_last_dist == zip_DIST_BUFSIZE);
    /* We avoid equality with LIT_BUFSIZE because of wraparound at 64K
     * on 16 bit machines and because stored blocks are restricted to
     * 64K-1 bytes.
     */
};

  /* ==========================================================================
   * Send the block data compressed using the given Huffman trees
   */
var zip_compress_block = function(
      ltree,   // literal tree
      dtree) {   // distance tree
   var dist;      // distance of matched string
   var lc;      // match length or unmatched char (if dist == 0)
   var lx = 0;      // running index in l_buf
   var dx = 0;      // running index in d_buf
   var fx = 0;      // running index in flag_buf
   var flag = 0;   // current flags
   var code;      // the code to send
   var extra;      // number of extra bits to send

   if(zip_last_lit != 0) {
      do {
         if((lx & 7) == 0) {
            flag = zip_flag_buf[fx++];
         }
         lc = zip_l_buf[lx++] & 0xff;
         if((flag & 1) == 0) {
            zip_SEND_CODE(lc, ltree); /* send a literal byte */
//         Tracecv(isgraph(lc), (stderr," '%c' ", lc));
         }
         else {
            // Here, lc is the match length - MIN_MATCH
            code = zip_length_code[lc];
            zip_SEND_CODE(code+zip_LITERALS+1, ltree); // send the length code
            extra = zip_extra_lbits[code];
            if(extra != 0) {
               lc -= zip_base_length[code];
               zip_send_bits(lc, extra); // send the extra length bits
            }
            dist = zip_d_buf[dx++];
            // Here, dist is the match distance - 1
            code = zip_D_CODE(dist);
//         Assert (code < D_CODES, "bad d_code");

            zip_SEND_CODE(code, dtree);     // send the distance code
            extra = zip_extra_dbits[code];
            if(extra != 0) {
               dist -= zip_base_dist[code];
               zip_send_bits(dist, extra);   // send the extra distance bits
            }
         } // literal or match pair ?
         flag >>= 1;
      } while(lx < zip_last_lit);
   }
   zip_SEND_CODE(zip_END_BLOCK, ltree);
};

/* ==========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
var zip_Buf_size = 16; // bit size of bi_buf
var zip_send_bits = function(
      value,   // value to send
      length) {   // number of bits
    /* If not enough room in bi_buf, use (valid) bits from bi_buf and
     * (16 - bi_valid) bits from value, leaving (width - (16-bi_valid))
     * unused bits in value.
     */
   if(zip_bi_valid > zip_Buf_size - length) {
      zip_bi_buf |= (value << zip_bi_valid);
      zip_put_short(zip_bi_buf);
      zip_bi_buf = (value >> (zip_Buf_size - zip_bi_valid));
      zip_bi_valid += length - zip_Buf_size;
   }
   else {
      zip_bi_buf |= value << zip_bi_valid;
      zip_bi_valid += length;
   }
};

/* ==========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
var zip_bi_reverse = function(
      code,   // the value to invert
      len) {   // its bit length
   var res = 0;
   do {
      res |= code & 1;
      code >>= 1;
      res <<= 1;
   } while(--len > 0);
   return res >> 1;
};

/* ==========================================================================
 * Write out any remaining bits in an incomplete byte.
 */
var zip_bi_windup = function() {
   if(zip_bi_valid > 8) {
      zip_put_short(zip_bi_buf);
   }
   else {
      if(zip_bi_valid > 0) {
         zip_put_byte(zip_bi_buf);
      }
   }
   zip_bi_buf = 0;
   zip_bi_valid = 0;
};

var zip_qoutbuf = function() {
   if(zip_outcnt != 0) {
      var q, i;
      q = zip_new_queue();
      if(zip_qhead == null) {
         zip_qhead = zip_qtail = q;
      }
      else {
         zip_qtail = zip_qtail.next = q;
      }
      q.len = zip_outcnt - zip_outoff;
      //      System.arraycopy(zip_outbuf, zip_outoff, q.ptr, 0, q.len);
      for(i = 0; i < q.len; i++) {
         q.ptr[i] = zip_outbuf[zip_outoff + i];
      }
      zip_outcnt = zip_outoff = 0;
   }
};

var zip_deflate = function(str, level) {
   var i, j;

   zip_deflate_data = str;
   zip_deflate_pos = 0;
   if(typeof level == "undefined") {
      level = zip_DEFAULT_LEVEL;
   }
   zip_deflate_start(level);

   var buff = new Array(1024);
   var aout = [];
   while((i = zip_deflate_internal(buff, 0, buff.length)) > 0) {
      var cbuf = new Array(i);
      for(j = 0; j < i; j++){
          cbuf[j] = String.fromCharCode(buff[j]);
      }
      aout[aout.length] = cbuf.join("");
   }
   zip_deflate_data = null; // G.C.
   return aout.join("");
};

ctx.Crypt=ctx.Crypt || {};
ctx.Crypt.zip = zip_deflate;
})(PMC);


/*
 * $Id: rawinflate.js,v 0.4 2014/03/01 21:59:08 dankogai Exp dankogai $
 *
 * GNU General Public License, version 2 (GPL-2.0)
 *   http://opensource.org/licenses/GPL-2.0
 * original:
 *   http://www.onicos.com/staff/iz/amuse/javascript/expert/inflate.txt
 */

(function(ctx){

/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0.0.1
 * LastModified: Dec 25 1999
 */

/* Interface:
 * data = zip_inflate(src);
 */

/* constant parameters */
var zip_WSIZE = 32768;      // Sliding Window size
var zip_STORED_BLOCK = 0;
var zip_STATIC_TREES = 1;
var zip_DYN_TREES    = 2;

/* for inflate */
var zip_lbits = 9;       // bits in base literal/length lookup table
var zip_dbits = 6;       // bits in base distance lookup table
var zip_INBUFSIZ = 32768;   // Input buffer size
var zip_INBUF_EXTRA = 64;   // Extra buffer

/* variables (inflate) */
var zip_slide;
var zip_wp;         // current position in slide
var zip_fixed_tl = null;   // inflate static
var zip_fixed_td;      // inflate static
var zip_fixed_bl, zip_fixed_bd;   // inflate static
var zip_bit_buf;      // bit buffer
var zip_bit_len;      // bits in bit buffer
var zip_method;
var zip_eof;
var zip_copy_leng;
var zip_copy_dist;
var zip_tl, zip_td;   // literal/length and distance decoder tables
var zip_bl, zip_bd;   // number of bits decoded by tl and td

var zip_inflate_data;
var zip_inflate_pos;


/* constant tables (inflate) */
var zip_MASK_BITS = new Array(
    0x0000,
    0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff,
    0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff);
// Tables for deflate from PKZIP's appnote.txt.
var zip_cplens = new Array( // Copy lengths for literal codes 257..285
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0);
/* note: see note #13 above about the 258 in this list. */
var zip_cplext = new Array( // Extra bits for literal codes 257..285
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
    3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99); // 99==invalid
var zip_cpdist = new Array( // Copy offsets for distance codes 0..29
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577);
var zip_cpdext = new Array( // Extra bits for distance codes
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
    12, 12, 13, 13);
var zip_border = new Array(  // Order of the bit length code lengths
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15);
/* objects (inflate) */

var zip_HuftList = function() {
   this.next = null;
   this.list = null;
};

var zip_HuftNode = function() {
   this.e = 0; // number of extra bits or operation
   this.b = 0; // number of bits in this code or subcode

   // union
   this.n = 0; // literal, length base, or distance base
   this.t = null; // (zip_HuftNode) pointer to next level of table
};

var zip_HuftBuild = function(b,   // code lengths in bits (all assumed <= BMAX)
             n,   // number of codes (assumed <= N_MAX)
             s,   // number of simple-valued codes (0..s-1)
             d,   // list of base values for non-simple codes
             e,   // list of extra bits for non-simple codes
             mm   // maximum lookup bits
         ) {
   this.BMAX = 16;   // maximum bit length of any code
   this.N_MAX = 288; // maximum number of codes in any set
   this.status = 0;   // 0: success, 1: incomplete table, 2: bad input
   this.root = null;   // (zip_HuftList) starting table
   this.m = 0;      // maximum lookup bits, returns actual

/* Given a list of code lengths and a maximum table size, make a set of
   tables to decode that set of codes.   Return zero on success, one if
   the given code set is incomplete (the tables are still built in this
   case), two if the input is invalid (all zero length codes or an
   oversubscribed set of lengths), and three if not enough memory.
   The code with value 256 is special, and the tables are constructed
   so that no bits beyond that code are fetched when that code is
   decoded. */
    {
   var a;         // counter for codes of length k
   var c = new Array(this.BMAX+1);   // bit length count table
   var el;         // length of EOB code (value 256)
   var f;         // i repeats in table every f entries
   var g;         // maximum code length
   var h;         // table level
   var i;         // counter, current code
   var j;         // counter
   var k;         // number of bits in current code
   var lx = new Array(this.BMAX+1);   // stack of bits per table
   var p;         // pointer into c[], b[], or v[]
   var pidx;      // index of p
   var q;         // (zip_HuftNode) points to current table
   var r = new zip_HuftNode(); // table entry for structure assignment
   var u = new Array(this.BMAX); // zip_HuftNode[BMAX][]  table stack
   var v = new Array(this.N_MAX); // values in order of bit length
   var w;
   var x = new Array(this.BMAX+1);// bit offsets, then code stack
   var xp;         // pointer into x or c
   var y;         // number of dummy codes added
   var z;         // number of entries in current table
   var o;
   var tail;      // (zip_HuftList)

   tail = this.root = null;
   for(i = 0; i < c.length; i++) {
      c[i] = 0;
   }
   for(i = 0; i < lx.length; i++) {
      lx[i] = 0;
   }
   for(i = 0; i < u.length; i++) {
      u[i] = null;
   }
   for(i = 0; i < v.length; i++) {
      v[i] = 0;
   }
   for(i = 0; i < x.length; i++) {
      x[i] = 0;
   }

   // Generate counts for each bit length
   el = n > 256 ? b[256] : this.BMAX; // set length of EOB code, if any
   p = b; pidx = 0;
   i = n;
   do {
      c[p[pidx]]++;   // assume all entries <= BMAX
      pidx++;
   } while(--i > 0);
   if(c[0] == n) {   // null input--all zero length codes
      this.root = null;
      this.m = 0;
      this.status = 0;
      return;
   }

   // Find minimum and maximum length, bound *m by those
   for(j = 1; j <= this.BMAX; j++) {
      if(c[j] != 0) {
         break;
      }
   }
   k = j;         // minimum code length
   if(mm < j) {
      mm = j;
   }
   for(i = this.BMAX; i != 0; i--) {
      if(c[i] != 0) {
         break;
      }
   }
   g = i;         // maximum code length
   if(mm > i) {
      mm = i;
   }
   // Adjust last length count to fill out codes, if needed
   for(y = 1 << j; j < i; j++, y <<= 1) {
      if((y -= c[j]) < 0) {
         this.status = 2;   // bad input: more codes than bits
         this.m = mm;
         return;
      }
   }
   if((y -= c[i]) < 0) {
      this.status = 2;
      this.m = mm;
      return;
   }
   c[i] += y;

   // Generate starting offsets into the value table for each length
   x[1] = j = 0;
   p = c;
   pidx = 1;
   xp = 2;
   while(--i > 0) {      // note that i == g from above
      x[xp++] = (j += p[pidx++]);
   }
   // Make a table of values in order of bit lengths
   p = b; pidx = 0;
   i = 0;
   do {
      if((j = p[pidx++]) != 0) {
         v[x[j]++] = i;
      }
   } while(++i < n);
   n = x[g];         // set n to length of v

   // Generate the Huffman codes and for each, make the table entries
   x[0] = i = 0;      // first Huffman code is zero
   p = v; pidx = 0;      // grab values in bit order
   h = -1;         // no tables yet--level -1
   w = lx[0] = 0;      // no bits decoded yet
   q = null;         // ditto
   z = 0;         // ditto

   // go through the bit lengths (k already is bits in shortest code)
   for(; k <= g; k++) {
      a = c[k];
      while(a-- > 0) {
         // here i is the Huffman code of length k bits for value p[pidx]
         // make tables up to required level
         while(k > w + lx[1 + h]) {
            w += lx[1 + h]; // add bits already decoded
            h++;

            // compute minimum size table less than or equal to *m bits
            z = (z = g - w) > mm ? mm : z; // upper limit
            if((f = 1 << (j = k - w)) > a + 1) { // try a k-w bit table
               // too few codes for k-w bit table
               f -= a + 1;   // deduct codes from patterns left
               xp = k;
               while(++j < z) { // try smaller tables up to z bits
                  if((f <<= 1) <= c[++xp]) {
                     break;   // enough codes to use up j bits
                  }
                  f -= c[xp];   // else deduct codes from patterns
               }
            }
            if(w + j > el && w < el) {
               j = el - w;   // make EOB code end at table
            }
            z = 1 << j;   // table entries for j-bit table
            lx[1 + h] = j; // set table size in stack

            // allocate and link in new table
            q = new Array(z);
            for(o = 0; o < z; o++) {
               q[o] = new zip_HuftNode();
            }

            if(tail == null) {
               tail = this.root = new zip_HuftList();
            }
            else {
               tail = tail.next = new zip_HuftList();
            }
            tail.next = null;
            tail.list = q;
            u[h] = q;   // table starts after link

            /* connect to last table, if there is one */
            if(h > 0) {
               x[h] = i;      // save pattern for backing up
               r.b = lx[h];   // bits to dump before this table
               r.e = 16 + j;   // bits in this table
               r.t = q;      // pointer to this table
               j = (i & ((1 << w) - 1)) >> (w - lx[h]);
               u[h-1][j].e = r.e;
               u[h-1][j].b = r.b;
               u[h-1][j].n = r.n;
               u[h-1][j].t = r.t;
            }
         }

         // set up table entry in r
         r.b = k - w;
         if(pidx >= n) {
            r.e = 99;      // out of values--invalid code
         }
         else if(p[pidx] < s) {
            r.e = (p[pidx] < 256 ? 16 : 15); // 256 is end-of-block code
            r.n = p[pidx++];   // simple code is just the value
         } else {
            r.e = e[p[pidx] - s];   // non-simple--look up in lists
            r.n = d[p[pidx++] - s];
         }

         // fill code-like entries with r //
         f = 1 << (k - w);
         for(j = i >> w; j < z; j += f) {
            q[j].e = r.e;
            q[j].b = r.b;
            q[j].n = r.n;
            q[j].t = r.t;
         }

         // backwards increment the k-bit code i
         for(j = 1 << (k - 1); (i & j) != 0; j >>= 1) {
            i ^= j;
         }
         i ^= j;

         // backup over finished tables
         while((i & ((1 << w) - 1)) != x[h]) {
            w -= lx[h];      // don't need to update q
            h--;
         }
      }
   }

   /* return actual size of base table */
   this.m = lx[1];

   /* Return true (1) if we were given an incomplete table */
   this.status = ((y != 0 && g != 1) ? 1 : 0);
    } /* end of constructor */
};


/* routines (inflate) */

var zip_GET_BYTE = function() {
   if(zip_inflate_data.length == zip_inflate_pos) {
      return -1;
   }
   return zip_inflate_data.charCodeAt(zip_inflate_pos++) & 0xff;
};

var zip_NEEDBITS = function(n) {
   while(zip_bit_len < n) {
      zip_bit_buf |= zip_GET_BYTE() << zip_bit_len;
      zip_bit_len += 8;
   }
};

var zip_GETBITS = function(n) {
   return zip_bit_buf & zip_MASK_BITS[n];
};

var zip_DUMPBITS = function(n) {
   zip_bit_buf >>= n;
   zip_bit_len -= n;
};

var zip_inflate_codes = function(buff, off, size) {
   /* inflate (decompress) the codes in a deflated (compressed) block.
      Return an error code or zero if it all goes ok. */
   var e;      // table entry flag/number of extra bits
   var t;      // (zip_HuftNode) pointer to table entry
   var n;

   if(size == 0) {
      return 0;
   }
   // inflate the coded data
   n = 0;
   for(;;) {         // do until end of block
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      e = t.e;
      while(e > 16) {
         if(e == 99) {
            return -1;
         }
         zip_DUMPBITS(t.b);
         e -= 16;
         zip_NEEDBITS(e);
         t = t.t[zip_GETBITS(e)];
         e = t.e;
      }
      zip_DUMPBITS(t.b);

      if(e == 16) {      // then it's a literal
         zip_wp &= zip_WSIZE - 1;
         buff[off + n++] = zip_slide[zip_wp++] = t.n;
         if(n == size) {
            return size;
         }
         continue;
      }

      // exit if end of block
      if(e == 15) {
         break;
      }

      // it's an EOB or a length

      // get length of block to copy
      zip_NEEDBITS(e);
      zip_copy_leng = t.n + zip_GETBITS(e);
      zip_DUMPBITS(e);

      // decode distance of block to copy
      zip_NEEDBITS(zip_bd);
      t = zip_td.list[zip_GETBITS(zip_bd)];
      e = t.e;

      while(e > 16) {
         if(e == 99) {
            return -1;
         }
         zip_DUMPBITS(t.b);
         e -= 16;
         zip_NEEDBITS(e);
         t = t.t[zip_GETBITS(e)];
         e = t.e;
      }
      zip_DUMPBITS(t.b);
      zip_NEEDBITS(e);
      zip_copy_dist = zip_wp - t.n - zip_GETBITS(e);
      zip_DUMPBITS(e);

      // do the copy
      while(zip_copy_leng > 0 && n < size) {
         zip_copy_leng--;
         zip_copy_dist &= zip_WSIZE - 1;
         zip_wp &= zip_WSIZE - 1;
         buff[off + n++] = zip_slide[zip_wp++] = zip_slide[zip_copy_dist++];
      }

      if(n == size) {
         return size;
      }
   }

   zip_method = -1; // done
   return n;
};

var zip_inflate_stored = function(buff, off, size) {
   /* "decompress" an inflated type 0 (stored) block. */
   var n;

   // go to byte boundary
   n = zip_bit_len & 7;
   zip_DUMPBITS(n);

   // get the length and its complement
   zip_NEEDBITS(16);
   n = zip_GETBITS(16);
   zip_DUMPBITS(16);
   zip_NEEDBITS(16);
   if(n != ((~zip_bit_buf) & 0xffff)) {
      return -1;         // error in compressed data
   }
   zip_DUMPBITS(16);

   // read and output the compressed data
   zip_copy_leng = n;

   n = 0;
   while(zip_copy_leng > 0 && n < size) {
      zip_copy_leng--;
      zip_wp &= zip_WSIZE - 1;
      zip_NEEDBITS(8);
      buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
      zip_DUMPBITS(8);
   }

   if(zip_copy_leng == 0) {
      zip_method = -1; // done
   }
   return n;
};

var zip_inflate_fixed = function(buff, off, size) {
   /* decompress an inflated type 1 (fixed Huffman codes) block.  We should
      either replace this with a custom decoder, or at least precompute the
      Huffman tables. */

   // if first time, set up tables for fixed blocks
   if(zip_fixed_tl == null) {
      var i;         // temporary variable
      var l = new Array(288);   // length list for huft_build
      var h;   // zip_HuftBuild

      // literal table
      for(i = 0; i < 144; i++) {
         l[i] = 8;
      }
      for(; i < 256; i++) {
         l[i] = 9;
      }
      for(; i < 280; i++) {
         l[i] = 7;
      }
      for(; i < 288; i++) { // make a complete, but wrong code set
         l[i] = 8;
      }
      zip_fixed_bl = 7;

      h = new zip_HuftBuild(l, 288, 257, zip_cplens, zip_cplext,
                  zip_fixed_bl);
      if(h.status != 0) {
         alert("HufBuild error: "+h.status);
         return -1;
      }
      zip_fixed_tl = h.root;
      zip_fixed_bl = h.m;

      // distance table
      for(i = 0; i < 30; i++) { // make an incomplete code set
         l[i] = 5;
      }
      zip_fixed_bd = 5;

      h = new zip_HuftBuild(l, 30, 0, zip_cpdist, zip_cpdext, zip_fixed_bd);
      if(h.status > 1) {
         zip_fixed_tl = null;
         alert("HufBuild error: "+h.status);
         return -1;
      }
      zip_fixed_td = h.root;
      zip_fixed_bd = h.m;
   }

   zip_tl = zip_fixed_tl;
   zip_td = zip_fixed_td;
   zip_bl = zip_fixed_bl;
   zip_bd = zip_fixed_bd;
   return zip_inflate_codes(buff, off, size);
};

var zip_inflate_dynamic = function(buff, off, size) {
   // decompress an inflated type 2 (dynamic Huffman codes) block.
   var i;      // temporary variables
   var j;
   var l;      // last length
   var n;      // number of lengths to get
   var t;      // (zip_HuftNode) literal/length code table
   var nb;      // number of bit length codes
   var nl;      // number of literal/length codes
   var nd;      // number of distance codes
   var ll = new Array(286+30); // literal/length and distance code lengths
   var h;      // (zip_HuftBuild)

   for(i = 0; i < ll.length; i++) {
      ll[i] = 0;
   }

   // read in table lengths
   zip_NEEDBITS(5);
   nl = 257 + zip_GETBITS(5);   // number of literal/length codes
   zip_DUMPBITS(5);
   zip_NEEDBITS(5);
   nd = 1 + zip_GETBITS(5);   // number of distance codes
   zip_DUMPBITS(5);
   zip_NEEDBITS(4);
   nb = 4 + zip_GETBITS(4);   // number of bit length codes
   zip_DUMPBITS(4);
   if(nl > 286 || nd > 30) {
      return -1;      // bad lengths
   }

   // read in bit-length-code lengths
   for(j = 0; j < nb; j++) {
      zip_NEEDBITS(3);
      ll[zip_border[j]] = zip_GETBITS(3);
      zip_DUMPBITS(3);
   }
   for(; j < 19; j++) {
      ll[zip_border[j]] = 0;
   }

   // build decoding table for trees--single level, 7 bit lookup
   zip_bl = 7;
   h = new zip_HuftBuild(ll, 19, 19, null, null, zip_bl);
   if(h.status != 0) {
      return -1;   // incomplete code set
   }
   zip_tl = h.root;
   zip_bl = h.m;

   // read in literal and distance code lengths
   n = nl + nd;
   i = l = 0;
   while(i < n) {
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      j = t.b;
      zip_DUMPBITS(j);
      j = t.n;
      if(j < 16) {     // length of code in bits (0..15)
         ll[i++] = l = j;   // save last length in l
      }
      else if(j == 16) {   // repeat last length 3 to 6 times
         zip_NEEDBITS(2);
         j = 3 + zip_GETBITS(2);
         zip_DUMPBITS(2);
         if(i + j > n) {
            return -1;
         }
         while(j-- > 0) {
            ll[i++] = l;
         }
      } else if(j == 17) {   // 3 to 10 zero length codes
         zip_NEEDBITS(3);
         j = 3 + zip_GETBITS(3);
         zip_DUMPBITS(3);
         if(i + j > n) {
            return -1;
         }
         while(j-- > 0) {
            ll[i++] = 0;
            l = 0;
         }
      } else {      // j == 18: 11 to 138 zero length codes
         zip_NEEDBITS(7);
         j = 11 + zip_GETBITS(7);
         zip_DUMPBITS(7);
         if(i + j > n) {
            return -1;
         }
         while(j-- > 0) {
         ll[i++] = 0;
         }
         l = 0;
      }
   }

   // build the decoding tables for literal/length and distance codes
   zip_bl = zip_lbits;
   h = new zip_HuftBuild(ll, nl, 257, zip_cplens, zip_cplext, zip_bl);
   if(zip_bl == 0) {  // no literals or lengths
      h.status = 1;
   }
   if(h.status != 0) {
      if(h.status == 1) {
         ;// **incomplete literal tree**
      }
      return -1;      // incomplete code set
   }
   zip_tl = h.root;
   zip_bl = h.m;

   for(i = 0; i < nd; i++) {
      ll[i] = ll[i + nl];
   }
   zip_bd = zip_dbits;
   h = new zip_HuftBuild(ll, nd, 0, zip_cpdist, zip_cpdext, zip_bd);
   zip_td = h.root;
   zip_bd = h.m;

   if(zip_bd == 0 && nl > 257) {   // lengths but no distances
      // **incomplete distance tree**
      return -1;
   }

   if(h.status == 1) {
   ;// **incomplete distance tree**
   }
   if(h.status != 0) {
      return -1;
   }

   // decompress until an end-of-block code
   return zip_inflate_codes(buff, off, size);
};

var zip_inflate_start = function() {
   var i;

   if(zip_slide == null) {
      zip_slide = new Array(2 * zip_WSIZE);
   }
   zip_wp = 0;
   zip_bit_buf = 0;
   zip_bit_len = 0;
   zip_method = -1;
   zip_eof = false;
   zip_copy_leng = zip_copy_dist = 0;
   zip_tl = null;
};

var zip_inflate_internal = function(buff, off, size) {
   // decompress an inflated entry
   var n, i;

   n = 0;
   while(n < size) {
      if(zip_eof && zip_method == -1) {
         return n;
      }

      if(zip_copy_leng > 0) {
         if(zip_method != zip_STORED_BLOCK) {
            // STATIC_TREES or DYN_TREES
            while(zip_copy_leng > 0 && n < size) {
               zip_copy_leng--;
               zip_copy_dist &= zip_WSIZE - 1;
               zip_wp &= zip_WSIZE - 1;
               buff[off + n++] = zip_slide[zip_wp++] =
               zip_slide[zip_copy_dist++];
            }
          } else {
            while(zip_copy_leng > 0 && n < size) {
               zip_copy_leng--;
               zip_wp &= zip_WSIZE - 1;
               zip_NEEDBITS(8);
               buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
               zip_DUMPBITS(8);
            }
            if(zip_copy_leng == 0)
               zip_method = -1; // done
            }
            if(n == size) {
               return n;
            }
      }

      if(zip_method == -1) {
         if(zip_eof) {
            break;
         }

         // read in last block bit
         zip_NEEDBITS(1);
         if(zip_GETBITS(1) != 0) {
            zip_eof = true;
         }
         zip_DUMPBITS(1);

         // read in block type
         zip_NEEDBITS(2);
         zip_method = zip_GETBITS(2);
         zip_DUMPBITS(2);
         zip_tl = null;
         zip_copy_leng = 0;
      }

      switch(zip_method) {
         case 0: // zip_STORED_BLOCK
            i = zip_inflate_stored(buff, off + n, size - n);
            break;

         case 1: // zip_STATIC_TREES
            if(zip_tl != null) {
               i = zip_inflate_codes(buff, off + n, size - n);
            }
            else {
               i = zip_inflate_fixed(buff, off + n, size - n);
            }
            break;

         case 2: // zip_DYN_TREES
            if(zip_tl != null) {
               i = zip_inflate_codes(buff, off + n, size - n);
            }
            else {
               i = zip_inflate_dynamic(buff, off + n, size - n);
            }
            break;

         default: // error
            i = -1;
            break;
      }

      if(i == -1) {
         if(zip_eof) {
            return 0;
         }
         return -1;
      }
      n += i;
   }
   return n;
};

var zip_inflate = function(str) {
   var i, j;

   zip_inflate_start();
   zip_inflate_data = str;
   zip_inflate_pos = 0;

   var buff = new Array(1024);
   var aout = [];
   while((i = zip_inflate_internal(buff, 0, buff.length)) > 0) {
      var cbuf = new Array(i);
      for(j = 0; j < i; j++){
         cbuf[j] = String.fromCharCode(buff[j]);
      }
      aout[aout.length] = cbuf.join("");
   }
   zip_inflate_data = null; // G.C.
   return aout.join("");
};

ctx.Crypt=ctx.Crypt || {};
ctx.Crypt.unzip = zip_inflate;

})(PMC);
/*fin zip.js*/ 
//------------------------
//---COOKIE---------------
//------------------------
PMC.Cookie = PMC.Cookie || {};
Object.merge(PMC.Cookie,{
   set:function (name, value)
   {
      var argv=arguments;
      var argc=arguments.length;
      var expires=(argc > 2) ? argv[2] : null;
      if(expires) {
         var dd=new Date();
         dd.setSeconds(dd.getSeconds()+expires);
         expires=dd.toGMTString();
      }
      var path=(argc > 3) ? argv[3] : PMC.Config.root;
      var domain=(argc > 4) ? argv[4] : null;
      var secure=(argc > 5) ? argv[5] : false;
      var sCookie=name+"="+escape(value)+
            ((expires==null) ? "" : ("; expires="+expires))+
            ((path==null) ? "" : ("; path="+path))+
            ((domain==null) ? "" : ("; domain="+domain))+
            ((secure==true) ? "; secure" : "");
      document.cookie=sCookie;
      return;
   },
   getVal:function (offset)
   {
      var endstr=document.cookie.indexOf (";", offset);
      if (endstr==-1) {
         endstr=document.cookie.length;
      }
      return unescape(document.cookie.substring(offset, endstr));
   },
   get:function (name)
   {
      var arg=name+"=";
      var alen=arg.length;
      var clen=document.cookie.length;
      var i=0;
      while (i<clen) {
         var j=i+alen;
         if (document.cookie.substring(i, j)==arg) {
            return PMC.Cookie.getVal(j);
         }
         i=document.cookie.indexOf(" ",i)+1;
         if (i==0) {
            break;
         }
      }
      return null;
   }
});/*fin cookie.js*/ 
//------------------------
//---COLLECTION-----------
//------------------------
//Liste d'instances
PMC.Collection = function()
{
   this.nb=0;
};
Object.merge(PMC.Collection.prototype, {
   forEach:function(callback) {
      if(!callback) {
         throw new Exception("Erreur dans PMC.Collection.forEach, callback not defined !");
      }
      for(var i=0;i<this.nb;i++) {
         callback(this[i]);
      }
   },
   //Ajout d'un élément
   add:function(elem)
   {
      this[this.nb]=elem;
      this.nb++;
      return;
   },
   //Suppression d'un élément
   remove:function(elem)
   {
      var bFound=false, j=0;
      for(var i = 0; i < this.nb; i++)  {
         if(this[i]==elem) {
            bFound = true;
            j=i;
            i++;
         }
         if(bFound && i<this.nb) {
            this[j]=this[i];
            j++;
         }
      }
      if(bFound) {
         this.nb--;
         delete this[this.nb];
      }
      return;
   }
});/*fin collection.js*/ 
//------------------------
//---PLATFORM-------------
//------------------------
PMC.utils.Platform = PMC.utils.Platform || {};
Object.merge(PMC.utils.Platform,{
   is_win      :(  (PMC.utils.navigator.agt.indexOf("win")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("16bit")!=-1)
                ),
   is_mac      :(PMC.utils.navigator.agt.indexOf("mac")!=-1),
   is_sun      :(PMC.utils.navigator.agt.indexOf("sunos")!=-1),
   is_irix     :(PMC.utils.navigator.agt.indexOf("irix") !=-1),
   is_hpux     :(PMC.utils.navigator.agt.indexOf("hp-ux")!=-1),
   is_aix      :(PMC.utils.navigator.agt.indexOf("aix") !=-1),
   is_linux    :(PMC.utils.navigator.agt.indexOf("inux")!=-1),
   is_sco      :( (PMC.utils.navigator.agt.indexOf("sco")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("unix_sv")!=-1)
                ),
   is_unixware :(PMC.utils.navigator.agt.indexOf("unix_system_v")!=-1),
   is_mpras    :(PMC.utils.navigator.agt.indexOf("ncr")!=-1),
   is_reliant  :(PMC.utils.navigator.agt.indexOf("reliantunix")!=-1),
   is_dec      :( (PMC.utils.navigator.agt.indexOf("dec")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("osf1")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("dec_alpha")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("alphaserver")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("ultrix")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("alphastation")!=-1)
               ),
   is_sinix    :(PMC.utils.navigator.agt.indexOf("sinix")!=-1),
   is_freebsd  :(PMC.utils.navigator.agt.indexOf("freebsd")!=-1),
   is_bsd      :(PMC.utils.navigator.agt.indexOf("bsd")!=-1)
});

PMC.utils.Platform.is_unix=(
   (PMC.utils.navigator.agt.indexOf("x11")!=-1) ||
   (PMC.utils.Platform.is_sun) ||
   (PMC.utils.Platform.is_irix) ||
   (PMC.utils.Platform.is_hpux) ||
   (PMC.utils.Platform.is_sco) ||
   (PMC.utils.Platform.is_unixware) ||
   (PMC.utils.Platform.is_mpras) ||
   (PMC.utils.Platform.is_reliant) ||
   (PMC.utils.Platform.is_dec) ||
   (PMC.utils.Platform.is_sinix) ||
   (PMC.utils.Platform.is_aix) ||
   (PMC.utils.Platform.is_linux) ||
   (PMC.utils.Platform.is_bsd) ||
   (PMC.utils.Platform.is_freebsd)
);/*fin platform.js*/ 
//------------------------
//---CACHE----------------
//------------------------
(function () {
PMC.Cache = function () {
   this.nb=0;
};
var Cache=function(cd, val) {
   return {"cd":cd, "val":val};
};
Object.merge(Cache.prototype, {
   toString:function () {
      return "CD="+this.cd+"\tVal="+this.val.toString();
   },
   toUrl:function () {
      return "CD="+this.cd.encode64(true)+"\tVal="+this.val.toString().encode64(true);
   }
});

PMC.Cache.prototype = {
   toString:function () {
      var ret="";
      for(var i=0; i<this.nb; i++) {
         ret+=this[i].toString()+"\n";
      }
      return ret;
   },
   add:function (sDeb, aCache, sAdd) {
      if(sAdd==null) {
         sAdd=true;
      }
      for(var i=0;i<this.nb; i++) {
         if(this[i].cd==sDeb) {
            if(aCache.isArray && sAdd) {
               for(var j=0;j<aCache.length;j++) {
                  this[i].val.push(aCache[j]);
               }
            }
            else {
               this[i].val.push(aCache);
            }
            return;
         }
      }
      if(!(aCache.isArray && sAdd)) {
         aCache=new Array(aCache);
      }
      this[this.nb]=new Cache(sDeb, aCache);
      this.nb++;
      return;
   },
   toUrl:function () {
      var ret=[];
      for(var i=0; i<this.nb; i++) {
         ret.push("cd["+i+"]="+this[i].cd.encode64());
         if(typeof this[i].val=="string") {
            ret.push("val["+i+"]="+this[i].val.encode64());
         }
         else {
            ret.push("val["+i+"]="+this[i].val.encode64().join("$"));
         }
      }
      return ret.join("&");
   },
   get:function ()  {
      var sDeb=(arguments.length>0) ? arguments[0] : "";
      var bGetFirst=(arguments.length>1) ? arguments[1] : true;
      if(sDeb!="") {
         for(var i=0;i<this.nb;i++) {
            if(this[i].cd==sDeb) {
               return this[i].val;
            }
            //return this[i].val.length==1 && bGetFirst ? this[i].val[0] : this[i].val;
            //return this[i].val;
         }
         return null;
      }
      else {
         return this;
      }
   },
   getId:function (sDeb) {
      if(sDeb==null) {
         return 0;
      }
      else {
         for(var i=0;i<this.nb;i++)  {
            if(this[i].cd==sDeb) {
               return i;
            }
         }
      }
      return 0;
   },
   replaceAll:function (sDeb, aCache) {
      for(var i=0;i<this.nb; i++) {
         if(this[i].cd==sDeb) {
            if(aCache.isArray) {
               this[i].val=aCache;
            }
            else {
               this[i].val=new Array(aCache);
            }
            return;
         }
      }
      this.add(sDeb, aCache);
      return;
   },
   del:function () {
      var sDeb=(arguments.length>0) ? arguments[0] : "";
      if(sDeb!="") {
         for(var i=0;i<this.nb;i++) {
            if(this[i].cd==sDeb) {
               for(var j=i+1; j<this.nb; j++) {
                  this[j-1]=this[j];
               }
               this[this.nb-1]=null;
               this.nb--;
               return true;
            }
         }
      }
      else {
         for(var i=this.nb-1;i>=0;i--) {
            this[i]=null;
         }
         this.nb=0;
      }
      return true;
   },
   next:function (sDeb, bBoucle) {
      if(bBoucle==null) {
         bBoucle=false;
      }
      var i=this.getId(sDeb);
      if(i>=this.nb-1 && bBoucle) {
         return 0;
      }
      else if(i>=this.nb) {
            return -1;
      }
      else {
         PMC.utils.debug('Bouclage');
         return i+1;
      }
   },
   prev:function (sDeb, bBoucle) {
      if(bBoucle==null) {
         bBoucle=false;
      }
      var i=this.getId(sDeb);
      if(i<=0 && bBoucle) {
         return this.nb-1;
      }
      else if(i<=0) {
         return -1;
      }
      else {
         return i-1;
      }
   }
};
})();
/*
//------------------------
//---ELEM IN CACHE--------
//------------------------
Object.extend(PMC,{elemInCache:function ()
{
   this.nb=0;
   this.add=addElemInCache;
   this.get=getElemInCache;
   this.del=delElemInCache;
   this.toString=function ()
     {
       var ret="";
       for(var i=0; i<this.nb; i++)
         ret+=this[i].toString()+"\n";
       return ret;
     };
   function addElemInCache(sElem) {
     var oElem={};
     oElem.field=sElem;
     oElem.cache=new setCache();
     oElem.toString=function ()
       {
       var ret="Field : "+oElem.field;
       ret+="\tCache : "+oElem.cache.toString();
       return ret;
       };
     this[this.nb]=oElem;
     this.nb++;
   }

   function getElemInCache() {
     var sField=(arguments.length>0) ? arguments[0] : "";
     if(sField!="")
     {
       for(var i=0;i<this.nb;i++)
       {
         if(this[i].field==sField)
            return this[i];
       }
       return this;
     }
     else
       return this;
   }

   function delElemInCache() {
     var sField=(arguments.length>0) ? arguments[0] : "";
     if(sField!="")
     {
      for(var i=0;i<this.nb;i++)
      {
         if(this[i].field==sField)
           this[i]=null;
      }
     }
     else
     {
       for(var i=0;i<this.nb;i++)
         this[i]=null;
       this.nb=0;
     }
     return true;
   }
}});*//*fin cache.js*/ 
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
})();/*fin key.js*/ 
//----------------------------
//---Gestion des événements---
//----------------------------
(function () {
var saveFct=null;
var specialKey={
         KEY_BACKSPACE: 8,
         KEY_TAB:      9,
         KEY_RETURN:   13,
         KEY_ESC:     27,
         KEY_LEFT:    37,
         KEY_UP:      38,
         KEY_RIGHT:   39,
         KEY_DOWN:    40,
         KEY_DELETE:   46};
PMC.Event = PMC.Event || {};
Object.merge(PMC.Event,{
   element: function (e) {
      var targ;
      if (!e) {e=window.event;}
      if (e.target) {targ = e.target;}
      else if (e.srcElement) {targ = e.srcElement};
      if (targ.nodeType == 3) {targ = targ.parentNode};// defeat Safari bug
      return targ;
//     return event.target || event.srcElement;
   },
   isLeftClick: function (e) {
      if(!e) {e=window.event;}
      return ((e.which) && (e.which == 1)) ||
            ((e.button) && (e.button == 1));
   },
   isRightClick: function (e) {
      var rightclick;
      if (!e) {e=window.event;}
      if (e.which) rightclick = (e.which == 3);
      else if (e.button) rightclick = (e.button == 2);
      return rightclick;
      //return (!PMC.utils.navigator.ie && event.which == 3) || (PMC.utils.navigator.ie && event.button==2);
   },
   pointerX: function (e) {
      if(!e) {e=window.event;}
      return e.pageX || (e.clientX + PMC.Screen.scrollX);
   },
   pointerY: function (e) {
      if (!e) {e=window.event;}
      return e.pageY || (e.clientY + PMC.Screen.scrollY);
   },
   // find the first node with the given tagName, starting from the
   // node the event was triggered on; traverses the DOM upwards
   findElement: function (e, tagName) {
      if (!e) {e=window.event;}
      var element = self.element(e);
      while (element.parentNode && (!element.tagName ||
         (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
      return element;
   },
   returnFalse:function (eventObject) {
      if(!eventObject) {eventObject=window.event;}
      if (eventObject.preventDefault) {
         eventObject.preventDefault();
      }
      else if (eventObject.returnValue) {
         eventObject.returnValue = false;
      }
      return true;
   },
   add: (function () {
      if(window.addEventListener) {
         //return function(oElem, sEvType, fn, bCapture) {oElem.addEventListener(sEvType, function (event){return fn.call(oElem, event, bCapture);}, false);};
         return function(oElem, sEvType, fn, bCapture) {return oElem.addEventListener(sEvType, fn, false);};
      }
      else if(window.attachEvent) {
         //return function(oElem, sEvType, fn, bCapture) {oElem.attachEvent("on"+sEvType, function (e){if (!e) e = window.event;return fn.call(oElem, e, bCapture);});};
         return function(oElem, sEvType, fn, bCapture) {return oElem.attachEvent("on"+sEvType, fn);};
      }
      else {
         return function(oElem, sEvType, fn, bCapture) {oElem['on' + sEvType] = function (e){if (!e) e = window.event;return fn.call(oElem, e, bCapture);};};
      }
      //return (oElem.addEventListener) ?
      //      oElem.addEventListener(sEvType, fn, bCapture) :
      //      (oElem.attachEvent) ?
      //         oElem.attachEvent('on' + sEvType, fn) :
      //         oElem['on' + sEvType] = fn;
   })(),
   remove: (function () {
      if (window.removeEventListener) {
         //return function (oElem, sEvType, fn, bCapture) {oElem.removeEventListener(sEvType, function(event){return fn.call(oElem, event, bCapture);}, bCapture);};
         return function (oElem, sEvType, fn, bCapture) {oElem.removeEventListener(sEvType, fn, bCapture);};
      }
      else if (window.detachEvent) {
         //return function (oElem, sEvType, fn, bCapture) {oElem.detachEvent('on'+sEvType, function (e){if (!e) e = window.event;return fn.call(oElem, e, bCapture);});};
         return function (oElem, sEvType, fn, bCapture) {oElem.detachEvent('on'+sEvType, fn);};
      }
      else {
         return function (oElem, sEvType, fn, bCapture) {oElem['on'+sEvType] = null;return fn.call(oElem, e, bCapture);}; //function (e){if (!e) e = window.event;return fn.call(oElem, e, bCapture);};
      }
   })(),
   replace:function (elem) {
      if(elem.onclick!=null) {
         saveFct=elem.onclick;
         elem.onclick=null;
      }
      else {
         elem.onclick=saveFct;
      }
      return;
   },
   annuleContext:function(gid) {
      self.add(PMC.utils.$(gid), "contextmenu", self.returnFalse, false);
      self.add(PMC.utils.$(gid), "selectstart", self.returnFalse, false);
   },
   isTarget:function(e) {
      e = e || window.event;
      var oDiv=PMC.Event.element(e);
      PMC.Event.returnFalse(e);
      var relatedTarget = e.relatedTarget || e.ToElement;
      while (relatedTarget != oDiv && relatedTarget.nodeName.toLowerCase() != "body" && relatedTarget != window.document) {
         relatedTarget = relatedTarget.parentNode;
      }
      return relatedTarget==oDiv;
   }
});
var self=PMC.Event;
})();/*fin event.js*/ 
//------------------------
//---AJAX/XHR-------------
//------------------------
//Librairies de fonctions pour XMLHttpRequest
(function () {
PMC.xhr = PMC.xhr || {};
var self=PMC.xhr;

var XHR=function() {
   var oXhr=null;
   var method="POST";
   var sync=false;
   var headers=[];
   var allFuncs=[];
   var allParams=[];
   var isFirstTime=true;
   var isUpload=false;
   var url;
   var createXHR = (function () {
      var IE_XHR_Version = ['MSXML2.XMLHTTP.6.0',
                       'MSXML2.XMLHTTP.5.0',
                       'MSXML2.XMLHTTP.4.0',
                       'MSXML2.XMLHTTP.3.0',
                       'MSXML2.XMLHTTP',
                       'Microsoft.XMLHTTP'];
      var oXhr=null;
      var iIndex=0;
      if(window.XMLHttpRequest) {
         return function (){return new XMLHttpRequest();};
      }
      while (oXhr==null && iIndex<IE_XHR_Version.length) {
         try {
            oXhr=new ActiveXObject(IE_XHR_Version[iIndex]);
            return function (){return new ActiveXObject(IE_XHR_Version[iIndex]);};
         }
         catch (e) {
            oXhr=null;
         }
         iIndex++;
      }
      return function (){return null;};
   })();

   var setXHR = function () {
      oXhr=createXHR();
      //XMLHttpRequest non supporté par le navigateur. On ne l'affiche qu'une fois
      if (oXhr==null) {
         if(isFirstTime) {
            alert("Votre navigateur ne supporte pas les objets XMLHttpRequest...");
            isFirstTime=false;
         }
      }
      return oXhr;
   };

   var isXML=function() {
      var cType=oXhr.getResponseHeader("Content-Type");
      return  (cType!=null) &&
            (cType.toLowerCase().before(";")=="text/xml");
   };
   var isJSON=function() {
      var cType=oXhr.getResponseHeader("Content-Type");
      return  (cType!=null) &&
            (cType.toLowerCase().before(";").after("/")=="json");
   };
   var callback=function() {
      var ret;
      if(isXML()) {
         ret=oXhr.responseXML;
         //Gestion des erreurs
         var error=ret.getElementsByTagName("error");
         if(error.length>0) {
            ret="";
            PMC.utils.forEach(error, function(elem){
               if(PMC.Page.redirect(PMC.Config.fmwk+"error/disconnected.html", PMC.utils.getVal(elem)=="disconnected")) {
                  return null;
               }
               if(PMC.Page.redirect(PMC.Config.fmwk+"error/nodroit/"+PMC.utils.getVal(elem).after("?")+'.html', PMC.utils.getVal(elem).before("?")=="nodroit")) {
                  return null;
               }
               if(elem.getAttribute('id')=="404") {
                  ret="La page \""+PMC.utils.getVal(elem)+"\" n'existe pas.";
               }
               else {
                  if(elem.getAttribute('id')!=null) {
                     ret="Code erreur : "+elem.getAttribute('id')+PMC.utils.chr(10);
                  }
                  ret+=PMC.utils.getVal(elem);
               }
            });
            alert(ret);
            oXhr=null;
         }
      }
      else if(isJSON()) {
         ret=JSON.parse(oXhr.responseText);
         if(ret.error) {
           alert(ret.error);
           oXhr=null;
           return;
         }
      }
      else {
         ret=oXhr.responseText;
         //Gestion des erreurs
         if(ret=="disconnected") {
            oXhr=null;
            PMC.Page.redirect(PMC.Config.disconnected, true);
            return null;
         }
         if(ret.before("?")=="nodroit") {
            oXhr=null;
            PMC.Page.redirect(PMC.Config.fmwk+PMC.Config.nodroit+ret.after("?")+'.html', true);
            return null;
         }
      }
      oXhr=null;
      return ret;
   };
   this.setUpload=function(myUpload) {
      isUpload=myUpload;
   };
   this.setUrl=function(myUrl) {
      var r=/^https?:\/\//;
      if(myUrl.substring(0, PMC.Config.fmwk.length)!=PMC.Config.fmwk && !r.test(myUrl)) {
         url=PMC.Config.fmwk+myUrl;
      }
      else {
         url=myUrl;
      }
      return this;
   };
   this.setMethod=function(myMethod) {
      method=((myMethod==1) || (myMethod.toUpperCase()=="POST")) ? "POST" : "GET";
      return this;
   };
   this.getMethod=function() {
      return method;
   };
   this.addHeaders=function(myHeaders) {
      var t=this;
      if(myHeaders.isArray) {
         PMC.utils.forEach(myHeaders, (function(elem) {t.addHeaders(elem)}).apply(t));
      }
      else {
         for(var i in myHeaders) {
            myHeaders.search=i.camelize();
         }
         headers.push(myHeaders);
      }
      return this;
   };
   this.getAllHeaders=function() {
      return headers;
   };
   this.getHeader=function(index) {
      var ret=PMC.utils.filter(function(elem, index) {return elem.search==index}, headers, index.camelize());
      return ret.length==0 ? null : ret;
   };
   this.addFunction=function(func) {
      allFuncs=func;
      return this;
   };
   this.getFuncs=function() {
      return allFuncs;
   };
   this.addParam=function(param) {
      allParams=param;
      return this;
   };
   this.setSynchrone=function() {
      sync=true;
      return this;
   };
   this.setAsynchrone=function() {
      sync=false;
      return this;
   };
   this.download=function(parameters) {
      if(parameters) {
         parameters=parameters.isArray ? parameters.join("&") : parameters;
      }
      if(allFuncs.init) {
         allFuncs.init();
      }
      setXHR();
      oXhr.open(method, url, !sync);
      if(this.getHeader("X-Requested-With")==null) {
         oXhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      }
      if(!isUpload && this.getHeader("Content-Type")==null) {
         oXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      PMC.utils.forEach(headers, function(elem) {
         for(var i in elem) {
            if(i!="search") {
               oXhr.setRequestHeader(i, elem[i]);
            }
         }
      });
      if(sync) {
         oXhr.send(parameters);
         var ret=callback();
         if(allFuncs.complete) {
            return allFuncs.complete(ret);
         }
         else {
            return ret;
         }
      }
      else {
         oXhr.onreadystatechange = function () {
            if(oXhr!=null && oXhr.readyState == 4) {
               if(oXhr.status==404) {
                  return "La page <u>"+url+"</u> n'existe pas.";
               }
               var ret=callback();
               if(allFuncs.complete) {
                  allFuncs.complete(ret);
               }
               return ret;
            }
            return;
         };
         oXhr.onerror = function() {
            var ret=callback();
            if(allFuncs.error) {
               allFuncs.error(ret);
            }
         };
         if(allFuncs.start) {
            oXhr.onloadstart=function(e) {allFuncs.start(e);};
         }
         if(allFuncs.uploadStart) {
            oXhr.upload.onloadstart = function(e) {
               allFuncs.uploadStart(e);
            };
         };
         if(allFuncs.uploadProgress) {
            oXhr.upload.onprogress = function(e) {
               allFuncs.uploadProgress(e);
            };
         };
         oXhr.send(parameters);
      }
   };
};
var download=function(method, url, fct, paramSend, paramRequest) {
   var xhr=new XHR();
   xhr.setUrl(url).setMethod(method);
   if(fct) {
      xhr.addFunction(fct.complete ? fct : {"complete":fct});
   }
   if(paramRequest) {
      PMC.utils.forEach(paramRequest, function(elem) {
         if(elem.header) {
            xhr.addHeaders(elem.header);
         }
         else if(elem.sync) {
            xhr.setSynchrone(elem.sync);
         }
         else if(elem.async) {
            xhr.setAsynchrone(elem.async);
         }
         else if(elem.isUpload) {
            xhr.setUpload(elem.isUpload);
         }
      });
   }
   return xhr.download(paramSend);
};

//Méthode GET
self.get = function(url, fct, paramSend, paramRequest) {
   if(paramSend) {
      paramSend=paramSend.isArray ? paramSend.join("&") : paramSend;
      url=url+(url.contains("?") ? "&" : "?")+paramSend;
   }
   return download("GET", url, fct, null, paramRequest);
};
//Méthode POST
self.post = function(url, fct, paramSend, paramRequest) {return download("POST", url, fct, paramSend, paramRequest);};
})();
/*fin xhr.js*/ 
//------------------------
//---SCREEN---------------
//------------------------
(function (){
PMC.Screen = PMC.Screen || {};
var self = PMC.Screen;
Object.merge(self,{
   scrollX:0,
   scrollY:0,
   windowX:0,
   windowY:0,
   isMobile:function() {
      return self.windowX<=500 || self.windowY<200;
   }
});
self.scroll=function () {
      self.scrollX=(function() {
         if(window.pageXOffset) {
            return window.pageXOffset;
         }
         if(window.document.documentElement && window.document.documentElement.scrollLeft) {
            return window.document.documentElement.scrollLeft;
         }
         if(window.documentElement && window.documentElement.scrollLeft) {
            return window.documentElement.scrollLeft;
         }
         if(document.body && document.body.scrollLeft) {
            return document.body.scrollLeft;
         }
         return 0;
      })();
      self.scrollY=(function() {
         if(window.pageYOffset) {
            return window.pageYOffset;
         }
         if(window.document.documentElement && window.document.documentElement.scrollTop) {
            return window.document.documentElement.scrollTop;
         }
         if(document.body && document.body.scrollTop) {
            return document.body.scrollTop;
         }
         return 0;
      })();
      self.windowX=(function() {
         if(window.innerWidth) {
            return window.innerWidth;
         }
         if(window.document.documentElement && window.document.documentElement.clientWidth) {
            return window.document.documentElement.clientWidth;
         }
         if(document.body && document.body.clientWidth) {
            return document.body.clientWidth;
         }
         return 0;
      })();
      self.windowY=(function() {
         if(window.innerHeight) {
            return window.innerHeight;
         }
         if(window.document.documentElement && window.document.documentElement.clientHeight) {
            return window.document.documentElement.clientHeight;
         }
         if(document.body && document.body.clientHeight) {
            return document.body.clientHeight;
         }
         return 0;
      })();
/*
      self.scrollX=window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body && document.body.scrollLeft;
      self.scrollY=window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop;
      self.windowX=window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
      self.windowY=window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
*/
      return;
   }
})();/*fin screen.js*/ 
//------------------------
//---MOUSE----------------
//------------------------
(function() {
PMC.Mouse = PMC.Mouse || {};
Object.merge(PMC.Mouse,{
   posX:0,
   posY:0,
   move:function (evt) {
      var DocRef;
      var Mouse_X;
      var Mouse_Y;
      var e=evt || window.event;
      if(e.pageX) {
         Mouse_X = e.pageX;
         Mouse_Y = e.pageY;
      }
      else {
         DocRef = (document.documentElement && document.documentElement.clientWidth) ? document.documentElement : document.body;
         Mouse_X = e.clientX+DocRef.scrollLeft;
         Mouse_Y = e.clientY+DocRef.scrollTop;
      }
      PMC.Mouse.posX=Mouse_X;
      PMC.Mouse.posY=Mouse_Y;
      return [Mouse_X, Mouse_Y];
   }
});

})();/*fin mouse.js*/ 
//------------------------
//---LOADING--------------
//------------------------
PMC.utils.loading = function () {
   this.nb=0;
   this.fct=null;
   this.arg=[];
};

PMC.utils.loading.prototype = {
   addArgs:function() {
      var args=[];
      PMC.utils.forEach(arguments, function(elem) {args.push(elem);});
      return args;
   },
   toString:function () {
      var ret="";
      for(var i=0; i<this.nb; i++) {
         ret+="FCT : "+this[i].fct+" -  ARG : "+this[i].arg.toString()+"\n"
      }
      return ret;
   },
   add:function (fct_name) {
      if (fct_name!=null) {
         var args=[];
         PMC.utils.forEach(arguments, function(elem) {args.push(elem);});
         /*
         for(var i=1; i<arguments.length; i++) {
            args.push(arguments[i]);
         }
         */
         this[this.nb]={fct:fct_name, arg:args};
         this.nb++;
      }
   },
   remove:function (fct) {
      var j=0;
      if(fct!=null) {
         for(var i=0; i < this.nb; i++) {
            if(this[i].fct==fct) {
               j++;
            }
            if(j>0) {
               this[i]=this[i+1];
            }
         }
      }
      if(j>0) {
         this.nb--;
         delete this[this.nb];
         if(j>1) {
            this.remove(fct);
         }
      }
   },
   exec:function exec() {
      for(var i=0; i < this.nb; i++) {
         if(typeof this[i].fct=="string") {
            eval(this[i].fct);
         }
         else {
            var args=[];
            for(var j=0;j<arguments.length;j++) {
               args.push(arguments[j]);
            }
            this[i].fct.apply(this[i].fct, args.concat(this[i].arg));
         }
      }
   }
};/*fin loading.js*/ 
//------------------------
//---DOM------------------
//------------------------
(function(){
PMC.DOM = PMC.DOM || {};

var funconload=function () {
   var fns = [];
   var isReady = false;
   var errorHandler = null;
   var getFunc = function (fn) {
      if(fn!=null)
      {
         if ( fn.constructor == String ) {
            return function () { eval( fn ); };
         }
      }
      return fn;
   },
   ready = function () {
      isReady = true;
      PMC.DOM.loaded=true;
      // call all registered functions
      for ( var x = 0; x < fns.length; x++ ) {
         try {
            // call function
            fns[x]();
         } catch( err ) {
            // error occured while executing function
            if ( typeof errorHandler == 'function' ) {
               errorHandler( err );
            }
         }
      }
   };
   // Setting error handler
   // @param fn [function | string]
   // @return [DOMReady] for chaining
   this.setOnError = function ( fn ) {
      errorHandler = getFunc( fn );
      // return this for chaining
      return this;
   };

   // Add code or function to execute when the DOM is ready
   // @param fn [function | string]
   // @return [DOMReady] for chaining
   this.add = function ( fn ) {
      fn = getFunc( fn );
      // call imediately when DOM is already ready
      if ( isReady ) {
         fn();
       }
       else {
         // add to the list
         fns[fns.length] = fn;
      }
      // return this for chaining
      return this;
   };

   // For all browsers except IE
   if ( window.addEventListener ) {
      document.addEventListener( 'DOMContentLoaded', function (){ ready(); }, false );
   }
   else {
      // For IE
      // Code taken from http://ajaxian.com/archives/iecontentloaded-yet-another-domcontentloaded
      (function () {
         // check IE's proprietary DOM members
         if ( ! document.uniqueID && document.expando ) {return;}
         // you can create any tagName, even customTag like <document :ready />
         var tempNode = document.createElement('document:ready');
         try {
            // see if it throws errors until after ondocumentready
            tempNode.doScroll('left');
            // call ready
            ready();
         }
         catch ( err ) {
            setTimeout(arguments.callee, 0);
         }
      })();
   }
   return this;
};

function setNodeAttribute(noeud, attribut, valeur) {
  if (attribut == "class")
   noeud.className = valeur;
  else if (attribut == "checked")
   noeud.defaultChecked = valeur;
  else if (attribut == "for")
   noeud.htmlFor = valeur;
  else if (attribut == "style")
   noeud.style.cssText = valeur;
  else
   noeud.setAttribute(attribut, valeur);
}

Object.extend(PMC.DOM,{
   loaded:false,
   getChild:function (gid, balise) {
      if(gid.getElementsByTagName(balise).length>0) {
         return gid.getElementsByTagName(balise)[0];
      }
      else {
         return null;
      }
   },
   createField:function () {
      var elem={};
      elem.type="input";
      elem.frm=(document.forms.length>0) ? document.forms[0] : document.body;

      if(arguments.length>0) {
         elem=arguments[0];
      }
      var detail=arguments.length>1 ? arguments[1] : {};
      var _input=document.createElement(elem.type);
      Object.extend(_input, detail);
      elem.frm.appendChild(_input);
      return;
   },
   remove: function () {
      for (var i = 0; i < arguments.length; i++) {
         var element = PMC.utils.$(arguments[i]);
         if(element!=null) {
            element.parentNode.removeChild(element);
         }
      }
      return true;
   },
   removeChildren:function (gid, balise) {
      if(gid.childNodes!=null) {
         for(var i=gid.childNodes.length-1;i>=0;i--) {
            if(balise && (gid.childNodes[i].nodeName.toLowerCase()==balise.toLowerCase())) {
               gid.removeChild(gid.childNodes[i]);
            }
            else if(!balise) {
               gid.removeChild(gid.childNodes[i]);
            }
         }
      }
      return;
   },
   dom:function (nom, attributs) {
      var noeud = document.createElement(nom);
      if (attributs) {
         PMC.utils.forEachIn(attributs, function(nom, valeur) {
            setNodeAttribute(noeud, nom, valeur);
         });
      }
      for (var i = 2; i < arguments.length; i++) {
         var noeudEnfant = arguments[i];
         if (typeof noeudEnfant == "string") {
            noeudEnfant = document.createTextNode(noeudEnfant);
         }
         noeud.appendChild(noeudEnfant);
      }
      return noeud;
   },
   create:function (gid, balise, aAttributes, iWhere) {
      iWhere=arguments.length>3 ? arguments[3] : 1;
      if(balise==null) {
         balise="div";
      }
      if(gid==document) {
         gid=gid.body;
      }
      //sWhere=1 si à la fin, 0 si au début
      var p=document.createElement(balise);
      PMC.utils.forEachIn(aAttributes, function(nom, valeur) {
            if(nom.toLowerCase()!='html' && nom.toLowerCase()!='innerhtml') {
              setNodeAttribute(p, nom, valeur);
            }
      });
      for(var i in aAttributes) {
         if(i.toLowerCase()=='html' || i.toLowerCase()=='innerhtml') {
            p.innerHTML=aAttributes[i];
         }
       }
         /*
      for(var i in aAttributes) {
         i=i.toLowerCase();
         if(i=='style' && PMC.utils.navigator.ie) {
            p.style.setAttribute("cssText", aAttributes[i]);
         }
         else if(i=="class" || i=="classname") {
            p.className=aAttributes[i];
         }
         else if(i=='html') {
            p.innerHTML=aAttributes[i];
         }
         else if(aAttributes[i]) {
            p.setAttribute(i, aAttributes[i]);
         }
      }
      */
      if((gid.getElementsByTagName(balise).length==0) || (iWhere==1)) {
         gid.appendChild(p);
      }
      else {
         gid.insertBefore(p, self.getChild(gid, balise));
      }
      return p;
   },
   createChildren:function (gid, balise) {
      var sHtml=arguments.length>2 ? arguments[2] : "";
      var aAttributes=arguments.length>3 ? arguments[3] : Array();
      var sWhere=arguments.length>4 ? arguments[4] : 1;
      if(!aAttributes) {
         aAttributes=new Array();
      }
      if(sWhere==null) {
         sWhere=1;
      }
      if(balise==null) {
         balise="div";
      }
      //sWhere=1 si à la fin, 0 si au début
      var p=document.createElement(balise);
      PMC.utils.forEach(aAttributes, function(elem){
            if(elem[0]=="style" && PMC.utils.navigator.ie) {
               p.style.setAttribute("cssText", elem[1]);
            }
            else if(elem[0]=="class") {
               p.className=elem[1];
            }
            else {
               p.setAttribute(elem[0], elem[1]);
            }
         });
      /*
      for(var i=0;i<aAttributes.length;i++) {
         if(aAttributes[i][0]=="style" && PMC.utils.navigator.ie) {
            p.style.setAttribute("cssText", aAttributes[i][1]);
         }
         else if(aAttributes[i][0]=="class") {
            p.className=aAttributes[i][1];
         }
         else {
            p.setAttribute(aAttributes[i][0], aAttributes[i][1]);
         }
      }
      */
      if(sHtml) {
         p.innerHTML=sHtml;
      }
      if((gid.getElementsByTagName(balise).length==0) || (sWhere==1)) {
         if(gid==document) {
            gid=gid.body;
         }
         gid.appendChild(p);
      }
      else {
         gid.insertBefore(p, self.getChild(gid, balise));
      }
      return p;
   },
   getParent:function (elem, nodename) {
      if(!nodename) {
         nodename="div";
      }
      if(elem.nodeName.toLowerCase()=='html') {
         return nodename.toLowerCase() == 'html' ? elem : null;
      }
      else if(elem.nodeName.toLowerCase()==nodename.toLowerCase()) {
         return elem;
      }
      else {
         return self.getParent(elem.parentNode, nodename);
      }
   },
   swap:function(nodeA,nodeB) {
      const parentA = nodeA.parentNode;
      const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
      nodeB.parentNode.insertBefore(nodeA, nodeB);
      parentA.insertBefore(nodeB, siblingA);
   },
   onload:funconload()
});
var self=PMC.DOM;
})();/*fin dom.js*/ 
//------------------------
//---CONFIG---------------
//------------------------
PMC.Config = PMC.Config || {};
Object.extend(PMC.Config,{"byServer":false,
   root:"",
   js:"",
   img:"./_images/",
   java:"",
   faq:"",
   fmwk:"",
   css:"",
   lanceXHR:true,
   disconnected:"/error/disconnected.html",
   nodroit:"/error/nodroit/",
   today:new Date(),
   isUtf8:false
   });
Object.merge(PMC.Config,{"detectConsole":function ()
   {
      if(window.console && (window.console.firebug || window.console.exception))
         PMC.utils.debug('Il est bien connu que Firebug ralentit l\'ex&#233;cution de cette page. Il est conseill&#233; de le d&#233;sactiver.');
      return;
   }
});
/*fin config.js*/ 
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
})();/*fin nav.js*/ 
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
//Fin gestion des suppressions d'enregistrements/*fin page.js*/ 
//------------------------
//---ELEMENT--------------
//------------------------
(function () {
PMC.Element = PMC.Element || {};
var self=PMC.Element;
var $=PMC.utils.$;
var oFadeTime=Array();
Object.merge(PMC.Element,{
   visible: function (element) {
      var gid=$(element);
      if(gid) {
         return self.getStyle(gid, 'display') != 'none';
      }
      else {
         return false;
      }
   },
   toggle: function () {
      for (var i = 0; i < arguments.length; i++) {
         self[self.visible(arguments[i]) ? 'hide' : 'show'](arguments[i]);
      }
      return true;
   },
   hide: function () {
      for (var i = 0; i < arguments.length; i++) {
         self.setStyle($(arguments[i]), {display:'none'});
      }
      return true;
   },
   affDiv:function (sid) {
      var gid=$(sid);
      var aff="";
      if(gid!=null) {
         aff=(arguments.length>1) ? arguments[1] : self.visible(gid);
         self[aff ? "show" : "hide"](gid);
      }
      return true;
   },
   show: function () {
      PMC.utils.forEach(arguments, function(elem) {
         self.removeClass(elem, "displayNone");
         $(elem).style.display=null;
         //self.setStyle($(elem), {display:''});//block
      });
      return true;
   },
   showinline: function () {
      for (var i = 0; i < arguments.length; i++) {
         self.setStyle($(arguments[i]), {display:'inline'});
      }
      return true;
   },
   update: function (element, html) {
      $(element).innerHTML = html.stripScripts();
      return true;
   },
   getHeight: function (element) {
      return $(element).offsetHeight;
   },
   empty: function (element) {
      return $(element).innerHTML.match(/^\s*$/);
   },
   scrollTo: function (element) {
      element = $(element);
      var x = element.x ? element.x : element.offsetLeft,
         y = element.y ? element.y : element.offsetTop;
      window.scrollTo(x, y);
      return true;
   },
   getStyle: function (element, style) {
      element = $(element);
      var value = element.style[style.camelize()];
      if (!value) {
         if (document.defaultView && document.defaultView.getComputedStyle) {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css.getPropertyValue(style) : null;
         }
         else if (element.currentStyle) {
            value = element.currentStyle[style.camelize()];
         }
      }
      return (value=='auto') ? null:value;
   },
   setStyle: function (element, objStyle) {
      element = $(element);
      for (var sName in objStyle) {
         element.style[sName.camelize()] = objStyle[sName];
      }
      return false;
   },
   moveTo:function (element,x,y) {
      element = $(element);
/*
      if(self.getStyle(element, 'position') != "relative") {
         self.absolutize(element);
      }
*/
      self.setStyle(element, {top:y.toNumber()+"px",left:x.toNumber()+"px"});
      return false;
   },
   getDimensions: function (element) {
      element = $(element);
      if (self.getStyle(element, 'display') != 'none') {
         return {width: element.offsetWidth, height: element.offsetHeight};
      }
      // All *Width and *Height properties give 0 on elements with display none,
      // so enable the element temporarily
      var els = element.style;
      var originalVisibility = els.visibility;
      var originalPosition = els.position;
      els.visibility = 'hidden';
      els.position = 'absolute';
      els.display = '';
      var originalWidth = element.clientWidth;
      var originalHeight = element.clientHeight;
      els.display = 'none';
      els.position = originalPosition;
      els.visibility = originalVisibility;
      return {width: originalWidth, height: originalHeight};
   },
   makePositioned: function (element) {
      element = $(element);
      var pos = self.getStyle(element, 'position');
      if (pos == 'static' || !pos) {
         element._madePositioned = true;
         element.style.position = 'relative';
         // Opera returns the offset relative to the positioning context, when an
         // element is position relative but top and left have not been defined
         if (window.opera) {
            element.style.top = 0;
            element.style.left = 0;
         }
      }
      return true;
   },
   undoPositioned: function (element) {
      element = $(element);
      if (element._madePositioned) {
         element._madePositioned = undefined;
         element.style.position =
         element.style.top =
         element.style.left =
         element.style.bottom =
         element.style.right = '';
      }
      return true;
   },
   makeClipping: function (element) {
      element = $(element);
      if (element._overflow) {
         return false;
      }
      element._overflow = element.style.overflow;
      if ((self.getStyle(element, 'overflow') || 'visible') != 'hidden') {
         element.style.overflow = 'hidden';
      }
      return true;
   },
   undoClipping: function (element) {
      element = $(element);
      if (element._overflow) {
         return false;
      }
      element.style.overflow = element._overflow;
      element._overflow = undefined;
      return true;
   },
   getOpacity:function (oElem) {
      oElem=$(oElem);
      if(oElem.style.opacity) {
         return oElem.style.opacity*100;
      }
      if(oElem.style.MozOpacity) {
         return oElem.style.MozOpacity*100;
      }
      if(oElem.style.KhtmlOpacity) {
         return oElem.style.KhtmlOpacity*100;
      }
      if(oElem.style.filter) {
         return oElem.style.filter;
      }
      return null;
   },
   setOpacity:function (oElem, level) {
      oElem=$(oElem);
      level=parseFloat(level.toNumber()/100);
      oElem.style.opacity=level;
      oElem.style.MozOpacity=level;
      oElem.style.KhtmlOpacity=level;
      oElem.style.filter="alpha(opacity="+(level*100)+");";
      return true;
   },
   fade:function (sid, bFade, iStart, iEnd, iStep, iMs, fct, param) {
      bFade=(bFade==null) ? true : bFade;
      iStart=(iStart==null) ? ((bFade) ? 0 : 100) : iStart.toNumber();
      iEnd=(iEnd==null) ? ((bFade) ? 100 : 0) : iEnd.toNumber();
      iStep=(iStep==null) ? 15 : iStep.toNumber();
      iMs=(iMs==null) ? 50 : iMs.toNumber();
      var gid=$(sid);
      if(gid!=null) {
         if(bFade && iStart>=0) {
            self.show(gid);
         }
         if(!bFade && iStart<=0) {
            self.hide(gid);
         }
         self.setOpacity(gid, iStart);
         if(bFade && iStart<iEnd) {
            oFadeTime[gid]=setTimeout(function() {
                        PMC.Element.fade(gid, bFade, (iStart+iStep), iEnd, iStep, iMs, fct, param);
                     },iMs);
            //self.oFadeTime[gid.id]=setTimeout("PMC.Element.fade('"+gid.id+"', "+bFade+", "+(iStart+iStep)+", "+iEnd+", "+iStep+", "+iMs+", "+fct+", '"+param+"')",iMs);
         }
         else if(!bFade && iStart>iEnd) {
            oFadeTime[gid]=setTimeout(function() {
                        PMC.Element.fade(gid, bFade, (iStart-iStep), iEnd, iStep, iMs, fct, param);
                     },iMs);
            //self.oFadeTime[gid.id]=setTimeout("PMC.Element.fade('"+gid.id+"', "+bFade+", "+(iStart-iStep)+", "+iEnd+", "+iStep+", "+iMs+", "+fct+", '"+param+"')",iMs);
         }
         else if(fct!=null) {
            if(typeof(fct)=="function") {
               fct(param);
            }
            else {
               eval(fct+"(\""+param+"\")");
            }
         }
      }
      return true;
   },
   autocomplete:function (sid, bAutocomplete) {
      var gid=$(sid);
      if(bAutocomplete==null) {
         bAutocomplete=false;
      }
      if(gid!=null) {
         gid.setAttribute("autocomplete", bAutocomplete ? "on" : "off");
      }
      return true;
   },
   setDimension:function (oElem) {
      oElem=$(oElem);
      var posElem=self.cumulativeOffset(oElem);
      return {position  : [posElem[0].toNumber(), posElem[1].toNumber()],
            dimension : self.getDimensions(oElem)};
   },
   // set to true if needed, warning: firefox performance problems
   // NOT neeeded for page scrolling, only if draggable contained in
   // scrollable elements
   includeScrollOffsets: false,

   // must be called before calling withinIncludingScrolloffset, every time the
   // page is scrolled
   prepare: function () {
      this.deltaX =  PMC.Screen.scrollX || 0;
      this.deltaY =  PMC.Screen.scrollY || 0;
      return;
   },

   realOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.scrollTop  || 0;
         valueL += element.scrollLeft || 0;
         element = element.parentNode;
      } while (element);
      return [valueL, valueT];
   },

   cumulativeOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         element = element.offsetParent;
      } while (element);
      return [valueL, valueT];
   },

   positionedOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         element = element.offsetParent;
         if (element) {
            var p = self.getStyle(element, 'position');
            if (p == 'relative' || p == 'absolute') {
               break;
            }
         }
      } while (element);
      return [valueL, valueT];
   },

   offsetParent: function (element) {
      if (element.offsetParent) {
         return element.offsetParent;
      }
      if (element == document.body) {
         return element;
      }

      while ((element = element.parentNode) && element != document.body) {
         if (self.getStyle(element, 'position') != 'static') {
            return element;
         }
      }
      return document.body;
   },

   // caches x/y coordinate pair to use with overlap
   within: function (element, x, y) {
      if (self.includeScrollOffsets) {
         return this.withinIncludingScrolloffsets(element, x, y);
      }
      this.xcomp = x;
      this.ycomp = y;
      this.offset = this.cumulativeOffset(element);

      return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
   },

   withinIncludingScrolloffsets: function (element, x, y) {
      var offsetcache = this.realOffset(element);

      this.xcomp = x + offsetcache[0] - this.deltaX;
      this.ycomp = y + offsetcache[1] - this.deltaY;
      this.offset = this.cumulativeOffset(element);

      return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
   },

   // within must be called directly before
   overlap: function (mode, element) {
      if (!mode) {
         return 0;
      }
      if (mode == 'vertical') {
         return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
               element.offsetHeight;
      }
      if (mode == 'horizontal') {
         return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
            element.offsetWidth;
      }
      return null;
   },
   page: function (forElement) {
      var valueT = 0, valueL = 0;

      var element = forElement;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;

         // Safari fix
         if (element.offsetParent==document.body) {
            if (self.getStyle(element,'position')=='absolute') {
               break;
            }
         }
      } while ((element=element.offsetParent)!=null);

      element = forElement;
      do {
         valueT -= element.scrollTop  || 0;
         valueL -= element.scrollLeft || 0;
      } while ((element = element.parentNode)!=null);

      return [valueL, valueT];
   },

   clone: function (source, target) {
      var options = Object.extend({setLeft:   true,
                            setTop:    true,
                            setWidth:   true,
                            setHeight:  true,
                            offsetTop:  0,
                            offsetLeft: 0
                           }, arguments[2] || {});

      // find page position of source
      source = $(source);
      var p = self.page(source);

      // find coordinate system to use
      target = $(target);
      var delta = [0, 0];
      var parent = null;
      // delta [0,0] will do fine with position: fixed elements,
      // position:absolute needs offsetParent deltas
      if (self.getStyle(target,'position') == 'absolute') {
         parent = self.offsetParent(target);
         delta = self.page(parent);
      }

      // correct by body offsets (fixes Safari)
      if (parent == document.body) {
         delta[0] -= document.body.offsetLeft;
         delta[1] -= document.body.offsetTop;
      }

      // set position
      if(options.setLeft) {
         target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px'
      }
      if(options.setTop) {
         target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
      }
      if(options.setWidth) {
         target.style.width = source.offsetWidth + 'px';
      }
      if(options.setHeight) {
         target.style.height = source.offsetHeight + 'px';
      }
      return null;
   },

   absolutize: function (element) {
      element = $(element);
      if (element.style.position == 'absolute') {
         return;
      }
      self.prepare();

      var offsets = self.positionedOffset(element);
      var top    = offsets[1];
      var left   = offsets[0];
      var width   = element.clientWidth;
      var height  = element.clientHeight;

      element._originalLeft   = left - parseFloat(element.style.left  || 0);
      element._originalTop   = top  - parseFloat(element.style.top || 0);
      element._originalWidth  = element.style.width;
      element._originalHeight = element.style.height;

      element.style.position = 'absolute';
      element.style.top   = top + 'px';;
      element.style.left   = left + 'px';;
      element.style.width  = width + 'px';;
      element.style.height = height + 'px';;
      return;
   },

   relativize: function (element) {
      element = $(element);
      if(self.getStyle(element, 'position') == 'relative') {
         return;
      }
      self.prepare();
      var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
      var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);
      self.setStyle(element, {
                     position :'relative',
                     top      :top+'px',
                     left     :left+'px',
                     height   :element._originalHeight,
                     width    :element._originalWidth});
      return;
   },
   addClass:function(gid, css) {
      var oClass=PMC.utils.$(gid).className.split(" ");
      if(!oClass.inArray(css) && css!="" && css!=undefined) {
         oClass.push(css);
      }
      gid.className=oClass.join(" ");
      return;
   },
   isClass:function(gid, css) {
      return PMC.utils.$(gid).className.split(" ").inArray(css);
   },
   removeClass:function(gid, css) {
      gid=PMC.utils.$(gid);
      var oClass=gid.className.split(" ");
      oClass.removeValue(css);
      gid.className=oClass.join(" ");
      return;
   },
   toggleClass:function(gid, css1, css2) {
      gid=PMC.utils.$(gid);
      if(this.isClass(gid, css1)) {
         this.removeClass(gid, css1);
         this.addClass(gid, css2);
      }
      else {
         this.removeClass(gid, css2);
         this.addClass(gid, css1);
      }
   }
});
if(PMC.utils.navigator.is_konqueror || PMC.utils.navigator.is_safari || PMC.utils.navigator.is_khtml) {
   self.cumulativeOffset = function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         if (element.offsetParent == document.body) {
            if (self.getStyle(element, 'position') == 'absolute') {
               break;
            }
         }
         element = element.offsetParent;
      } while (element);
      return [valueL, valueT];
   }
}
})();/*fin element.js*/ 
//------------------------
//---DRAG & DROP----------
//------------------------
//------------------------
//---Objet Drag-----------
//------------------------
/*
 * argument:
 * {
 *   headerClass : class de l'élément "dt" qui recevra les évènements. Si non existant, c'est tout l'objet DOM qui recevra les évènements.
 *   onLoad     : fonction exécutée au chargement de l'objet Drag.
 *   onStop     : fonction exécutée lors du relachement de la souris si on est en-dehors des objets Drop (objets permettant de recevoir les objets Drag)
 *   listDrop   : contient la liste des objets Drop (contenant l'ensemble des conteneurs qui peuvent recevoir l'objet Drag)
 *   onDragOver  : fonction exécutée lorsque l'objet Drag passe sur un objet Drop
 *   onDragOut   : fonction exécutée lorsque l'objet Drag quitte un objet Drop
 *   onDrag     : fonction exécutée lorsque la souris est relachée sur un objet Drop
 * }
*/
//------------------------
(function() {
var initialize=function (oElem) {
   this.gid=PMC.utils.$(oElem);
   //Récupération de l'élément qui recevra les évènements
   if(this.gid.getElementsByTagName('dt').length>0 &&
         this.headerClass &&
         this.gid.getElementsByTagName('dt')[0].className==this.headerClass) {
      this.gidEvent=this.gid.getElementsByTagName('dt')[0];
   }
   //on met le curseur "move" sur l'élément qui recevra les évènements
   PMC.Element.setStyle(this.gidEvent, {cursor:"move"});
   //On rend l'élément "absolu"
   PMC.Element.relativize(this.gid);
   //On récupère sa position
   var oDim=PMC.Element.setDimension(this.gid);
   this.position=oDim.position;
   this.dimension=oDim.dimension;
   //var posElem=PMC.Element.positionedOffset(this.gid);
   //this.position=[posElem[0].toNumber(), posElem[1].toNumber()];
   this.position_save=this.position;

   //On applique les évènements "onLoad"
   if(this.onLoad!=null) {
      this.onLoad.apply(this);
   }
   //On lance les évènements
   PMC.Event.add(this.gidEvent, "mousedown", this.start.bind(this));
   PMC.Event.add(this.gidEvent, "mouseup", this.stop.bind(this));
   //PMC.Event.add(this.gidEvent, "click", this.stop.bind(this));
   PMC.onMove.add(this.mousemove.bind(this));
};
PMC.utils.Drag=function (oElem) {
   var args=arguments;
   this.gid=PMC.utils.$(oElem);
   this.isMoved=false;
   this.position=[0,0];
   this.position_save=this.position;
   this.dimension={width:0, height:0};
   this.delta=[0,0];
   this.gidEvent=this.gid;
   this.listDrop=null;
   this.dropObject=null;
   if(args.length>1) {
      for(var i in args[1]) {
         this[i]=args[1][i];
      }
   }
   if(PMC.DOM.loaded) {
      initialize.call(this, oElem);
   }
   else {
      PMC.onLoad.add(initialize.bind(this, oElem));
   }
};
Object.extend(PMC.utils.Drag.prototype,{
   toString:function () {
      return "sid="+this.gid.id+"\nisMoved="+this.isMoved+"\nposX="+this.position[0]+"\nposY="+this.position[0]+"\nwidth="+this.dimension.width+"\nheight="+this.dimension.height+"\ndX="+this.delta[0]+"\ndY="+this.delta[1]+"\n";
   },
   start:function () {
      this.isMoved=true;
      PMC.utils.disableSelection(this.gid);
      PMC.utils.disableSelection(document);
      //var posElem=PMC.Element.positionedOffset(this.gid);
      //this.position=[posElem[0].toNumber(), posElem[1].toNumber()];
      //this.dimension=PMC.Element.getDimensions(this.gid);
      var oDim=PMC.Element.setDimension(this.gid);
      this.position=oDim.position;
      this.dimension=oDim.dimension;
      this.position_save=this.position;
      this.delta=[PMC.Mouse.posX.toNumber()-this.position[0].toNumber()+5, PMC.Mouse.posY.toNumber()-this.position[1].toNumber()];
      if(this.onStart) {
         this.onStart.apply(this);
      }
      this.gid.className+=" dragged";
      PMC.Element.setStyle(this.gid, {zIndex:10});
   },
   annule:function () {
      PMC.Element.moveTo(this.gid, this.position_save[0], this.position_save[1]);
   },
   stop:function () {
      this.isMoved=false;
      this.gid.className=this.gid.className.replace(/dragged/gi,'');
      PMC.Element.setStyle(this.gid, {zIndex:1});
      if(this.dropObject!=null && this.onDrag) {
         //On retire la class "hover" de l'élément DROP
         this.dropObject.gid.className=this.dropObject.gid.className.replace(/ hover/gi, '');
         this.onDrag.call(this, this.dropObject);
      }
      else if(this.onStop) {
         this.onStop.apply(this);
      }
   },
   mousemove:function (evt) {
      if(this.isMoved) {
         PMC.Element.moveTo(this.gid, this.position[0], this.position[1]);
         this.position=[PMC.Mouse.posX.toNumber()-this.delta[0], PMC.Mouse.posY.toNumber()-this.delta[1]];
         if(this.listDrop) {
            if(this.isDrop()) {
               //On ajoute la class "hover" sur l'élément Drop
               if(!this.dropObject.gid.className.matches(/ hover/)) {
                  this.dropObject.gid.className+=' hover';
               }
               if(this.onDragOver){
                  this.onDragOver.apply(this);
               }
            }
         }
         if(this.onMove) {
            this.onMove.apply(this, [evt]);
         }
      }
   },
   out:function () {
      //On retire la class "hover" de l'élément DROP
      this.dropObject.gid.className=this.dropObject.gid.className.replace(/ hover/gi, '');
      //On applique la fonction onDragOut
      if(this.onDragOut!=null) {
         this.onDragOut.apply(this);
      }
      //On supprime l'objet Drop courant
      this.dropObject=null;
   },
   isDrop:function () {
      var bFound=false, i=0;
      while(i<this.listDrop.nb && !bFound) {
         //this.listDrop[i].dimension=PMC.Element.getDimensions(this.listDrop[i].gid);
         if(PMC.Element.visible(this.listDrop[i].gid)) {
            var oDim=PMC.Element.setDimension(this.listDrop[i].gid);
            this.listDrop[i].dimension=oDim.dimension;
            this.listDrop[i].position=oDim.position;
            var iMin=this.listDrop[i].position;
            var iMax = [this.listDrop[i].position[0]+this.listDrop[i].dimension.width,
                     this.listDrop[i].position[1]+this.listDrop[i].dimension.height];
            //if(this.position[0]>iMin[0] && this.position[0]<iMax[0] && this.position[1]>iMin[1] && this.position[1]<iMax[1])
            if(PMC.Mouse.posX>iMin[0] && PMC.Mouse.posX<iMax[0] && PMC.Mouse.posY>iMin[1] && PMC.Mouse.posY<iMax[1]) {
               bFound=true;
            }
         }
         if(!bFound) {
            i++;
         }
      };
      if(bFound) {
         //On vient de quitter un objet Drop et on est sur un autre objet Drop
         if(this.dropObject!=null && this.dropObject!=this.listDrop[i]) {
            this.out();
         }
         //On ajoute l'objet drop courant
         this.dropObject=this.listDrop[i];
      }
      else {
         //Si on vient de quitter l'objet drop
         if(this.dropObject!=null) {
            this.out();
         }
      }
      return bFound;
   }
});
//------------------------
//---Fin objet Drag-------
//------------------------

//------------------------
//---Objet Drop-----------
//------------------------
PMC.utils.Drop=function () {
   this.nb=0;
};

Object.extend(PMC.utils.Drop.prototype,{
   add:function (oElem) {
      oElem=PMC.utils.$(oElem);
      if(oElem==null) {
         alert('PMC.Drop :\nImpossible de charger l\'element');
         return;
      }
      var args={};
      if(arguments.length>1) {
         Object.extend(args, arguments[1]);
      }
      var posElem=PMC.Element.positionedOffset(oElem);
      this[this.nb]={ gid:oElem
                  , position:[posElem[0].toNumber(), posElem[1].toNumber()]
                  , dimension:PMC.Element.getDimensions(oElem)
                  , obj:args
                 };
      this.nb++;
   },
   remove:function(oElem) {
      var bFound=false;
      for(var i=0;i<this.nb; i++) {
         if(this[i].gid==oElem || this[i].obj==oElem) {
            bFound=true;
         }
         if(bFound && i<this.nb-1) {
            this[i]=this[i+1];
         }
      }
      if(bFound) {
         this[this.nb-1]=null;
         delete this[this.nb-1];
         this.nb--;
      }
   },
   removeAll:function() {
      while(this.nb>0) {
         this[this.nb-1]=null;
         delete this[this.nb-1];
         this.nb--;
      }
   }
});
})();
//------------------------
//---Fin objet Drop-------
//------------------------/*fin drag.js*/ 
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
})();/*fin calendrier.js*/ 
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
})();/*fin color.js*/ 
//------------------------
//---IMAGE----------------
//------------------------
(function (){
PMC.Image = PMC.Image || {};
var self=PMC.Image;
var tabImg=[];
var settime=null;
var afterLoading = new PMC.utils.loading();
var refresh = function () {
   settime=setTimeout(function (){PMC.Image.isComplete();},200);
};
var afterComplete=function () {
   PMC.utils.forEach(arguments, function(elem){afterLoading.add(elem)});
/*
      for(var i=0;i<arguments.length;i++) {
         afterLoading.add(arguments[i]);
      }
*/
};


self.stop = function () {
   clearTimeout(settime);
};
Object.extend(PMC.Image,{
   enabled:PMC.Config.img+"b_edit.png",
   disabled:PMC.Config.img+"b_drop.png",
   loading:PMC.Config.img+"loading.gif",
   afterComplete:function () {
      PMC.utils.forEach(arguments, function(elem){afterLoading.add(elem)});
      /*
      for(var i=0;i<arguments.length;i++) {
         afterLoading.add(arguments[i]);
      }
      */
   },
   preloadImages:function () {
      if(arguments.length>0) {
         PMC.utils.forEach(arguments, function(elem){
            var img=new Image();
            img.src=elem;
            tabImg.push(img);
         });
         /*
         for(var i=0;i<arguments.length;i++) {
            var img=new Image();
            img.src=arguments[i];
            tabImg.push(img);
         }
         */
         refresh();
      }
      return;
   },
   isComplete:function () {
      if(PMC.Page.loaded && document.images!=null) {
         for(var i=0;i<tabImg.length;i++) {
            if (tabImg[i].complete) {
               tabImg.del(i);
               i--;
            }
         }
      }
      if (tabImg.length>0) {
         refresh();
      }
      else { //Toutes les images sont chargées, on exécute les fonctions d'après chargement
         afterLoading.exec();
      }
      return;
   },
   change:function (elem) {
      var img=elem.getElementsByTagName("img")[0];
      var tmp=img.src.split("/");
      tmp[tmp.length-1]=(tmp[tmp.length-1]!="b_down2.ico") ? "b_down2.ico" : "b_right2.ico";
      img.src=tmp.join("/");
      return;
   },
   toggle:function (elem) {
      var img=elem.getElementsByTagName("img")[0];
      var tmp=img.src.split("/");
      tmp[tmp.length-1]=(tmp[tmp.length-1]!="b_edit.png") ? "b_drop.png" : "b_edit.png";
      img.src=tmp.join("/");
      return bEnabled ? self.enabled : self.disabled;
   },
   which:function(bEnabled) {
      return bEnabled ? self.enabled : self.disabled;
   }
});
})();/*fin image.js*/ 
//----------------------------------
//---Lancement évènements-----------
//---Initialisation des variables---
//----------------------------------
PMC.Page.onLoad=new PMC.utils.loading();
PMC.onLoad=PMC.DOM.onload;
PMC.onClose=new PMC.utils.loading();
PMC.onMove=new PMC.utils.loading();
PMC.onScroll=new PMC.utils.loading();
PMC.onResize=new PMC.utils.loading();

PMC.onMove.add(PMC.Mouse.move);
PMC.onScroll.add(PMC.Screen.scroll);
PMC.onResize.add(PMC.Screen.scroll);

PMC.onScroll.add(function(){PMC.MsgBox.move();});
PMC.onResize.add(function(){PMC.MsgBox.move();});

PMC.onLoad.add(function () {
   PMC.Screen.scroll();
   PMC.Event.add(window, "unload", function () {PMC.onClose.exec();}, false);
   PMC.Event.add(window.document, "mousemove", function (e) {
         PMC.onMove.exec(e);
      }, true);
   if(PMC.onScroll.nb>0) {
      PMC.Event.add(window, "scroll", function (e) {
         PMC.onScroll.exec(e);
         }, true
      );
   }
   if(PMC.onResize.nb>0) {
      PMC.Event.add(window, "resize", function (e) {
            PMC.onResize.exec(e);
         }, true
      );
   }
   PMC.utils.firstFocus();
   return true;
});
PMC.Page.onLoad.add(function () {PMC.Page.loaded=true;});
if(window.onload!=null)
   PMC.Page.onLoad.add(window.onload);
PMC.Event.add(window, "load", function () {PMC.Page.onLoad.exec();}, false);/*fin onload.js*/ 
//------------------------
//---Gestion des erreurs--
//------------------------
window.onerror=function (nouvelle,fichier,ligne){PMC.Page.msgError(nouvelle,fichier,ligne);};/*fin error.js*/ 
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
window.prompt=PMC.MsgBox.prompt;/*fin msgbox.js*/ 
//------------------------
//---API------------------
//------------------------
(function () {
//RÃ©cupÃ©ration de l'url de la frame mÃ¨re
//var p=(function() {
//   return (function() {
//      var g=function(w, p) {
//         return (w==p) ? w : g(p, p.parent);
//      };
//      return window==window.parent ? window : g(window, window.parent);
//   })();
//})();
var p=window;
var KEY={"pmcoste.hd.free.fr":"BRjQWpxVMKxBTmY5TRnqij3OsosdAj4d", "localhost":"BRjQWpxVMKxBTmY5TRnqij3OsosdAj4d", "grp-fr-mis-zu1.bmf.net":"BRjQWpxVMKxBTmY5TRnqij3OsosdAj4d"};
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
   PMC.utils.debug("Votre clÃ© n'est pas valide. Merci d'en demander une.");
   PMC={};
   PMC={"utils":{"$":function(){}}, "Page":{"onLoad":{"add":function(){}, "exec":function(){}}}, "xhr":{"get":function(){}, "post":function(){}}, "onLoad":{"add":function(){}, "exec":function(){}}, "Config":{"fmwk":""}, "DOM":{"loaded":false}};
}
})();
/*fin api.js*/ 
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
})();/*fin liste.js*/ 
//------------------------
//---MATRIX---------------
//------------------------
Object.extend(PMC,{Matrix:function (iDim, bUnite) {
   this.dimension=iDim.toNumber();
   this.matrix=new Array();
   for(var i=0;i<iDim;i++) {
      this.matrix[i]=new Array();
      for(var j=0;j<iDim;j++) {
         this.matrix[i][j]=(bUnite && i==j) ? 1 : 0; //Si c'est une matrice unite et que ligne=colonne, alors on met 1 sinon 0
      }
   }
}
});
Object.extend(PMC.Matrix.prototype, {
   unite:function (iDim) {
      return new PMC.Matrix(iDim, true);
   }
});
Object.extend(PMC.Matrix.prototype, {
   getDim:function () {return this.dimension;},
   equals:function (matrice) {
      var bRet=(this.getDim()==matrix.getDim());
      if(bRet) {
         var i=0;
         while(bRet && i<this.getDim()) {
            var j=0;
            while(bRet && j<this.getDim()) {
               bRet=this.matrix[i][j]==matrice.matrix[i][j];
               j++;
            }
            i++;
         }
      }
      return bRet;
   },
   isUnite:function () {
      var mUnit=new PMC.Matrix.unite(this.getDim());
      return this.equals(mUnit);
   },
   set:function (sid, bVector) {
      var gid=PMC.utils.$(sid);
      if(bVector==null) {
         bVector=false;
      }
      var jMax=bVector ? 1 : this.getDim();
      if(gid==null) {
         return this;
      }
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<jMax;j++) {
            var sVal=PMC.utils.getVal(PMC.utils.$(sid+'_'+i+'_'+j));
            if(sVal!=null) {
               this.matrix[i][j]=sVal;
            }
         }
      }
      return this;
   },
   //redim:function (iDim)
   //{
   //   var oldDim=this.getDim();
   //   var oNewMatrix=new PMC.Matrix(iDim.toNumber(), false);
   //   var iTmp=PMC.min(oldDim, iDim.toNumber());
   //   for(var i=0;i<iTmp;i++)
   //   for(var j=0;j<iTmp;j++)
   //     oNewMatrix.matrix[i][j]=this.matrix[i][j];
   //   this.dimension=oNewMatrix.getDim();
   //   this.matrix=oNewMatrix.matrix;
   //   return this;
   //},
   toStr:function (bVector) {
      var sRet='<table border=1>';
      if(bVector==null) {
         bVector=false;
      }
      for(var i=0;i<this.getDim();i++) {
         sRet+='<tr>';
         if(bVector) {
            sRet+='<td>'+this.matrix[i][0]+'</td>';
         }
         else {
            for(var j=0;j<this.getDim();j++) {
               sRet+='<td>'+this.matrix[i][j]+'</td>';
            }
         }
         sRet+='</tr>';
      }
      return sRet+'</table>';
   },
   toInput:function (sid, frm, bVector) {
      var gid=PMC.utils.$(sid);
      if(bVector==null) {
         bVector=false;
      }
      if(gid==null) {
         var gid=document.createElement('div');
         gid.id=sid;
         if(frm==null)
            document.body.appendChild(gid);
         else
            frm.appendChild(gid);
      }
      var sRet='<table border=1>';
      for(var i=0;i<this.getDim();i++) {
         sRet+='<tr>';
         if(bVector) {
            j=0;
            sRet+='<td><input type="text" name="'+sid+'['+i+']['+j+']" id="'+sid+'_'+i+'_'+j+'" value="'+this.matrix[i][j]+'" onkeypress="javascript:return(PMC.Key.verifFloat(event, this));" /></td>';
         }
         else {
            for(var j=0;j<this.getDim();j++) {
               sRet+='<td><input type="text" name="'+sid+'['+i+']['+j+']" id="'+sid+'_'+i+'_'+j+'" value="'+this.matrix[i][j]+'" onkeypress="javascript:return(PMC.Key.verifFloat(event, this));" /></td>';
            }
         }
         sRet+='</tr>';
      }
      gid.innerHTML=sRet;
      return gid;
   },
   toHTML:function (sid, bVector) {
      PMC.toHTML(this.toStr(), PMC.utils.$(sid), bVector);
      return true;
   },
   extrait:function (x, y) {
      var tmp=new PMC.Matrix(this.getDim()-1);
      var a=0, b=0;
      for(var i=0;i<this.getDim();i++) {
         b=0;
         if(x!=i) {
            for(var j=0;j<this.getDim();j++) {
               if(y!=j) {
                  tmp.matrix[a][b]=this.matrix[i][j];
                  b++;
               }
            }
            a++;
         }
      }
      return tmp;
   },
   det:function () {
      var iRet=0;
      var isDivisibleBy2=0;
      if(this.getDim()<=0) {
         return 0;
      }
      if(this.getDim()==1) {
         return this.matrix[0][0];
      }
      for(var i=0;i<this.getDim();i++) {
         isDivisibleBy2=1-isDivisibleBy2;
         iRet+=(isDivisibleBy2==1 ? 1 : -1)*this.matrix[i][0]*this.extrait(i,0).det();
      }
      return iRet;
   },
   add:function (Mat) {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=parseFloat(this.matrix[i][j])+parseFloat(Mat.matrix[i][j]);
         }
      }
      return mRet;
   },
   sous:function (Mat) {
      return this.add(Mat.multNb(-1));
   },
   multNb:function (iNb) {
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            this.matrix[i][j]=iNb*this.matrix[i][j];
         }
      }
      return this;
   },
   mult:function (Mat) {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            var iTmp=0;
            for(var a=0;a<this.getDim();a++) {
               iTmp+=parseFloat(this.matrix[i][a])*parseFloat(Mat.matrix[a][j]);
            }
            mRet.matrix[i][j]=Math.round(iTmp,5);
         }
      }
      return mRet;
   },
   transpose:function () {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=this.matrix[j][i];
         }
      }
      return mRet;
   },
   inverse:function () {
      var iDet=this.det();
      if(iDet==0) {
         return null;
      }
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=((i+j)%2==0 ? 1 : -1)*this.extrait(i,j).det();
         }
      }
      return mRet.transpose().multNb(1/iDet);
   },
   div:function (Mat) {
      var iDet=Mat.det();
      if(iDet==0) {
         return null;
      }
      return this.mult(Mat.inverse());
   },
   isRotation:function () {
      return this.Mult(this.transpose()).isUnite();
   }
});/*fin matrix.js*/ 
/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/*fin json2.js*/ 

/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/
PMC.saveAs=(function() {

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this;

function bom (blob, opts) {
  if (typeof opts === 'undefined') {opts = { autoBom: false }}
  else {if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object');
    opts = { autoBom: !opts };
  }}

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
  }
  return blob;
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    saveAs(xhr.response, name, opts);
  };
  xhr.onerror = function () {
    console.error('could not download file')
  };
  xhr.send();
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false);
  xhr.send();
  return xhr.status >= 200 && xhr.status <= 299;
}

// `a.click()` doesn't work for all browsers (#465)
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null);
    node.dispatchEvent(evt);
  }
}

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }
  // Use download attribute first if possible (#193 Lumia mobile)
  : 'download' in HTMLAnchorElement.prototype
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL;
    var a = document.createElement('a');
    name = name || blob.name || 'download';

    a.download = name;
    a.rel = 'noopener'; // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob;
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank');
      } else {
        click(a);
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob);
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4); // 40s
      setTimeout(function () { click(a) }, 0);
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download';

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        var a = document.createElement('a');
        a.href = blob;
        a.target = '_blank';
        setTimeout(function () { click(a) });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    /* Open a popup immediately do go around popup blocker
    Mostly only available on user interaction and the fileReader is async so...*/
    popup = popup || open('', '_blank');
    if (popup) {
      popup.document.title ='downloading...';
      popup.document.body.innerText = 'downloading...';
    }

    if (typeof blob === 'string') {return download(blob, name, opts);}

    var force = (blob.type === 'application/octet-stream');
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if ((isChromeIOS || (force && isSafari)) && typeof FileReader === 'object') {
      //Safari doesn't allow downloading of blob URLs
      var reader = new FileReader();
      reader.onloadend = function () {
        var url = reader.result;
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
        if (popup) {popup.location.href = url;}
        else {location = url;}
        popup = null; // reverse-tabnabbing #460
      };
      reader.readAsDataURL(blob);
    } else {
      var URL = _global.URL || _global.webkitURL;
      var url = URL.createObjectURL(blob);
      if (popup) {popup.location = url;}
      else {location.href = url;}
      popup = null; // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url);}, 4E4); // 40s
    }
  }
);

//_global.saveAs = saveAs.saveAs = saveAs;

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}


return saveAs;



})();

/*fin FileSaver.js*/ 
