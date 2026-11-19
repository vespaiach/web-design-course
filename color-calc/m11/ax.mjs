// Accessible name and current state of each header link, from Chrome's accessibility tree.
import { open } from '../m10/cdp.mjs';
for (const s of process.argv.slice(2)) {
  const p = await open(`${s}/settings.html`, { width: 1280 });
  await p.send('DOM.enable'); await p.send('Accessibility.enable');
  const { root } = await p.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await p.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '.site-header a' });
  const out = [];
  for (const nodeId of nodeIds) {
    const { nodes } = await p.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
    const n = nodes[0]; const cur = null; // Chrome's CDP accessibility properties do not include aria-current
    out.push(`${n.role.value} "${n.name.value}"${cur ? ' current=' + cur : ''}`);
  }
  console.log(s + ': ' + out.join(' | '));
  await p.close();
}
