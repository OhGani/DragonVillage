/// <reference lib="webworker" />
import { greedyMesh, transferables } from '../mesh/greedyMesher';
import type { MeshBlockInfo, MesherRequest, MesherResponse } from '../mesh/meshTypes';

let blockInfo: MeshBlockInfo[] = [];

self.onmessage = (e: MessageEvent<MesherRequest>) => {
  const msg = e.data;
  if (msg.type === 'init') {
    blockInfo = msg.blockInfo;
    return;
  }
  const t0 = performance.now();
  const result = greedyMesh(msg.padded, blockInfo, msg.light);
  const ms = performance.now() - t0;
  const res: MesherResponse = { type: 'mesh', jobId: msg.jobId, cx: msg.cx, cy: msg.cy, cz: msg.cz, result, ms };
  (self as unknown as Worker).postMessage(res, transferables(result));
};
