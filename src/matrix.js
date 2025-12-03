//------------------------
//---MATRIX---------------
//------------------------
Object.extend(PMC,{Matrix:function (iDim, bUnite) {
   this.dimension=iDim.toNumber();
   this.matrix=new Array();
   for(var i=0;i<iDim;i++) {
      this.matrix[i]=new Array();
      for(var j=0;j<iDim;j++) {
         this.matrix[i][j]=(bUnite && i==j) ? 1 : 0; //Si c'est une matrice unite et que ligne=colonne, alors on met 1 sinon 0
      }
   }
}
});
Object.extend(PMC.Matrix.prototype, {
   unite:function (iDim) {
      return new PMC.Matrix(iDim, true);
   }
});
Object.extend(PMC.Matrix.prototype, {
   getDim:function () {return this.dimension;},
   equals:function (matrice) {
      var bRet=(this.getDim()==matrix.getDim());
      if(bRet) {
         var i=0;
         while(bRet && i<this.getDim()) {
            var j=0;
            while(bRet && j<this.getDim()) {
               bRet=this.matrix[i][j]==matrice.matrix[i][j];
               j++;
            }
            i++;
         }
      }
      return bRet;
   },
   isUnite:function () {
      var mUnit=new PMC.Matrix.unite(this.getDim());
      return this.equals(mUnit);
   },
   set:function (sid, bVector) {
      var gid=PMC.utils.$(sid);
      if(bVector==null) {
         bVector=false;
      }
      var jMax=bVector ? 1 : this.getDim();
      if(gid==null) {
         return this;
      }
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<jMax;j++) {
            var sVal=PMC.utils.getVal(PMC.utils.$(sid+'_'+i+'_'+j));
            if(sVal!=null) {
               this.matrix[i][j]=sVal;
            }
         }
      }
      return this;
   },
   //redim:function (iDim)
   //{
   //   var oldDim=this.getDim();
   //   var oNewMatrix=new PMC.Matrix(iDim.toNumber(), false);
   //   var iTmp=PMC.min(oldDim, iDim.toNumber());
   //   for(var i=0;i<iTmp;i++)
   //   for(var j=0;j<iTmp;j++)
   //     oNewMatrix.matrix[i][j]=this.matrix[i][j];
   //   this.dimension=oNewMatrix.getDim();
   //   this.matrix=oNewMatrix.matrix;
   //   return this;
   //},
   toStr:function (bVector) {
      var sRet='<table border=1>';
      if(bVector==null) {
         bVector=false;
      }
      for(var i=0;i<this.getDim();i++) {
         sRet+='<tr>';
         if(bVector) {
            sRet+='<td>'+this.matrix[i][0]+'</td>';
         }
         else {
            for(var j=0;j<this.getDim();j++) {
               sRet+='<td>'+this.matrix[i][j]+'</td>';
            }
         }
         sRet+='</tr>';
      }
      return sRet+'</table>';
   },
   toInput:function (sid, frm, bVector) {
      var gid=PMC.utils.$(sid);
      if(bVector==null) {
         bVector=false;
      }
      if(gid==null) {
         var gid=document.createElement('div');
         gid.id=sid;
         if(frm==null)
            document.body.appendChild(gid);
         else
            frm.appendChild(gid);
      }
      var sRet='<table border=1>';
      for(var i=0;i<this.getDim();i++) {
         sRet+='<tr>';
         if(bVector) {
            j=0;
            sRet+='<td><input type="text" name="'+sid+'['+i+']['+j+']" id="'+sid+'_'+i+'_'+j+'" value="'+this.matrix[i][j]+'" onkeypress="javascript:return(PMC.Key.verifFloat(event, this));" /></td>';
         }
         else {
            for(var j=0;j<this.getDim();j++) {
               sRet+='<td><input type="text" name="'+sid+'['+i+']['+j+']" id="'+sid+'_'+i+'_'+j+'" value="'+this.matrix[i][j]+'" onkeypress="javascript:return(PMC.Key.verifFloat(event, this));" /></td>';
            }
         }
         sRet+='</tr>';
      }
      gid.innerHTML=sRet;
      return gid;
   },
   toHTML:function (sid, bVector) {
      PMC.toHTML(this.toStr(), PMC.utils.$(sid), bVector);
      return true;
   },
   extrait:function (x, y) {
      var tmp=new PMC.Matrix(this.getDim()-1);
      var a=0, b=0;
      for(var i=0;i<this.getDim();i++) {
         b=0;
         if(x!=i) {
            for(var j=0;j<this.getDim();j++) {
               if(y!=j) {
                  tmp.matrix[a][b]=this.matrix[i][j];
                  b++;
               }
            }
            a++;
         }
      }
      return tmp;
   },
   det:function () {
      var iRet=0;
      var isDivisibleBy2=0;
      if(this.getDim()<=0) {
         return 0;
      }
      if(this.getDim()==1) {
         return this.matrix[0][0];
      }
      for(var i=0;i<this.getDim();i++) {
         isDivisibleBy2=1-isDivisibleBy2;
         iRet+=(isDivisibleBy2==1 ? 1 : -1)*this.matrix[i][0]*this.extrait(i,0).det();
      }
      return iRet;
   },
   add:function (Mat) {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=parseFloat(this.matrix[i][j])+parseFloat(Mat.matrix[i][j]);
         }
      }
      return mRet;
   },
   sous:function (Mat) {
      return this.add(Mat.multNb(-1));
   },
   multNb:function (iNb) {
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            this.matrix[i][j]=iNb*this.matrix[i][j];
         }
      }
      return this;
   },
   mult:function (Mat) {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            var iTmp=0;
            for(var a=0;a<this.getDim();a++) {
               iTmp+=parseFloat(this.matrix[i][a])*parseFloat(Mat.matrix[a][j]);
            }
            mRet.matrix[i][j]=Math.round(iTmp,5);
         }
      }
      return mRet;
   },
   transpose:function () {
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=this.matrix[j][i];
         }
      }
      return mRet;
   },
   inverse:function () {
      var iDet=this.det();
      if(iDet==0) {
         return null;
      }
      var mRet=new PMC.Matrix(this.getDim());
      for(var i=0;i<this.getDim();i++) {
         for(var j=0;j<this.getDim();j++) {
            mRet.matrix[i][j]=((i+j)%2==0 ? 1 : -1)*this.extrait(i,j).det();
         }
      }
      return mRet.transpose().multNb(1/iDet);
   },
   div:function (Mat) {
      var iDet=Mat.det();
      if(iDet==0) {
         return null;
      }
      return this.mult(Mat.inverse());
   },
   isRotation:function () {
      return this.Mult(this.transpose()).isUnite();
   }
});