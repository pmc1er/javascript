//------------------------
//---PLATFORM-------------
//------------------------
PMC.utils.Platform = PMC.utils.Platform || {};
Object.merge(PMC.utils.Platform,{
   is_win      :(  (PMC.utils.navigator.agt.indexOf("win")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("16bit")!=-1)
                ),
   is_mac      :(PMC.utils.navigator.agt.indexOf("mac")!=-1),
   is_sun      :(PMC.utils.navigator.agt.indexOf("sunos")!=-1),
   is_irix     :(PMC.utils.navigator.agt.indexOf("irix") !=-1),
   is_hpux     :(PMC.utils.navigator.agt.indexOf("hp-ux")!=-1),
   is_aix      :(PMC.utils.navigator.agt.indexOf("aix") !=-1),
   is_linux    :(PMC.utils.navigator.agt.indexOf("inux")!=-1),
   is_sco      :( (PMC.utils.navigator.agt.indexOf("sco")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("unix_sv")!=-1)
                ),
   is_unixware :(PMC.utils.navigator.agt.indexOf("unix_system_v")!=-1),
   is_mpras    :(PMC.utils.navigator.agt.indexOf("ncr")!=-1),
   is_reliant  :(PMC.utils.navigator.agt.indexOf("reliantunix")!=-1),
   is_dec      :( (PMC.utils.navigator.agt.indexOf("dec")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("osf1")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("dec_alpha")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("alphaserver")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("ultrix")!=-1) ||
                  (PMC.utils.navigator.agt.indexOf("alphastation")!=-1)
               ),
   is_sinix    :(PMC.utils.navigator.agt.indexOf("sinix")!=-1),
   is_freebsd  :(PMC.utils.navigator.agt.indexOf("freebsd")!=-1),
   is_bsd      :(PMC.utils.navigator.agt.indexOf("bsd")!=-1)
});

PMC.utils.Platform.is_unix=(
   (PMC.utils.navigator.agt.indexOf("x11")!=-1) ||
   (PMC.utils.Platform.is_sun) ||
   (PMC.utils.Platform.is_irix) ||
   (PMC.utils.Platform.is_hpux) ||
   (PMC.utils.Platform.is_sco) ||
   (PMC.utils.Platform.is_unixware) ||
   (PMC.utils.Platform.is_mpras) ||
   (PMC.utils.Platform.is_reliant) ||
   (PMC.utils.Platform.is_dec) ||
   (PMC.utils.Platform.is_sinix) ||
   (PMC.utils.Platform.is_aix) ||
   (PMC.utils.Platform.is_linux) ||
   (PMC.utils.Platform.is_bsd) ||
   (PMC.utils.Platform.is_freebsd)
);