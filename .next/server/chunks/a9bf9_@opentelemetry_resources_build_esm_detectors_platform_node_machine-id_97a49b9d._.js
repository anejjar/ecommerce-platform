module.exports=[943959,e=>{"use strict";var i=e.i(233405);let t=e.i(224361).promisify(i.exec);e.s(["execAsync",0,t])},205725,e=>{"use strict";var i=e.i(943959),t=e.i(404065);async function r(){try{let e=(await (0,i.execAsync)('ioreg -rd1 -c "IOPlatformExpertDevice"')).stdout.split("\n").find(e=>e.includes("IOPlatformUUID"));if(!e)return;let t=e.split('" = "');if(2===t.length)return t[1].slice(0,-1)}catch(e){t.diag.debug(`error reading machine id: ${e}`)}}e.s(["getMachineId",()=>r])}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fe304fa7-12fa-5de3-8593-4f3a6b9e2014")}catch(e){}}();
//# sourceMappingURL=a9bf9_%40opentelemetry_resources_build_esm_detectors_platform_node_machine-id_97a49b9d._.js.map
//# debugId=fe304fa7-12fa-5de3-8593-4f3a6b9e2014
