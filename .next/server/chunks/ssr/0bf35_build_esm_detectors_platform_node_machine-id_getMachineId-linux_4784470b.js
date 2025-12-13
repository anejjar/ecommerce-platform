
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="dd14bf94-f61c-595a-bff9-258541da1241")}catch(e){}}();
module.exports=[436595,a=>{"use strict";var b=a.i(522734),c=a.i(118304);async function d(){for(let a of["/etc/machine-id","/var/lib/dbus/machine-id"])try{return(await b.promises.readFile(a,{encoding:"utf8"})).trim()}catch(a){c.diag.debug(`error reading machine id: ${a}`)}}a.s(["getMachineId",()=>d])}];

//# sourceMappingURL=0bf35_build_esm_detectors_platform_node_machine-id_getMachineId-linux_4784470b.js.map
//# debugId=dd14bf94-f61c-595a-bff9-258541da1241
