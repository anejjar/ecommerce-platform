module.exports=[943959,e=>{"use strict";var i=e.i(233405);let r=e.i(224361).promisify(i.exec);e.s(["execAsync",0,r])},481266,e=>{"use strict";var i=e.i(522734),r=e.i(943959),t=e.i(404065);async function s(){try{return(await i.promises.readFile("/etc/hostid",{encoding:"utf8"})).trim()}catch(e){t.diag.debug(`error reading machine id: ${e}`)}try{return(await (0,r.execAsync)("kenv -q smbios.system.uuid")).stdout.trim()}catch(e){t.diag.debug(`error reading machine id: ${e}`)}}e.s(["getMachineId",()=>s])}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2c1fd416-97de-5803-8c43-941ae578b4eb")}catch(e){}}();
//# sourceMappingURL=a9bf9_%40opentelemetry_resources_build_esm_detectors_platform_node_machine-id_08771b3b._.js.map
//# debugId=2c1fd416-97de-5803-8c43-941ae578b4eb
