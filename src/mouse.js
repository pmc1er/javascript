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

})();