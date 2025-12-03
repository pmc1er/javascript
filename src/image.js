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
})();