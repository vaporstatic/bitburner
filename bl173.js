/** @param {NS} ns **/


export async function main(ns) {
  ns.ui.openTail("bl173.js"); //monitor script progress
  // This script targets any server in targetlist for hacking. It will crack those in the target list, then set up all
  //available servers in the servs list to hack those servers. x.js should be your hack/grow/weaken scripts.

  // Script divider variable. Integer value should equal the number of targets in the targetlist. This is to dedicate equal portions of ram to each script running.

  var hacklvl = ns.getHackingLevel(); //current Hack level so script does not target/use servers you cannot gain root on.
  //memory dividers need to be adjusted so the script divides into the available ram evenly. General rule is available 
  //ram/script cost, but it does not always divide evenly.
  var hackscript = "x.js";
  var pmemdiv = ns.getScriptRam(hackscript); //private server ram divider
  var hmemdiv = ns.getScriptRam(hackscript); //home computer ram divider
  var memdiv = ns.getScriptRam(hackscript); //public server ram divider
  var tfile = "targs.txt"; //target file
  var sfile = "servs.txt"; //server file

  /////////// Sets divider variable automatically based on number of targets in txt.
  var div = 0;
  var filect = ns.read(tfile).split(',\r\n');
  for (var ee = 1; ee < filect.length - 1; ++ee) {
    div++;
  }
  ns.tprint("filect " + filect.length);
  ns.tprint("check " + div);

  ///////////////////////////////////////////////////////////////////////////////
  //setup home

  var hserv = "home";
  ns.scriptKill(hackscript, hserv);
  var maxram = ns.getServerMaxRam(hserv);
  var usedram = ns.getServerUsedRam(hserv);
  var availram = ns.formatNumber(maxram - usedram, "0a");
  ns.tprint("Home Max Ram: " + maxram);
  ns.tprint("Home Used Ram: " + usedram);
  ns.tprint("Home Avail Ram: " + availram);
  ns.tprint("Home Memory Divider: " + hmemdiv);
  var threads = ns.formatNumber((availram / div) / hmemdiv, "0a");
  ns.tprint("Threads: " + threads);



  var tservs = ns.read(tfile).split(',\r\n');
  for (var i = 1; i < tservs.length - 1; ++i) {
    var t1 = tservs[i].split(',');
    var target = t1.toString();
    ns.tprint("Target " + target + " Max Money: $" + ns.formatNumber(ns.getServerMaxMoney(target), '0.00a'));
    ns.exec(hackscript, hserv, threads, target);

  }



  //count how many exes we have
  var execount = 0;
  if (ns.fileExists("BruteSSH.exe")) {
    ++execount
  }
  if (ns.fileExists("FTPCrack.exe")) {
    ++execount
  }
  if (ns.fileExists("HTTPWorm.exe")) {
    ++execount
  }
  if (ns.fileExists("relaySMTP.exe")) {
    ++execount
  }
  if (ns.fileExists("SQLInject.exe")) {
    ++execount
  }

  ns.tprint("You have " + execount + " port openers."); //How many exe's do I have?

  //crack target servers
  var tservs = ns.read(tfile).split(',\r\n');
  for (var i = 1; i < tservs.length - 1; ++i) {

    var t1 = tservs[i].split(',');
    var target = t1.toString();
    ns.tprint("Target: " + target);


    if (!ns.hasRootAccess(target) && ns.getServerRequiredHackingLevel(target) <= hacklvl) {
      if (ns.fileExists("BruteSSH.exe")) {
        ns.brutessh(target);
      }
      if (ns.fileExists("FTPCrack.exe")) {
        ns.ftpcrack(target);
      }
      if (ns.fileExists("HTTPWorm.exe")) {
        ns.httpworm(target);
      }
      if (ns.fileExists("relaySMTP.exe")) {
        ns.relaysmtp(target);
      }
      if (ns.fileExists("SQLInject.exe")) {
        ns.sqlinject(target);
      }
      if (ns.getServerNumPortsRequired(target) <= execount) {
        ns.nuke(target);
      } else (ns.tprint("Cannot NUKE " + target + " : Cannot open the needed # of ports."))
    }
  }


  //code to kill all running scripts on all public servers. steps through servs.txt.

  var servs = ns.read(sfile).split(',\r\n');
  for (var e = 1; e < servs.length - 1; ++e) {
    var s1 = servs[e].split(',');
    var serv = s1.toString();
    ns.tprint(serv);
    ns.killall(serv);
  }
  //crack slave public servers
  ////////////////////////////////////////////////////////////////////////////////////////////////
  var servs = ns.read(sfile).split(',\r\n');
  for (var j = 1; j < servs.length - 1; ++j) {
    var s1 = servs[j].split(',');
    var serv = s1.toString();
    if (!ns.hasRootAccess(serv) && ns.getServerRequiredHackingLevel(serv) <= hacklvl) { //make sure you can hack this server if you haven't already

      if (ns.fileExists("BruteSSH.exe")) {
        ns.brutessh(serv);
      } else (ns.tprint("BruteSSH.exe does not exist."));
      if (ns.fileExists("FTPCrack.exe")) {
        ns.ftpcrack(serv);
      } else (ns.tprint("FTPCrack.exe does not exist."));
      if (ns.fileExists("HTTPWorm.exe")) {
        ns.httpworm(serv);
      } else (ns.tprint("HTTPWorm.exe does not exist."));
      if (ns.fileExists("relaySMTP.exe")) {
        ns.relaysmtp(serv);
      } else (ns.tprint("relaySMTP.exe does not exist."));
      if (ns.fileExists("SQLInject.exe")) {
        ns.sqlinject(serv);
      } else (ns.tprint("SQLInject.exe does not exist."));

      if (ns.getServerNumPortsRequired(serv) <= execount) {
        ns.nuke(serv);
      } else (ns.tprint("Cannot NUKE " + target + " : Cannot open the needed # of ports."))
    }
  }

  //copies and executes x scripts on servers in list
  var servs = ns.read(sfile).split(',\r\n');
  var tservs = ns.read(tfile).split(',\r\n');
  for (var z = 1; z < servs.length - 1; ++z) {

    var s1 = servs[z].split(',');
    var serv = s1.toString();
    var maxram = ns.getServerMaxRam(serv);
    var usedram = ns.getServerUsedRam(serv);
    var availram = maxram - usedram;
    var threads = ns.formatNumber((availram / div) / memdiv, "0a");



    await ns.scp(sfile, serv);
    await ns.scp(tfile, serv);

    if (ns.hasRootAccess(serv) && ns.getServerMaxRam(serv) > 0) { //already root? install and run scripts if the server has more than 0gb of ram.
      for (var o = 0; o < div; ++o) {

        for (var i = 1; i < tservs.length - 1; ++i) {
          var t1 = tservs[i].split(',');
          var target = t1.toString();

          await ns.scp(hackscript, serv);
          ns.exec(hackscript, serv, threads, target);
        }
      }

    }
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  var pcount = 0; //counter for private servers purchased as the for loops go through.
  var pservs = ns.getPurchasedServers();
  for (var r = 0; r < pservs.length; ++r) {
    pcount = r + 1;
  }

  ns.tprint("You have " + pcount + " private servers.");


  if (pcount > 0) {
    //code to kill all running scripts on all player servers. Assumes you have the max of 25 already.
    var pservs = ns.getPurchasedServers();
    for (var int = 0; int < pservs.length; ++int) {
      var pserv = pservs[int];
      ns.killall(pserv);
    }

    //code to start copying hack scripts to private servers.
    ////////////////////////////////////////////////////////////////////////////////////////////////

    var pservs = ns.getPurchasedServers();
    for (var int = 0; int < pservs.length; ++int) {

      var pserv = pservs[int];
      var maxram = ns.getServerMaxRam(pserv);
      var usedram = ns.getServerUsedRam(pserv);
      var availram = maxram - usedram;
      var threads = ns.formatNumber((availram / div) / pmemdiv, "0a");

      for (var z = 0; z < div; ++z) {

        for (var i = 1; i < tservs.length - 1; ++i) {
          var t1 = tservs[i].split(',');
          var target = t1.toString();

          await ns.scp(hackscript, pserv);
          await ns.scp(sfile, pserv);
          await ns.scp(tfile, pserv);
          ns.exec(hackscript, pserv, threads, target);
        }
      }
    }
  } else (ns.tprint("NO PRIV SERVS PURCHASED"))

  ns.toast("bl173 finished running!");

}
