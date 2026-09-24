const create = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function renderEntry(entry, number) {
  const article = create('article', 'entry');
  const header = create('div', 'entry-header');
  header.append(create('span', 'entry-number', String(number).padStart(3, '0')), create('h2', '', entry.term));
  const body = create('div', 'entry-body');
  body.append(create('p', 'definition', entry.definition));
  const examples = [...entry.examples];
  if (entry.expandedExample && !entry.expandedExample.startsWith('Use this complete sentence')) examples.push(entry.expandedExample);
  if (examples.length) {
    body.append(create('p', 'examples-label', examples.length === 1 ? 'Example' : 'Examples'));
    const list = create('ul', 'examples');
    examples.forEach(example => list.append(create('li', '', example)));
    body.append(list);
  }
  if (entry.originalForms.length) {
    body.append(create('p', 'original', `Original wording: ${entry.originalForms.join(' / ')}`));
  }
  if (entry.note) body.append(create('p', 'usage-note', entry.note));
  article.append(header, body);
  return article;
}

function renderResource(item) {
  const link = create('a', 'resource');
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.append(create('strong', '', `${item.title} ↗`), create('p', '', item.description));
  return link;
}

Promise.all([
  fetch('./content/notes.json').then(response => { if (!response.ok) throw new Error('notes'); return response.json(); }),
  fetch('./content/resources.json').then(response => { if (!response.ok) throw new Error('resources'); return response.json(); })
]).then(([notes, resources]) => {
  document.getElementById('notes').replaceChildren(...notes.map((entry, index) => renderEntry(entry, index + 1)));
  document.getElementById('resources').replaceChildren(...resources.map(renderResource));
}).catch(() => {
  document.getElementById('notes').replaceChildren(create('p', 'status', 'The notes could not be loaded. Please refresh the page.'));
});
