(function() {
var UploadFiles=function() {
   totalSize = 0;
   totalProgress = 0;
   var url="";
   var folder="";
   var divProgress="";
   var list=[];

   // à la fin, traiter le fichier suivant
   var CompleteFile=function (file, response) {
      //this.totalProgress += file.size;
      PMC.Element.removeClass(file.dom, "begin");
      PMC.Element.addClass(file.dom, "end");
      uploadNext();
      return;
   };
   var Complete;
   var startUpload=function() {
      return;
   };
   var startUploadFile=function(file) {
      PMC.Element.addClass(file.dom, "begin");
      return;
   };
   var setStyleProgression=function(file, data) {
      PMC.Element.setStyle(file.dom.getElementsByTagName("div")[0], data);
      return;
   };
   var uploadProgress=function(file, e) {
      var size=e.loaded;
      totalProgress=size;
      setStyleProgression(file, {"width":(totalProgress*100/totalSize)+"%"});
      return;
   };
   var uploadNext = function() {
      if (list.length) {
         var nextFile = list.shift();
         uploadFile.call(this, nextFile, status);
      }
      else {
         if(Complete) {
            Complete();
         }
      }
      return;
   };

   var uploadFile=function(file, status) {
      var formData = new FormData();
      formData.append('myfile', file);
      formData.append('folder', folder);
      PMC.xhr.post(url
                        , {"uploadStart":startUploadFile.bind(this, file), "uploadProgress":uploadProgress.bind(this, file), "complete":CompleteFile.bind(this, file), "start":startUpload.bind(this)}
                        , formData
                        , [{"isUpload":true}]
      );
      return;
   };

   this.transfert=function(myUrl, myFolder, fileList, myProgress, fncComplete) {
      url=myUrl;
      divProgress=myProgress;
      folder=myFolder;
      if(fncComplete) {
         Complete=fncComplete;
      }
      PMC.utils.forEach(fileList, function(file) {
         var dd=PMC.DOM.create(divProgress, "dd", {"id":file.name.encode64()});
         totalSize+=file.size;
         dd.appendChild(document.createTextNode(file.name));
         var f=PMC.DOM.create(dd,"span", {"class":"size"});
         f.appendChild(document.createTextNode(" ("+PMC.utils.getSize(file.size)+")"));
         var lnk=PMC.DOM.create(dd, "a", {"href":"javascript:void(0)", "title":"Supprimer", "class":"delete floatright"});
         PMC.DOM.create(lnk, "i", {"class":"far fa-trash-alt"});
         PMC.Event.add(lnk, "click", function(e) {PMC.Event.returnFalse(e);dd.parentNode.removeChild(dd);});
         PMC.DOM.create(dd, "div", {"class":"progression"});
         file.dom=dd;
         list.push(file);
      });
      //progress=PMC.DOM.create(divProgress, "dd", {"class":"progression"});
      //PMC.DOM.create(progress, "div", {"style":"width:0%"});
      uploadNext.apply(this);
      return;
   };
};
//Sert pour le tri des fichiers
var Files=function() {
   var liste;
   this.get=function() {
      return liste;
   };
   this.add=function(fileList) {
      liste=fileList;
      return this;
   };
   this.sort=function(name, order) {
      if(!order) {
         order=0;
      }
      var aTmp=[];
      var a="", b="";
      for(var i=0;i<liste.length;i++) {

         b=liste[i][name];
         j=0;
         var bFound=false;
         while((j<aTmp.length) && !bFound) {
            a=aTmp[j][name];
            if(a.isUpper) {
               if((order==0 && a.isUpper(b)) || (order>0 && !a.isUpper(b)))
                  bFound=true;
               else
                  j++;
            }
            else {
               if((order==0 && a>b) || (order>0 && a<b))
                  bFound=true;
               else {
                  j++;
               }
            }
         }
         aTmp.insertBefore(j, liste[i]);
      }
      return aTmp;
   };
};
var TreeviewRoot=(function() {
   var instance=null;
   var constructeur=function() {
      var sepFiles="\"";
      var racine;
      var selected;
      var gidFiles;
      var selectedFiles=[];
      var isDroppedFromSelected=false;
      var isRotate=false;
      var evtTimeOut=0;
      var elemToRotate;
      var progress;
      var contextMenu;
      var listUrl;
      //Droits d'accès sur les répertoires
      var droits={"create":false, "update":false, "delete":false};
      this.getDroits=function() {
         return arguments.length>0 && droits[arguments[0]]!=undefined ? droits[arguments[0]] : droits;
      };
      //Est-ce qu'on créé le context menu
      this.hasContextMenu=function() {
         return droits.create || droits.update || droits.delete;
      };
      this.getProgress=function(){
         return progress;
      };
      var rotate=function() {
         if(isRotate) {
            if(elemToRotate.style && elemToRotate.style.transform) {
               var i=parseInt(elemToRotate.style.transform.after("rotate(").before("deg"));
               elemToRotate.style.transform="rotate("+(i+10)+"deg)";
            }
            else {
               elemToRotate.style.transform="rotate(10deg)";
            }
            if(isRotate) {
               evtTimeOut=setTimeout(rotate, 30);
            }
         }
         return;
      };
      var stopRotate=function() {
         isRotate=false;
         clearTimeout(evtTimeOut);
         return;
      };
      this.getUrl=function(id) {
         return listUrl[id] ? listUrl[id] : null;
      };
      this.initialize=function(rep, rootFolder, rootFiles, myUrl, fctDrawFiles, divProgress, myDroits) {
         for(var i in myDroits) {
            droits[i]=myDroits[i];
         }
         listUrl=myUrl;
         racine=rep;
         progress=divProgress;
         if(racine[racine.length-1]!="/") {
            racine+="/";
         }
         var t=new Treeview(racine);
         t.Treeview=null;
         t.setRootFolder(rootFolder);
         t.setRootFiles(rootFiles);
         if(fctDrawFiles) {
            t.setSpecificDrawFiles(fctDrawFiles);
         }
         t.expand();
         PMC.Event.add(PMC.utils.$("refreshFiles"), "click", function(e) {selected.refreshFiles();});
         PMC.Event.add(PMC.utils.$("refreshFolders"), "click", function(e) {selected.refreshFolders();});
         PMC.Event.add(PMC.utils.$("refreshFiles"), "mouseover", function(e) {if(!isRotate) {isRotate=true;var elem=PMC.Event.element(e);elemToRotate=elem.nodeName.toLowerCase()=="a" ? elem.getElementsByTagName("i")[0] : elem;rotate();}});
         PMC.Event.add(PMC.utils.$("refreshFiles"), "mouseout", stopRotate);
         PMC.Event.add(PMC.utils.$("refreshFolders"), "mouseover", function(e) {if(!isRotate) {isRotate=true;var elem=PMC.Event.element(e);elemToRotate=elem.nodeName.toLowerCase()=="a" ? elem.getElementsByTagName("i")[0] : elem;rotate();}});
         PMC.Event.add(PMC.utils.$("refreshFolders"), "mouseout", stopRotate);
         return this;
      };
      var Treeview=function(rep) {
         var specificDrawFiles;
         this.getRoot=function() {
            return (this.parent==null) ? this : this.parent.getRoot();
         };
         this.gid=null;
         //this.gidFiles=null;
         this.parent=null;
         this.repertoire=rep;
         this.hasSubfolder=true;
         this.isExpanded=false;
         this.files=new Files();
         this.folders=[];
         var context=function(oElem) {
            var callback=function(param, retXHR) {
               if(retXHR.retour) {
                  this.refreshFolders();
               }
               else {
                  var msg="";var title=null;
                  switch(param) {
                     case "create":
                        msg="Une erreur s'est produite lors de la création du répertoire";
                        title="Création d'un répertoire";
                        break;
                     case "update":
                        msg="Une erreur s'est produite lors de la modification du répertoire";
                        title="Modification d'un répertoire";
                        break;
                     case "delete":
                        msg="Une erreur s'est produite lors de la suppression du répertoire";
                        title="Suppression d'un répertoire";
                        break;
                     default:
                        msg="Une erreur s'est produite lors de l'action "+param;
                        title="Erreur";
                        break;
                  }
                  alert(msg, title);
               }
               return;
            };
            var createFolder=function(e) {
               PMC.Event.returnFalse(e);
               var send=function(folder) {
                  if(folder) {
                     PMC.xhr.post(TreeviewRoot.getInstance().getUrl("createFolder"), callback.bind(this, "create"), ["root="+this.repertoire.encode64(),"folder="+folder.encode64()]);
                  }
                  else {
                     alert("Merci de remplir un nom de répertoire valide !", "Création d'un répertoire");
                  }
                  return;
               };
               prompt("Nom du répertoire :", "Création d'un répertoire", send.bind(this));
               return;
            };
            var updateFolder=function(e) {
               PMC.Event.returnFalse(e);
               var send=function(folder) {
                  if(folder) {
                     PMC.xhr.post(TreeviewRoot.getInstance().getUrl("renameFolder"), callback.bind(this, "update"), ["root="+this.repertoire.encode64(),"folder="+folder.encode64()]);
                  }
                  else {
                     alert("Merci de remplir un nom de répertoire valide !", "Modification d'un répertoire");
                  }
                  return;
               };
               prompt("Nom du répertoire :", "Modification d'un répertoire", send.bind(this));
               return;
            };
            var deleteFolder=function(e) {
               PMC.Event.returnFalse(e);
               var send=function() {
                  PMC.xhr.post(TreeviewRoot.getInstance().getUrl("deleteFolder"), callback.bind(this, "update"), ["root="+this.repertoire.encode64()]);
               };
               confirm("Voulez-vous supprimer le répertoire \""+this.repertoire+"\" ?", "Suppression d'un répertoire", send.bind(this));
               return;
            };

            if(contextMenu) {
               contextMenu.remove();
            }
            if(TreeviewRoot.getInstance().hasContextMenu()) {
               contextMenu=PMC.DOM.create(oElem, "div", {"id":"contextMenu"});
               var ul=PMC.DOM.create(contextMenu, "ul");
               var lnk;
               if(TreeviewRoot.getInstance().getDroits("create")) {
                  var lnk=PMC.DOM.create(PMC.DOM.create(ul, "li"), "a", {"href":"javascript:void(0)", "title":"Créer un répertoire sous \""+this.repertoire+"\""});
                  PMC.DOM.create(lnk, "i", {"class":"fa fa-plus-circle"});
                  lnk.appendChild(document.createTextNode("Créer un répertoire"));
                  PMC.Event.add(lnk, "click", createFolder.bind(this));
               }
               if(this.parent) {
                  if(TreeviewRoot.getInstance().getDroits("update")) {
                     lnk=PMC.DOM.create(PMC.DOM.create(ul, "li"), "a", {"href":"javascript:void(0)", "title":"Modifier le nom du répertoire \""+this.repertoire+"\""});
                     PMC.DOM.create(lnk, "i", {"class":"fa fa-edit edition"});
                     lnk.appendChild(document.createTextNode("Modifier le nom du répertoire"));
                     PMC.Event.add(lnk, "click", updateFolder.bind(this));
                  }
                  if(TreeviewRoot.getInstance().getDroits("delete")) {
                     lnk=PMC.DOM.create(PMC.DOM.create(ul, "li"), "a", {"href":"javascript:void(0)", "title":"Suppprimer le répertoire \""+this.repertoire+"\""});
                     PMC.DOM.create(lnk, "i", {"class":"far fa-trash-alt delete"});
                     lnk.appendChild(document.createTextNode("Suppprimer le répertoire \""+this.repertoire+"\""));
                     PMC.Event.add(lnk, "click", deleteFolder.bind(this));
                  }
               }
               PMC.Element.moveTo(contextMenu, (PMC.Mouse.posX-10)+"px", (PMC.Mouse.posY-10)+"px");
               PMC.Event.add(contextMenu, "mouseover", function(e) {
                  PMC.Element.show(contextMenu);return;
               });
               PMC.Event.add(contextMenu, "mouseout", function(e) {
                  PMC.Element.hide(contextMenu);return;
               });
            }
            return;
         };
         this.name=function() {
            var tmp=this.repertoire.split("/");
            return tmp[tmp.length-2];
         };
         this.setSpecificDrawFiles=function(fct) {
            if(fct) {
               specificDrawFiles=fct;
            }
            return;
         };
         this.setRootFolder=function(id) {
            this.gid=id;
            return this;
         };
         this.setRootFiles=function(id) {
            gidFiles=id;
            return this;
         };
         var clickFolder=function(e) {
            selectedFiles=[];
            if(e) {
               PMC.Event.returnFalse(e);
            }
            if(selected) {
               PMC.Element.removeClass(selected.gid.getElementsByTagName("span")[0], "selected");
            }
            selected=this;
            PMC.Element.addClass(this.gid.getElementsByTagName("span")[0], "selected");
            if(this.files.length>0) {
               drawFiles.apply(this);
            }
            else {
               PMC.DOM.removeChildren(gidFiles, "div");
               var div=PMC.DOM.create(gidFiles, "div");
               PMC.DOM.create(div, "img", {"src":PMC.Config.img+"loading.gif"});
               div.appendChild(document.createTextNode("Chargement en cours"));

               var t=this;
               var afterXHR=function(retXHR) {
                  if(retXHR.error || retXHR.nodroit) {
                     alert(retXHR.error || retXHR.nodroit, "Récupérer la liste des fichiers");
                  }
                  else {
                     t.files.add(retXHR.files);
                     drawFiles.apply(t);
                  }
               };
               PMC.xhr.post(TreeviewRoot.getInstance().getUrl("list"), afterXHR, "r="+this.repertoire);
            }
            return;
         };
         var drawFiles=function(oldSort, newSort, asc) {
            var t=this;
            if(oldSort==undefined) {
               oldSort="name";
            }
            if(newSort==undefined) {
               newSort="name";
            }
            if(asc==undefined) {
               asc=1;
            }
            asc=(oldSort==newSort) ? 1-asc : 0;
            if(specificDrawFiles) {
               t.racine=racine;
               t.selected=selected;
               t.gidFiles=gidFiles;
               t.selectedFiles=selectedFiles;
               specificDrawFiles.call(t, oldSort, newSort, asc);
               return;
            }
            PMC.DOM.removeChildren(gidFiles, "div");
            PMC.DOM.removeChildren(gidFiles, "table");
            var tbl=PMC.DOM.create(gidFiles, "table", {"class":"legende noborder"});
            var thead=PMC.DOM.create(tbl, "thead");
            var tr=PMC.DOM.create(thead, "tr");
            var td=PMC.DOM.create(tr, "th");
            td.appendChild(document.createTextNode("Nom"));
            PMC.DOM.create(td, "i", {"class":"sortFile fa-duotone fa-sort-"+(asc==1 && newSort=="name" ? "down" : "up")+(newSort=="name" ? " selected" :"")});
            PMC.Event.add(td, "click", function() {
               drawFiles.call(t, newSort, "name", asc);
            });
            td=PMC.DOM.create(tr, "th");
            td.appendChild(document.createTextNode("Taille"));
            PMC.DOM.create(td, "i", {"class":"sortFile fa-duotone fa-sort-"+(asc==1 && newSort=="size" ? "down" : "up")+(newSort=="size" ? " selected" :"")});
            PMC.Event.add(td, "click", function() {
               drawFiles.call(t, newSort, "size", asc);
            });
            td=PMC.DOM.create(tr, "th");
            td.appendChild(document.createTextNode("Date"));
            PMC.DOM.create(td, "i", {"class":"sortFile fa-duotone fa-sort-"+(asc==1 && newSort=="date" ? "down" : "up")+(newSort=="date" ? " selected" :"")});
            PMC.Event.add(td, "click", function() {
               drawFiles.call(t, newSort, "date", asc);
            });
            td=PMC.DOM.create(tr, "th");
            td.appendChild(document.createTextNode(" "));

            thead=PMC.DOM.create(tbl, "tbody");
            var i=1;
            var addSelectedLigne=function(e) {
               PMC.Event.returnFalse(e);
               var oTR=PMC.DOM.getParent(PMC.Event.element(e),"tr");
               PMC.Element.toggleClass(oTR, "selected", "");
               if(PMC.Element.isClass(oTR, "selected")) {
                  selectedFiles.push(this.name);
                  oTR.draggable=true;
               }
               else {
                  selectedFiles.removeValue(this.name);
                  oTR.draggable=false;
               }
            };
            PMC.utils.forEach(this.files.sort(newSort, asc), function(file) {
               i=1-i;
               tr=PMC.DOM.create(thead, "tr", {"class":"ligne"+i});
               td=PMC.DOM.create(tr, "td", {"class":"fileName"});
               td.appendChild(document.createTextNode(file.name));
               PMC.Event.add(td, "click", addSelectedLigne.bind(file));
               td=PMC.DOM.create(tr, "td", {"class":"fileSize"});
               td.appendChild(document.createTextNode(file.sizeP));
               PMC.Event.add(td, "click", addSelectedLigne.bind(file));
               td=PMC.DOM.create(tr, "td", {"class":"fileDate"});
               td.appendChild(document.createTextNode(file.date));
               PMC.Event.add(td, "click", addSelectedLigne.bind(file));
               td=PMC.DOM.create(tr, "td");
               var lnk=PMC.DOM.create(td, "a", {"href":PMC.Config.fmwk+"files/view.html?q="+(t.repertoire+file.name).encode64(), "title":"Visualiser le contenu du fichier"});
               PMC.DOM.create(lnk, "i", {"class":"fa-duotone fa-eye"});
               lnk=PMC.DOM.create(td, "a", {"href":PMC.Config.fmwk+"files/download.html?q="+(t.repertoire+file.name).encode64(), "title":"Télécharger le fichier"});
               PMC.DOM.create(lnk, "i", {"class":"fa-duotone fa-download"});
               lnk=PMC.DOM.create(td, "a", {"href":PMC.Config.fmwk+"files/delete.html?q="+(t.repertoire+file.name).encode64(), "title":"Supprimer le fichier", "class":"delete"});
               PMC.DOM.create(lnk, "i", {"class":"far fa-trash-alt"});
               var deleteFile=function() {
                  var afterDelete=function(retXHR) {
                     if(retXHR.error || retXHR.nodroit) {
                        alert(retXHR.error || retXHR.nodroit, "Supprimer un fichier");
                     }
                     else {
                        selected.refreshFiles();
                     }
                  };
                  PMC.xhr.post(lnk.href.before("?"), afterDelete.bind(t), lnk.href.after("?"));
               };
               PMC.Event.add(lnk, "click", function(e){PMC.Event.returnFalse(e);confirm("Voulez-vous supprimer ce fichier ?", "Supprimer un fichier", deleteFile);});
               PMC.Event.add(tr, "dragstart", function(e) {e.dataTransfer.clearData();e.dataTransfer.setData("myFiles", selectedFiles.join(sepFiles));});

            });
         };
         this.expand=function(refreshFolder) {
            this.isExpanded=true;
            if(this.folders.length==0 && this.hasSubfolder) {
               var t=this;
               var afterXHR=function(retXHR) {
                  if(t.gid) {
                     PMC.DOM.removeChildren(t.gid, "div");
                  }
                  if(retXHR.error || retXHR.nodroit) {
                     alert(retXHR.error || retXHR.nodroit, "Récupérer la liste des répertoires");
                  }
                  else {
                     PMC.utils.forEach(retXHR.folders, (function(folder) {
                        this.add(this.repertoire, folder);
                        this.files.add(retXHR.files);
                     }).bind(t));
                     t.draw(refreshFolder);
                  }
               };
               if(this.gid) {
                  var tmp=PMC.DOM.create(this.gid, "div", {"class":"folders load"});
                  PMC.DOM.create(tmp, "img", {"src":PMC.Config.img+"loading.gif"});
                  tmp.appendChild(document.createTextNode("Chargement en cours"));
               }
               PMC.xhr.post(TreeviewRoot.getInstance().getUrl("list"), afterXHR, "r="+this.repertoire);
            }
            else {
               this.draw(refreshFolder);
            }
         };
         var addEvents=function(pere, folder) {
               PMC.Event.add(pere, "mousedown", function(e) {isDroppedFromSelected=false;});
               PMC.Event.add(pere, "dragstart", dragStart.bind(folder));
               PMC.Event.add(pere, "dragend", dragEnd.bind(folder));
               PMC.Event.add(pere, "dragover", dragOver.bind(folder, pere));
               PMC.Event.add(pere, "dragenter", dragEnter.bind(folder, pere));
               PMC.Event.add(pere, "dragleave", dragOut.bind(folder, pere));
               PMC.Event.add(pere, "drop", drop.bind(folder, pere));

               PMC.Event.add(pere, "mousedown", function(e) {
                  if(PMC.Event.isRightClick(e)) {
                     PMC.Event.annuleContext(pere);
                     context.call(folder, pere);
                  }
               }, true);
         };
         var dragStart=function(e) {
            e.dataTransfer.clearData();
            e.dataTransfer.setData("myFolder", this.repertoire+sepFiles+this.parent.repertoire);
         };
         var dragEnd=function(e) {
            PMC.Event.returnFalse(e);
         };
         var dragOver=function(elem, e) {
            PMC.Event.returnFalse(e);
         };
         var dragEnter=function(elem, e) {
            //PMC.Event.returnFalse(e);
            PMC.Element.addClass(elem, "dragover");
         };
         var dragOut=function(elem, e) {
            PMC.Event.returnFalse(e);
            PMC.Element.removeClass(elem, "dragover");
         };
         var moveFile=function(source, cible, files, force=false) {
            var ret=[];
            PMC.utils.forEach(files, function(file) {
               ret.push("f[]="+file.encode64());
            });
            var afterMove=function(retXHR) {
               if(retXHR.error || retXHR.nodroit) {
                  alert(ret.error || retXHR.nodroit, "Déplacer des fichiers");
               }
               else {
                  var isRefresh=true;
                  var listeFichier=[];
                  PMC.utils.forEach(retXHR, function(file) {
                     if(!file.res) {
                        isRefresh=false;
                        listeFichier.push(file.file);
                     }
                  });
                  if(isRefresh) {
                     selected.refreshFiles();
                  }
                  else {
                     var afterConfirm=function() {
                        moveFile.call(this, source, cible, listeFichier, true);
                     };
                     PMC.MsgBox.popin("Les fichiers suivants existent dans le répertoire cible, voulez-vous les écraser ?\r\n"+listeFichier.join("\r\n"), "Confirmation avant écrasement", null, {"Oui":afterConfirm.bind(this), "Non":this.refreshFiles.bind(selected)});
                  }
               }
            };
            PMC.xhr.post(TreeviewRoot.getInstance().getUrl("moveFile"), afterMove.bind(this), ret.join("&")+"&source="+source.encode64()+"&cible="+cible.encode64()+"&force="+(force===true ? 1 : 0));
         };
         var moveFolder=function(source, cible, force=false) {
            var afterMove=function(retXHR) {
               if(retXHR.error || retXHR.nodroit) {
                  alert(retXHR.error || retXHR.nodroit, "Déplacer un répertoire");
               }
               else {
                  if(retXHR.res) {
                     selected.refreshFolders();
                  }
                  else {
                     var afterConfirm=function() {
                        moveFolder.call(this, source, cible, true);
                     };
                     confirm("Le répertoire existe dans le répertoire cible.\r\nVoulez-vous l'écraser ?", "Confirmation avant écrasement", afterConfirm.bind(this));
                  }
               }
            };
            PMC.xhr.post(TreeviewRoot.getInstance().getUrl("moveFolder"), afterMove.bind(this), "source="+source.encode64()+"&cible="+cible.encode64()+"&force="+(force===true ? 1 : 0));
         };
         var drop=function(elem, e) {
            PMC.Event.returnFalse(e);
            PMC.Element.removeClass(elem, "dragover");
            //Transfert de fichiers
            if(e.dataTransfer.getData("myFiles").length>0 && selected.repertoire!=this.repertoire) {
               var files=[];
               PMC.utils.forEach(e.dataTransfer.getData("myFiles").split(sepFiles), function(file) {
                  files.push(file);
               });
               moveFile.call(this, selected.repertoire,this.repertoire, files);
            }
            //Déplacer répertoire
            var tmp=e.dataTransfer.getData("myFolder");
            if(tmp.length>0) {
               tmp=tmp.split(sepFiles);
               var folder={"repertoire":tmp[0], "parent":tmp[1]};
               if(folder.repertoire!=this.repertoire && folder.parent!=this.repertoire) {
                  if(folder.repertoire==this.repertoire.substring(0, folder.repertoire.length)) {
                     alert("Vous ne pouvez pas déplacer le répertoire :\r\r\""+folder.repertoire+"\" dans un de ses sous-répertoires !", "Déplacement de répertoire");
                  }
                  else {
                     moveFolder.call(this, folder.repertoire, this.repertoire);
                  }
               }
            }
            //Upload de fichiers
            if (e.dataTransfer.files && e.dataTransfer.files.length>0) {
               var ret=[];
               var dataFiles=e.dataTransfer.files;
               PMC.utils.forEach(dataFiles, function(elem) {
                  ret.push("f[]="+elem.name.encode64());
               });
               var t=this;
               var afterVerif=function(retXHR) {
                  var startUpload=function(repertoire, e) {
                     PMC.utils.$("drop_zone").innerHTML+="<dd>Début upload répertoire "+repertoire+"</dd>";
                  };
                  var afterUpload=function() {
                     t.refreshFiles();
                  };
                  var startUploadFile=function(repertoire, e) {
                     PMC.utils.$("drop_zone").innerHTML+="<dd>Début upload répertoire "+repertoire+"</dd>";
                  };
                  var afterConfirm=function() {
                     var up=new UploadFiles();
                     up.transfert(TreeviewRoot.getInstance().getUrl("upload"), t.repertoire, dataFiles, TreeviewRoot.getInstance().getProgress(), afterUpload);
                  };
                  if(retXHR.error || retXHR.nodroit) {
                     alert(retXHR.error || retXHR.nodroit, "Ajouter des fichiers");
                  }
                  else {
                     if(retXHR.res==0) {
                        var nb=retXHR.files.length;
                        var txtFiles=[];
                        PMC.utils.forEach(retXHR.files, function(elem) {
                           txtFiles.push("- "+elem);
                        });
                        var txt=nb>1 ? "Les fichiers suivants existent déjà dans le répertoire.\r\nVoulez-vous les remplacer ?" : "Le fichier suivant existe déjà dans le répertoire.\r\nVoulez-vous les remplacer ?";
                        confirm(txt+"\r\n"+txtFiles.join("\r\n"), "Ajouter des fichiers", afterConfirm.bind(t));
                     }
                     else {
                        afterConfirm.apply(t);
                     }
                  }
               };
               PMC.xhr.post(TreeviewRoot.getInstance().getUrl("exists"), afterVerif, ret.join("&")+"&cible="+this.repertoire.encode64());
               return;
            }
         };

         this.draw=function(refreshFolder) {
            var tmp;
            var fils=this.gid;
            if(this.parent==null) {
               if(this.gid.getElementsByTagName("dl").length>0) {
                  fils=this.gid.getElementsByTagName("dl")[0];
               }
               else {
                  fils=PMC.DOM.create(this.gid, "dl");
               }
               var oDT=PMC.DOM.create(fils, "dt");
               tmp=PMC.DOM.create(oDT, "i", {"class":"fa-regular fa-folder-open"});
               PMC.Event.add(tmp, "click", clickFolder.bind(this));
               var span=PMC.DOM.create(oDT, "span");
               PMC.Event.add(span, "click", clickFolder.bind(this));
               span.appendChild(document.createTextNode("Home"));
               addEvents(oDT, this);
               clickFolder.apply(this);
            }
            PMC.utils.forEach(this.folders, function(folder) {
               tmp=PMC.DOM.create(fils, "dd", {"class":"folders"});
               folder.gid=PMC.DOM.create(tmp, "dl");
               var oDT=PMC.DOM.create(folder.gid, "dt", {"draggable":true});
               if(refreshFolder && folder.repertoire==refreshFolder.substring(0, folder.repertoire.length)) {
                  folder.isExpanded=true;
               }
               if(folder.hasSubfolder) {
                  var cls=folder.isExpanded ? {"class":"fa-regular fa-square-minus openclose"} : {"class":"fa-regular fa-square-plus openclose"};
                  var exp=PMC.DOM.create(oDT, "i", cls);

                  tmp=PMC.DOM.create(oDT, "i", {"class":folder.isExpanded ? "fa-regular fa-folder-open" : "fa-solid fa-folder"});
                  PMC.Event.add(exp, "click", function(e) {
                     PMC.Event.returnFalse(e);
                     PMC.Element.toggleClass(exp, "fa-square-plus", "fa-square-minus");
                     var fld=exp.parentNode.getElementsByTagName("i")[1];
                     PMC.Element.toggleClass(fld, "fa-regular", "fa-solid");
                     PMC.Element.toggleClass(fld, "fa-folder-open", "fa-folder");
                     if(PMC.Element.isClass(exp, "fa-square-minus")) {
                        folder.expand(refreshFolder);
                     }
                     else {
                        folder.isExpanded=false;
                        PMC.DOM.removeChildren(folder.gid, "div");
                        PMC.DOM.removeChildren(folder.gid, "dd");
                     }
                  });
               }
               else {
                  tmp=PMC.DOM.create(oDT, "i", {"class":"fa-regular fa-folder-open noSubDir"});
               }
               PMC.Event.add(tmp, "click", clickFolder.bind(folder));
               var span=PMC.DOM.create(oDT, "span");
               PMC.Event.add(span, "click", clickFolder.bind(folder));
               span.appendChild(document.createTextNode(folder.name()));
               addEvents(oDT, folder);
               if(folder.isExpanded) {
                  folder.expand(refreshFolder);
               }
               if(refreshFolder && folder.repertoire==refreshFolder) {
                  clickFolder.apply(folder);
               }
            });
         };
         this.add=function(pere, fils, files) {
            var t=new Treeview(this.repertoire+fils.name+'/');
            t.setSpecificDrawFiles(specificDrawFiles);
            t.hasSubfolder=fils.has;
            t.parent=this;
            this.folders.push(t);
         };
         this.refreshFiles=function() {
            selectedFiles=[];
            this.files=new Files();
            clickFolder.apply(this);
         };
         this.refreshFolders=function() {
            var root=selected.getRoot();
            PMC.DOM.removeChildren(root.gid, "div");
            PMC.DOM.removeChildren(root.gid, "dl");
            //PMC.DOM.removeChildren(root.gid, "i");
            //PMC.DOM.removeChildren(root.gid, "span");
            var t=new Treeview(racine);
            t.setSpecificDrawFiles(specificDrawFiles);
            t.setRootFolder(root.gid);
            t.expand(selected.repertoire);
         }
      };
   };
   return new function() {
      this.getInstance=function() {
         if(instance==null) {
            instance=new constructeur();
            instance.initialize.apply(instance, arguments);
         }
         return instance;
      };
   };
})();
PMC.Page.TreeviewPMC=TreeviewRoot.getInstance;
/*
      PMC.Page.Treeview("<?=__REP?>"
         , PMC.utils.$("folders")
         , PMC.utils.$("files")
         , {"list":"files/liste.html", "moveFile":"files/moveFiles.html", "moveFolder":"files/moveFolder.html", "exists":"files/exists.html", "upload":"files/upload.html"
               , "createFolder":"files/createFolder.html", "renameFolder":"files/renameFolder.html", "deleteFolder":"files/deleteFolder.html"
            }
         , null
         , PMC.utils.$("uploadProgress"), <?php
      echo json_encode($hasDroit);
      ?>);

*/
})();

