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
})();