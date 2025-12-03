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
});