//------------------------
//---CACHE----------------
//------------------------
(function () {
PMC.Cache = function () {
   this.nb=0;
};
var Cache=function(cd, val) {
   return {"cd":cd, "val":val};
};
Object.merge(Cache.prototype, {
   toString:function () {
      return "CD="+this.cd+"\tVal="+this.val.toString();
   },
   toUrl:function () {
      return "CD="+this.cd.encode64(true)+"\tVal="+this.val.toString().encode64(true);
   }
});

PMC.Cache.prototype = {
   toString:function () {
      var ret="";
      for(var i=0; i<this.nb; i++) {
         ret+=this[i].toString()+"\n";
      }
      return ret;
   },
   add:function (sDeb, aCache, sAdd) {
      if(sAdd==null) {
         sAdd=true;
      }
      for(var i=0;i<this.nb; i++) {
         if(this[i].cd==sDeb) {
            if(aCache.isArray && sAdd) {
               for(var j=0;j<aCache.length;j++) {
                  this[i].val.push(aCache[j]);
               }
            }
            else {
               this[i].val.push(aCache);
            }
            return;
         }
      }
      if(!(aCache.isArray && sAdd)) {
         aCache=new Array(aCache);
      }
      this[this.nb]=new Cache(sDeb, aCache);
      this.nb++;
      return;
   },
   toUrl:function () {
      var ret=[];
      for(var i=0; i<this.nb; i++) {
         ret.push("cd["+i+"]="+this[i].cd.encode64());
         if(typeof this[i].val=="string") {
            ret.push("val["+i+"]="+this[i].val.encode64());
         }
         else {
            ret.push("val["+i+"]="+this[i].val.encode64().join("$"));
         }
      }
      return ret.join("&");
   },
   get:function ()  {
      var sDeb=(arguments.length>0) ? arguments[0] : "";
      var bGetFirst=(arguments.length>1) ? arguments[1] : true;
      if(sDeb!="") {
         for(var i=0;i<this.nb;i++) {
            if(this[i].cd==sDeb) {
               return this[i].val;
            }
            //return this[i].val.length==1 && bGetFirst ? this[i].val[0] : this[i].val;
            //return this[i].val;
         }
         return null;
      }
      else {
         return this;
      }
   },
   getId:function (sDeb) {
      if(sDeb==null) {
         return 0;
      }
      else {
         for(var i=0;i<this.nb;i++)  {
            if(this[i].cd==sDeb) {
               return i;
            }
         }
      }
      return 0;
   },
   replaceAll:function (sDeb, aCache) {
      for(var i=0;i<this.nb; i++) {
         if(this[i].cd==sDeb) {
            if(aCache.isArray) {
               this[i].val=aCache;
            }
            else {
               this[i].val=new Array(aCache);
            }
            return;
         }
      }
      this.add(sDeb, aCache);
      return;
   },
   del:function () {
      var sDeb=(arguments.length>0) ? arguments[0] : "";
      if(sDeb!="") {
         for(var i=0;i<this.nb;i++) {
            if(this[i].cd==sDeb) {
               for(var j=i+1; j<this.nb; j++) {
                  this[j-1]=this[j];
               }
               this[this.nb-1]=null;
               this.nb--;
               return true;
            }
         }
      }
      else {
         for(var i=this.nb-1;i>=0;i--) {
            this[i]=null;
         }
         this.nb=0;
      }
      return true;
   },
   next:function (sDeb, bBoucle) {
      if(bBoucle==null) {
         bBoucle=false;
      }
      var i=this.getId(sDeb);
      if(i>=this.nb-1 && bBoucle) {
         return 0;
      }
      else if(i>=this.nb) {
            return -1;
      }
      else {
         PMC.utils.debug('Bouclage');
         return i+1;
      }
   },
   prev:function (sDeb, bBoucle) {
      if(bBoucle==null) {
         bBoucle=false;
      }
      var i=this.getId(sDeb);
      if(i<=0 && bBoucle) {
         return this.nb-1;
      }
      else if(i<=0) {
         return -1;
      }
      else {
         return i-1;
      }
   }
};
})();
/*
//------------------------
//---ELEM IN CACHE--------
//------------------------
Object.extend(PMC,{elemInCache:function ()
{
   this.nb=0;
   this.add=addElemInCache;
   this.get=getElemInCache;
   this.del=delElemInCache;
   this.toString=function ()
     {
       var ret="";
       for(var i=0; i<this.nb; i++)
         ret+=this[i].toString()+"\n";
       return ret;
     };
   function addElemInCache(sElem) {
     var oElem={};
     oElem.field=sElem;
     oElem.cache=new setCache();
     oElem.toString=function ()
       {
       var ret="Field : "+oElem.field;
       ret+="\tCache : "+oElem.cache.toString();
       return ret;
       };
     this[this.nb]=oElem;
     this.nb++;
   }

   function getElemInCache() {
     var sField=(arguments.length>0) ? arguments[0] : "";
     if(sField!="")
     {
       for(var i=0;i<this.nb;i++)
       {
         if(this[i].field==sField)
            return this[i];
       }
       return this;
     }
     else
       return this;
   }

   function delElemInCache() {
     var sField=(arguments.length>0) ? arguments[0] : "";
     if(sField!="")
     {
      for(var i=0;i<this.nb;i++)
      {
         if(this[i].field==sField)
           this[i]=null;
      }
     }
     else
     {
       for(var i=0;i<this.nb;i++)
         this[i]=null;
       this.nb=0;
     }
     return true;
   }
}});*/