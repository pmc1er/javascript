//------------------------
//---DRAG & DROP----------
//------------------------
//------------------------
//---Objet Drag-----------
//------------------------
/*
 * argument:
 * {
 *   headerClass : class de l'élément "dt" qui recevra les évènements. Si non existant, c'est tout l'objet DOM qui recevra les évènements.
 *   onLoad     : fonction exécutée au chargement de l'objet Drag.
 *   onStop     : fonction exécutée lors du relachement de la souris si on est en-dehors des objets Drop (objets permettant de recevoir les objets Drag)
 *   listDrop   : contient la liste des objets Drop (contenant l'ensemble des conteneurs qui peuvent recevoir l'objet Drag)
 *   onDragOver  : fonction exécutée lorsque l'objet Drag passe sur un objet Drop
 *   onDragOut   : fonction exécutée lorsque l'objet Drag quitte un objet Drop
 *   onDrag     : fonction exécutée lorsque la souris est relachée sur un objet Drop
 * }
*/
//------------------------
(function() {
var initialize=function (oElem) {
   this.gid=PMC.utils.$(oElem);
   //Récupération de l'élément qui recevra les évènements
   if(this.gid.getElementsByTagName('dt').length>0 &&
         this.headerClass &&
         this.gid.getElementsByTagName('dt')[0].className==this.headerClass) {
      this.gidEvent=this.gid.getElementsByTagName('dt')[0];
   }
   //on met le curseur "move" sur l'élément qui recevra les évènements
   PMC.Element.setStyle(this.gidEvent, {cursor:"move"});
   //On rend l'élément "absolu"
   PMC.Element.relativize(this.gid);
   //On récupère sa position
   var oDim=PMC.Element.setDimension(this.gid);
   this.position=oDim.position;
   this.dimension=oDim.dimension;
   //var posElem=PMC.Element.positionedOffset(this.gid);
   //this.position=[posElem[0].toNumber(), posElem[1].toNumber()];
   this.position_save=this.position;

   //On applique les évènements "onLoad"
   if(this.onLoad!=null) {
      this.onLoad.apply(this);
   }
   //On lance les évènements
   PMC.Event.add(this.gidEvent, "mousedown", this.start.bind(this));
   PMC.Event.add(this.gidEvent, "mouseup", this.stop.bind(this));
   //PMC.Event.add(this.gidEvent, "click", this.stop.bind(this));
   PMC.onMove.add(this.mousemove.bind(this));
};
PMC.utils.Drag=function (oElem) {
   var args=arguments;
   this.gid=PMC.utils.$(oElem);
   this.isMoved=false;
   this.position=[0,0];
   this.position_save=this.position;
   this.dimension={width:0, height:0};
   this.delta=[0,0];
   this.gidEvent=this.gid;
   this.listDrop=null;
   this.dropObject=null;
   if(args.length>1) {
      for(var i in args[1]) {
         this[i]=args[1][i];
      }
   }
   if(PMC.DOM.loaded) {
      initialize.call(this, oElem);
   }
   else {
      PMC.onLoad.add(initialize.bind(this, oElem));
   }
};
Object.extend(PMC.utils.Drag.prototype,{
   toString:function () {
      return "sid="+this.gid.id+"\nisMoved="+this.isMoved+"\nposX="+this.position[0]+"\nposY="+this.position[0]+"\nwidth="+this.dimension.width+"\nheight="+this.dimension.height+"\ndX="+this.delta[0]+"\ndY="+this.delta[1]+"\n";
   },
   start:function () {
      this.isMoved=true;
      PMC.utils.disableSelection(this.gid);
      PMC.utils.disableSelection(document);
      //var posElem=PMC.Element.positionedOffset(this.gid);
      //this.position=[posElem[0].toNumber(), posElem[1].toNumber()];
      //this.dimension=PMC.Element.getDimensions(this.gid);
      var oDim=PMC.Element.setDimension(this.gid);
      this.position=oDim.position;
      this.dimension=oDim.dimension;
      this.position_save=this.position;
      this.delta=[PMC.Mouse.posX.toNumber()-this.position[0].toNumber()+5, PMC.Mouse.posY.toNumber()-this.position[1].toNumber()];
      if(this.onStart) {
         this.onStart.apply(this);
      }
      this.gid.className+=" dragged";
      PMC.Element.setStyle(this.gid, {zIndex:10});
   },
   annule:function () {
      PMC.Element.moveTo(this.gid, this.position_save[0], this.position_save[1]);
   },
   stop:function () {
      this.isMoved=false;
      this.gid.className=this.gid.className.replace(/dragged/gi,'');
      PMC.Element.setStyle(this.gid, {zIndex:1});
      if(this.dropObject!=null && this.onDrag) {
         //On retire la class "hover" de l'élément DROP
         this.dropObject.gid.className=this.dropObject.gid.className.replace(/ hover/gi, '');
         this.onDrag.call(this, this.dropObject);
      }
      else if(this.onStop) {
         this.onStop.apply(this);
      }
   },
   mousemove:function (evt) {
      if(this.isMoved) {
         PMC.Element.moveTo(this.gid, this.position[0], this.position[1]);
         this.position=[PMC.Mouse.posX.toNumber()-this.delta[0], PMC.Mouse.posY.toNumber()-this.delta[1]];
         if(this.listDrop) {
            if(this.isDrop()) {
               //On ajoute la class "hover" sur l'élément Drop
               if(!this.dropObject.gid.className.matches(/ hover/)) {
                  this.dropObject.gid.className+=' hover';
               }
               if(this.onDragOver){
                  this.onDragOver.apply(this);
               }
            }
         }
         if(this.onMove) {
            this.onMove.apply(this, [evt]);
         }
      }
   },
   out:function () {
      //On retire la class "hover" de l'élément DROP
      this.dropObject.gid.className=this.dropObject.gid.className.replace(/ hover/gi, '');
      //On applique la fonction onDragOut
      if(this.onDragOut!=null) {
         this.onDragOut.apply(this);
      }
      //On supprime l'objet Drop courant
      this.dropObject=null;
   },
   isDrop:function () {
      var bFound=false, i=0;
      while(i<this.listDrop.nb && !bFound) {
         //this.listDrop[i].dimension=PMC.Element.getDimensions(this.listDrop[i].gid);
         if(PMC.Element.visible(this.listDrop[i].gid)) {
            var oDim=PMC.Element.setDimension(this.listDrop[i].gid);
            this.listDrop[i].dimension=oDim.dimension;
            this.listDrop[i].position=oDim.position;
            var iMin=this.listDrop[i].position;
            var iMax = [this.listDrop[i].position[0]+this.listDrop[i].dimension.width,
                     this.listDrop[i].position[1]+this.listDrop[i].dimension.height];
            //if(this.position[0]>iMin[0] && this.position[0]<iMax[0] && this.position[1]>iMin[1] && this.position[1]<iMax[1])
            if(PMC.Mouse.posX>iMin[0] && PMC.Mouse.posX<iMax[0] && PMC.Mouse.posY>iMin[1] && PMC.Mouse.posY<iMax[1]) {
               bFound=true;
            }
         }
         if(!bFound) {
            i++;
         }
      };
      if(bFound) {
         //On vient de quitter un objet Drop et on est sur un autre objet Drop
         if(this.dropObject!=null && this.dropObject!=this.listDrop[i]) {
            this.out();
         }
         //On ajoute l'objet drop courant
         this.dropObject=this.listDrop[i];
      }
      else {
         //Si on vient de quitter l'objet drop
         if(this.dropObject!=null) {
            this.out();
         }
      }
      return bFound;
   }
});
//------------------------
//---Fin objet Drag-------
//------------------------

//------------------------
//---Objet Drop-----------
//------------------------
PMC.utils.Drop=function () {
   this.nb=0;
};

Object.extend(PMC.utils.Drop.prototype,{
   add:function (oElem) {
      oElem=PMC.utils.$(oElem);
      if(oElem==null) {
         alert('PMC.Drop :\nImpossible de charger l\'element');
         return;
      }
      var args={};
      if(arguments.length>1) {
         Object.extend(args, arguments[1]);
      }
      var posElem=PMC.Element.positionedOffset(oElem);
      this[this.nb]={ gid:oElem
                  , position:[posElem[0].toNumber(), posElem[1].toNumber()]
                  , dimension:PMC.Element.getDimensions(oElem)
                  , obj:args
                 };
      this.nb++;
   },
   remove:function(oElem) {
      var bFound=false;
      for(var i=0;i<this.nb; i++) {
         if(this[i].gid==oElem || this[i].obj==oElem) {
            bFound=true;
         }
         if(bFound && i<this.nb-1) {
            this[i]=this[i+1];
         }
      }
      if(bFound) {
         this[this.nb-1]=null;
         delete this[this.nb-1];
         this.nb--;
      }
   },
   removeAll:function() {
      while(this.nb>0) {
         this[this.nb-1]=null;
         delete this[this.nb-1];
         this.nb--;
      }
   }
});
})();
//------------------------
//---Fin objet Drop-------
//------------------------