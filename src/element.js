//------------------------
//---ELEMENT--------------
//------------------------
(function () {
PMC.Element = PMC.Element || {};
var self=PMC.Element;
var $=PMC.utils.$;
var oFadeTime=Array();
Object.merge(PMC.Element,{
   visible: function (element) {
      var gid=$(element);
      if(gid) {
         return self.getStyle(gid, 'display') != 'none';
      }
      else {
         return false;
      }
   },
   toggle: function () {
      for (var i = 0; i < arguments.length; i++) {
         self[self.visible(arguments[i]) ? 'hide' : 'show'](arguments[i]);
      }
      return true;
   },
   hide: function () {
      for (var i = 0; i < arguments.length; i++) {
         self.setStyle($(arguments[i]), {display:'none'});
      }
      return true;
   },
   affDiv:function (sid) {
      var gid=$(sid);
      var aff="";
      if(gid!=null) {
         aff=(arguments.length>1) ? arguments[1] : self.visible(gid);
         self[aff ? "show" : "hide"](gid);
      }
      return true;
   },
   show: function () {
      PMC.utils.forEach(arguments, function(elem) {
         self.removeClass(elem, "displayNone");
         $(elem).style.display=null;
         //self.setStyle($(elem), {display:''});//block
      });
      return true;
   },
   showinline: function () {
      for (var i = 0; i < arguments.length; i++) {
         self.setStyle($(arguments[i]), {display:'inline'});
      }
      return true;
   },
   update: function (element, html) {
      $(element).innerHTML = html.stripScripts();
      return true;
   },
   getHeight: function (element) {
      return $(element).offsetHeight;
   },
   empty: function (element) {
      return $(element).innerHTML.match(/^\s*$/);
   },
   scrollTo: function (element) {
      element = $(element);
      var x = element.x ? element.x : element.offsetLeft,
         y = element.y ? element.y : element.offsetTop;
      window.scrollTo(x, y);
      return true;
   },
   getStyle: function (element, style) {
      element = $(element);
      var value = element.style[style.camelize()];
      if (!value) {
         if (document.defaultView && document.defaultView.getComputedStyle) {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css.getPropertyValue(style) : null;
         }
         else if (element.currentStyle) {
            value = element.currentStyle[style.camelize()];
         }
      }
      return (value=='auto') ? null:value;
   },
   setStyle: function (element, objStyle) {
      element = $(element);
      for (var sName in objStyle) {
         element.style[sName.camelize()] = objStyle[sName];
      }
      return false;
   },
   moveTo:function (element,x,y) {
      element = $(element);
/*
      if(self.getStyle(element, 'position') != "relative") {
         self.absolutize(element);
      }
*/
      self.setStyle(element, {top:y.toNumber()+"px",left:x.toNumber()+"px"});
      return false;
   },
   getDimensions: function (element) {
      element = $(element);
      if (self.getStyle(element, 'display') != 'none') {
         return {width: element.offsetWidth, height: element.offsetHeight};
      }
      // All *Width and *Height properties give 0 on elements with display none,
      // so enable the element temporarily
      var els = element.style;
      var originalVisibility = els.visibility;
      var originalPosition = els.position;
      els.visibility = 'hidden';
      els.position = 'absolute';
      els.display = '';
      var originalWidth = element.clientWidth;
      var originalHeight = element.clientHeight;
      els.display = 'none';
      els.position = originalPosition;
      els.visibility = originalVisibility;
      return {width: originalWidth, height: originalHeight};
   },
   makePositioned: function (element) {
      element = $(element);
      var pos = self.getStyle(element, 'position');
      if (pos == 'static' || !pos) {
         element._madePositioned = true;
         element.style.position = 'relative';
         // Opera returns the offset relative to the positioning context, when an
         // element is position relative but top and left have not been defined
         if (window.opera) {
            element.style.top = 0;
            element.style.left = 0;
         }
      }
      return true;
   },
   undoPositioned: function (element) {
      element = $(element);
      if (element._madePositioned) {
         element._madePositioned = undefined;
         element.style.position =
         element.style.top =
         element.style.left =
         element.style.bottom =
         element.style.right = '';
      }
      return true;
   },
   makeClipping: function (element) {
      element = $(element);
      if (element._overflow) {
         return false;
      }
      element._overflow = element.style.overflow;
      if ((self.getStyle(element, 'overflow') || 'visible') != 'hidden') {
         element.style.overflow = 'hidden';
      }
      return true;
   },
   undoClipping: function (element) {
      element = $(element);
      if (element._overflow) {
         return false;
      }
      element.style.overflow = element._overflow;
      element._overflow = undefined;
      return true;
   },
   getOpacity:function (oElem) {
      oElem=$(oElem);
      if(oElem.style.opacity) {
         return oElem.style.opacity*100;
      }
      if(oElem.style.MozOpacity) {
         return oElem.style.MozOpacity*100;
      }
      if(oElem.style.KhtmlOpacity) {
         return oElem.style.KhtmlOpacity*100;
      }
      if(oElem.style.filter) {
         return oElem.style.filter;
      }
      return null;
   },
   setOpacity:function (oElem, level) {
      oElem=$(oElem);
      level=parseFloat(level.toNumber()/100);
      oElem.style.opacity=level;
      oElem.style.MozOpacity=level;
      oElem.style.KhtmlOpacity=level;
      oElem.style.filter="alpha(opacity="+(level*100)+");";
      return true;
   },
   fade:function (sid, bFade, iStart, iEnd, iStep, iMs, fct, param) {
      bFade=(bFade==null) ? true : bFade;
      iStart=(iStart==null) ? ((bFade) ? 0 : 100) : iStart.toNumber();
      iEnd=(iEnd==null) ? ((bFade) ? 100 : 0) : iEnd.toNumber();
      iStep=(iStep==null) ? 15 : iStep.toNumber();
      iMs=(iMs==null) ? 50 : iMs.toNumber();
      var gid=$(sid);
      if(gid!=null) {
         if(bFade && iStart>=0) {
            self.show(gid);
         }
         if(!bFade && iStart<=0) {
            self.hide(gid);
         }
         self.setOpacity(gid, iStart);
         if(bFade && iStart<iEnd) {
            oFadeTime[gid]=setTimeout(function() {
                        PMC.Element.fade(gid, bFade, (iStart+iStep), iEnd, iStep, iMs, fct, param);
                     },iMs);
            //self.oFadeTime[gid.id]=setTimeout("PMC.Element.fade('"+gid.id+"', "+bFade+", "+(iStart+iStep)+", "+iEnd+", "+iStep+", "+iMs+", "+fct+", '"+param+"')",iMs);
         }
         else if(!bFade && iStart>iEnd) {
            oFadeTime[gid]=setTimeout(function() {
                        PMC.Element.fade(gid, bFade, (iStart-iStep), iEnd, iStep, iMs, fct, param);
                     },iMs);
            //self.oFadeTime[gid.id]=setTimeout("PMC.Element.fade('"+gid.id+"', "+bFade+", "+(iStart-iStep)+", "+iEnd+", "+iStep+", "+iMs+", "+fct+", '"+param+"')",iMs);
         }
         else if(fct!=null) {
            if(typeof(fct)=="function") {
               fct(param);
            }
            else {
               eval(fct+"(\""+param+"\")");
            }
         }
      }
      return true;
   },
   autocomplete:function (sid, bAutocomplete) {
      var gid=$(sid);
      if(bAutocomplete==null) {
         bAutocomplete=false;
      }
      if(gid!=null) {
         gid.setAttribute("autocomplete", bAutocomplete ? "on" : "off");
      }
      return true;
   },
   setDimension:function (oElem) {
      oElem=$(oElem);
      var posElem=self.cumulativeOffset(oElem);
      return {position  : [posElem[0].toNumber(), posElem[1].toNumber()],
            dimension : self.getDimensions(oElem)};
   },
   // set to true if needed, warning: firefox performance problems
   // NOT neeeded for page scrolling, only if draggable contained in
   // scrollable elements
   includeScrollOffsets: false,

   // must be called before calling withinIncludingScrolloffset, every time the
   // page is scrolled
   prepare: function () {
      this.deltaX =  PMC.Screen.scrollX || 0;
      this.deltaY =  PMC.Screen.scrollY || 0;
      return;
   },

   realOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.scrollTop  || 0;
         valueL += element.scrollLeft || 0;
         element = element.parentNode;
      } while (element);
      return [valueL, valueT];
   },

   cumulativeOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         element = element.offsetParent;
      } while (element);
      return [valueL, valueT];
   },

   positionedOffset: function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         element = element.offsetParent;
         if (element) {
            var p = self.getStyle(element, 'position');
            if (p == 'relative' || p == 'absolute') {
               break;
            }
         }
      } while (element);
      return [valueL, valueT];
   },

   offsetParent: function (element) {
      if (element.offsetParent) {
         return element.offsetParent;
      }
      if (element == document.body) {
         return element;
      }

      while ((element = element.parentNode) && element != document.body) {
         if (self.getStyle(element, 'position') != 'static') {
            return element;
         }
      }
      return document.body;
   },

   // caches x/y coordinate pair to use with overlap
   within: function (element, x, y) {
      if (self.includeScrollOffsets) {
         return this.withinIncludingScrolloffsets(element, x, y);
      }
      this.xcomp = x;
      this.ycomp = y;
      this.offset = this.cumulativeOffset(element);

      return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
   },

   withinIncludingScrolloffsets: function (element, x, y) {
      var offsetcache = this.realOffset(element);

      this.xcomp = x + offsetcache[0] - this.deltaX;
      this.ycomp = y + offsetcache[1] - this.deltaY;
      this.offset = this.cumulativeOffset(element);

      return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
   },

   // within must be called directly before
   overlap: function (mode, element) {
      if (!mode) {
         return 0;
      }
      if (mode == 'vertical') {
         return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
               element.offsetHeight;
      }
      if (mode == 'horizontal') {
         return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
            element.offsetWidth;
      }
      return null;
   },
   page: function (forElement) {
      var valueT = 0, valueL = 0;

      var element = forElement;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;

         // Safari fix
         if (element.offsetParent==document.body) {
            if (self.getStyle(element,'position')=='absolute') {
               break;
            }
         }
      } while ((element=element.offsetParent)!=null);

      element = forElement;
      do {
         valueT -= element.scrollTop  || 0;
         valueL -= element.scrollLeft || 0;
      } while ((element = element.parentNode)!=null);

      return [valueL, valueT];
   },

   clone: function (source, target) {
      var options = Object.extend({setLeft:   true,
                            setTop:    true,
                            setWidth:   true,
                            setHeight:  true,
                            offsetTop:  0,
                            offsetLeft: 0
                           }, arguments[2] || {});

      // find page position of source
      source = $(source);
      var p = self.page(source);

      // find coordinate system to use
      target = $(target);
      var delta = [0, 0];
      var parent = null;
      // delta [0,0] will do fine with position: fixed elements,
      // position:absolute needs offsetParent deltas
      if (self.getStyle(target,'position') == 'absolute') {
         parent = self.offsetParent(target);
         delta = self.page(parent);
      }

      // correct by body offsets (fixes Safari)
      if (parent == document.body) {
         delta[0] -= document.body.offsetLeft;
         delta[1] -= document.body.offsetTop;
      }

      // set position
      if(options.setLeft) {
         target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px'
      }
      if(options.setTop) {
         target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
      }
      if(options.setWidth) {
         target.style.width = source.offsetWidth + 'px';
      }
      if(options.setHeight) {
         target.style.height = source.offsetHeight + 'px';
      }
      return null;
   },

   absolutize: function (element) {
      element = $(element);
      if (element.style.position == 'absolute') {
         return;
      }
      self.prepare();

      var offsets = self.positionedOffset(element);
      var top    = offsets[1];
      var left   = offsets[0];
      var width   = element.clientWidth;
      var height  = element.clientHeight;

      element._originalLeft   = left - parseFloat(element.style.left  || 0);
      element._originalTop   = top  - parseFloat(element.style.top || 0);
      element._originalWidth  = element.style.width;
      element._originalHeight = element.style.height;

      element.style.position = 'absolute';
      element.style.top   = top + 'px';;
      element.style.left   = left + 'px';;
      element.style.width  = width + 'px';;
      element.style.height = height + 'px';;
      return;
   },

   relativize: function (element) {
      element = $(element);
      if(self.getStyle(element, 'position') == 'relative') {
         return;
      }
      self.prepare();
      var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
      var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);
      self.setStyle(element, {
                     position :'relative',
                     top      :top+'px',
                     left     :left+'px',
                     height   :element._originalHeight,
                     width    :element._originalWidth});
      return;
   },
   addClass:function(gid, css) {
      var oClass=PMC.utils.$(gid).className.split(" ");
      if(!oClass.inArray(css) && css!="" && css!=undefined) {
         oClass.push(css);
      }
      gid.className=oClass.join(" ");
      return;
   },
   isClass:function(gid, css) {
      return PMC.utils.$(gid).className.split(" ").inArray(css);
   },
   removeClass:function(gid, css) {
      gid=PMC.utils.$(gid);
      var oClass=gid.className.split(" ");
      oClass.removeValue(css);
      gid.className=oClass.join(" ");
      return;
   },
   toggleClass:function(gid, css1, css2) {
      gid=PMC.utils.$(gid);
      if(this.isClass(gid, css1)) {
         this.removeClass(gid, css1);
         this.addClass(gid, css2);
      }
      else {
         this.removeClass(gid, css2);
         this.addClass(gid, css1);
      }
   }
});
if(PMC.utils.navigator.is_konqueror || PMC.utils.navigator.is_safari || PMC.utils.navigator.is_khtml) {
   self.cumulativeOffset = function (element) {
      var valueT = 0, valueL = 0;
      do {
         valueT += element.offsetTop  || 0;
         valueL += element.offsetLeft || 0;
         if (element.offsetParent == document.body) {
            if (self.getStyle(element, 'position') == 'absolute') {
               break;
            }
         }
         element = element.offsetParent;
      } while (element);
      return [valueL, valueT];
   }
}
})();