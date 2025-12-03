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
PMC.Event.add(window, "load", function () {PMC.Page.onLoad.exec();}, false);