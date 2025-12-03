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
})();