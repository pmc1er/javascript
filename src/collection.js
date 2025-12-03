//------------------------
//---COLLECTION-----------
//------------------------
//Liste d'instances
PMC.Collection = function()
{
   this.nb=0;
};
Object.merge(PMC.Collection.prototype, {
   forEach:function(callback) {
      if(!callback) {
         throw new Exception("Erreur dans PMC.Collection.forEach, callback not defined !");
      }
      for(var i=0;i<this.nb;i++) {
         callback(this[i]);
      }
   },
   //Ajout d'un élément
   add:function(elem)
   {
      this[this.nb]=elem;
      this.nb++;
      return;
   },
   //Suppression d'un élément
   remove:function(elem)
   {
      var bFound=false, j=0;
      for(var i = 0; i < this.nb; i++)  {
         if(this[i]==elem) {
            bFound = true;
            j=i;
            i++;
         }
         if(bFound && i<this.nb) {
            this[j]=this[i];
            j++;
         }
      }
      if(bFound) {
         this.nb--;
         delete this[this.nb];
      }
      return;
   }
});