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
})();