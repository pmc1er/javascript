//------------------------
//---LOADING--------------
//------------------------
PMC.utils.loading = function () {
   this.nb=0;
   this.fct=null;
   this.arg=[];
};

PMC.utils.loading.prototype = {
   addArgs:function() {
      var args=[];
      PMC.utils.forEach(arguments, function(elem) {args.push(elem);});
      return args;
   },
   toString:function () {
      var ret="";
      for(var i=0; i<this.nb; i++) {
         ret+="FCT : "+this[i].fct+" -  ARG : "+this[i].arg.toString()+"\n"
      }
      return ret;
   },
   add:function (fct_name) {
      if (fct_name!=null) {
         var args=[];
         PMC.utils.forEach(arguments, function(elem) {args.push(elem);});
         /*
         for(var i=1; i<arguments.length; i++) {
            args.push(arguments[i]);
         }
         */
         this[this.nb]={fct:fct_name, arg:args};
         this.nb++;
      }
   },
   remove:function (fct) {
      var j=0;
      if(fct!=null) {
         for(var i=0; i < this.nb; i++) {
            if(this[i].fct==fct) {
               j++;
            }
            if(j>0) {
               this[i]=this[i+1];
            }
         }
      }
      if(j>0) {
         this.nb--;
         delete this[this.nb];
         if(j>1) {
            this.remove(fct);
         }
      }
   },
   exec:function exec() {
      for(var i=0; i < this.nb; i++) {
         if(typeof this[i].fct=="string") {
            eval(this[i].fct);
         }
         else {
            var args=[];
            for(var j=0;j<arguments.length;j++) {
               args.push(arguments[j]);
            }
            this[i].fct.apply(this[i].fct, args.concat(this[i].arg));
         }
      }
   }
};