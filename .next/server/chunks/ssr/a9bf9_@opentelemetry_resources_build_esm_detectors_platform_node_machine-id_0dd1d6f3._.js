module.exports=[449478,a=>{"use strict";var b=a.i(233405);let c=a.i(224361).promisify(b.exec);a.s(["execAsync",0,c])},284598,a=>{"use strict";var b=a.i(449478),c=a.i(118304);async function d(){try{let a=(await (0,b.execAsync)('ioreg -rd1 -c "IOPlatformExpertDevice"')).stdout.split("\n").find(a=>a.includes("IOPlatformUUID"));if(!a)return;let c=a.split('" = "');if(2===c.length)return c[1].slice(0,-1)}catch(a){c.diag.debug(`error reading machine id: ${a}`)}}a.s(["getMachineId",()=>d])}];

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="09c473e2-0ffa-5daf-9ca3-91c5d4956d7a")}catch(e){}}();
//# sourceMappingURL=a9bf9_%40opentelemetry_resources_build_esm_detectors_platform_node_machine-id_0dd1d6f3._.js.map
//# debugId=09c473e2-0ffa-5daf-9ca3-91c5d4956d7a
