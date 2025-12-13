
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ef105e89-fc8e-5a51-a91b-0aa9e6a0e835")}catch(e){}}();
module.exports=[968246,e=>{"use strict";var i=e.i(522734),r=e.i(404065);async function a(){for(let e of["/etc/machine-id","/var/lib/dbus/machine-id"])try{return(await i.promises.readFile(e,{encoding:"utf8"})).trim()}catch(e){r.diag.debug(`error reading machine id: ${e}`)}}e.s(["getMachineId",()=>a])}];

//# sourceMappingURL=0bf35_build_esm_detectors_platform_node_machine-id_getMachineId-linux_716f33e7.js.map
//# debugId=ef105e89-fc8e-5a51-a91b-0aa9e6a0e835
