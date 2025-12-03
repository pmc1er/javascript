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
