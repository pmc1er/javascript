//------------------------
//---NAVIGATOR------------
//------------------------
PMC.utils.navigator=PMC.utils.navigator || {};
PMC.utils.navigator.dom=(function (){return document.getElementById ? true : false;})();             //Navigateur comprend-il le ID ?
PMC.utils.navigator.ie=(function (){return document.all ? true : false;})();                         //Navigateur est-il IE ?
PMC.utils.navigator.ns4=(function (){return document.layers ? true : false;})();                     //Navigateur est-il netscape 4 ?
PMC.utils.navigator.agt          =window.navigator.userAgent.toLowerCase();
PMC.utils.navigator.is_nav       =(function (){return (PMC.utils.navigator.agt.indexOf('mozilla')!=-1) && (PMC.utils.navigator.agt.indexOf('spoofer')==-1)
   && (PMC.utils.navigator.agt.indexOf('compatible') == -1) && (PMC.utils.navigator.agt.indexOf('opera')==-1)
   && (PMC.utils.navigator.agt.indexOf('webtv')==-1);})();
// detect browser version
// Note: On IE5, these return 4, so use is_ie5up to detect IE5.
PMC.utils.navigator.is_major     =parseInt(window.navigator.appVersion);
PMC.utils.navigator.is_minor     =parseFloat(window.navigator.appVersion);
PMC.utils.navigator.is_ie        =PMC.utils.navigator.agt.indexOf('msie')!=-1;              //Navigateur est-il IE ?
PMC.utils.navigator.is_opera     =(PMC.utils.navigator.agt.indexOf('opera')!=-1);
PMC.utils.navigator.is_safari    =(PMC.utils.navigator.agt.indexOf('safari')!=-1);
PMC.utils.navigator.is_konqueror =(PMC.utils.navigator.agt.indexOf('konqueror')!=-1);
PMC.utils.navigator.is_khtml     =(PMC.utils.navigator.agt.indexOf('khtml')!=-1);
PMC.utils.navigator.is_opera6up  =(PMC.utils.navigator.is_opera && (PMC.utils.navigator.is_major >= 6));
PMC.utils.navigator.is_nav4up    =(PMC.utils.navigator.is_nav && (PMC.utils.navigator.is_major >= 4));
PMC.utils.navigator.is_nav6up    =(PMC.utils.navigator.is_nav && (PMC.utils.navigator.is_major >= 6));
PMC.utils.navigator.is_ie3       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major < 4));
PMC.utils.navigator.is_ie4       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major == 4) && (PMC.utils.navigator.agt.indexOf("msie 5.0")==-1) );
PMC.utils.navigator.is_ie5       =(PMC.utils.navigator.is_ie && (PMC.utils.navigator.is_major == 4) && (PMC.utils.navigator.agt.indexOf("msie 5.0")!=-1) );
PMC.utils.navigator.is_ie5up     =(PMC.utils.navigator.is_ie  && !PMC.utils.navigator.is_ie3 && !PMC.utils.navigator.is_ie4);
PMC.utils.navigator.nav_ok=(PMC.utils.navigator.dom || PMC.utils.navigator.ie || PMC.utils.navigator.ns4) ? true : false; //Navigateur comprend-il le DOM ?
