// Run: node ax.mjs <signup.html>. Output in ax-output.txt.
// Prints Chrome's accessible name, description and invalid state of each field, before and after a submit attempt.
import { open } from './cdp.mjs';
const p = await open(process.argv[2]);
await p.send('DOM.enable'); await p.send('Accessibility.enable');
const dump = async (label) => {
  console.log('--', label);
  const { root } = await p.send('DOM.getDocument', { depth: -1 });
  for (const id of ['name', 'email', 'username', 'password', 'terms']) {
    const { nodeId } = await p.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#' + id });
    const { nodes } = await p.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
    const n = nodes[0]; const prop = (k) => n.properties?.find((x) => x.name === k)?.value.value;
    console.log(id.padEnd(9), JSON.stringify(n.name?.value), '| desc:', JSON.stringify(n.description?.value ?? ''), '| invalid:', prop('invalid'), '| required:', prop('required'));
  }
};
await dump('page loaded');
await p.ev('document.querySelector("form").requestSubmit()');
await new Promise((r) => setTimeout(r, 300));
await dump('after a submit attempt with every field empty');
await p.close();
