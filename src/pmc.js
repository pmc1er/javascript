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
})();