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
