const state = { data: null, notes: '', view: 'scenarios', filter: '全部', query: '' };

const labels = {
  scenarios: ['01 / SPEAKING', '场景口语', '从最常遇到的对话开始。'],
  grammar: ['02 / GRAMMAR', '语法速查', '只记开口时最常用的句型。'],
  notes: ['03 / MY NOTES', '我的原始笔记', '完整保留你提供的资料，方便查阅。'],
  resources: ['04 / RESOURCES', '练习资料', '打开原站，听、看、跟读。']
};

const element = (tag, className, value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
const appendText = (parent, tag, className, value) => {
  const node = element(tag, className, value);
  parent.append(node);
  return node;
};
const matches = (...parts) => parts.join(' ').toLocaleLowerCase().includes(state.query.toLocaleLowerCase());

function speak(text) {
  if (!('speechSynthesis' in window)) {
    window.alert('当前浏览器不支持语音朗读。');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.lang === 'en-US') || voices.find(voice => voice.lang.startsWith('en')) || null;
  window.speechSynthesis.speak(utterance);
}

function speakButton(text) {
  const button = element('button', 'speak', '▶');
  button.type = 'button';
  button.setAttribute('aria-label', `朗读：${text}`);
  button.title = '朗读英文';
  button.addEventListener('click', () => speak(text));
  return button;
}

function renderScenario(item, index) {
  const card = element('article', 'card');
  const head = element('div', 'card-header');
  const titleWrap = element('div');
  appendText(titleWrap, 'span', 'card-index', `NOTE ${String(index + 1).padStart(2, '0')}`);
  appendText(titleWrap, 'h3', '', item.title);
  appendText(titleWrap, 'p', 'card-intro', item.intro);
  head.append(titleWrap, element('span', 'card-tag', item.tag));
  card.append(head);

  const list = element('div', 'phrase-list');
  for (const phrase of item.phrases) {
    const row = element('div', 'phrase');
    const words = element('div');
    appendText(words, 'p', 'phrase-en', phrase.en);
    appendText(words, 'p', 'phrase-zh', phrase.zh);
    row.append(words, speakButton(phrase.en));
    list.append(row);
  }
  card.append(list);

  const practice = element('div', 'practice-box');
  appendText(practice, 'span', 'practice-label', 'IN CONVERSATION / 对话');
  const dialogue = element('div', 'dialogue');
  for (const line of item.dialogue) {
    const row = element('div', 'dialogue-line');
    appendText(row, 'span', 'dialogue-role', line.role);
    const body = element('div');
    appendText(body, 'p', '', line.en);
    appendText(body, 'small', '', line.zh);
    row.append(body);
    dialogue.append(row);
  }
  practice.append(dialogue);
  const prompt = element('p', 'say-line');
  appendText(prompt, 'strong', '', '轮到你说：');
  prompt.append(document.createTextNode(item.say));
  practice.append(prompt);
  card.append(practice);
  return card;
}

function renderGrammar(item) {
  const card = element('article', 'card grammar-card');
  const left = element('div');
  appendText(left, 'h3', '', item.title);
  appendText(left, 'div', 'grammar-pattern', item.pattern);
  const right = element('div', 'grammar-main');
  appendText(right, 'p', '', item.when);
  const example = appendText(right, 'p', 'grammar-example', item.example);
  example.append(speakButton(item.example));
  example.querySelector('button').style.cssText = 'display:inline-grid;vertical-align:middle;margin-left:10px;width:28px;height:28px;font-size:12px';
  appendText(right, 'p', 'grammar-translation', item.translation);
  appendText(right, 'p', 'grammar-tip', item.watch);
  card.append(left, right);
  return card;
}

function renderCorrections(items) {
  const card = element('article', 'card');
  appendText(card, 'span', 'card-index', 'FROM MY NOTES');
  appendText(card, 'h3', 'corrections-title', '原笔记里，建议这样说');
  appendText(card, 'p', 'card-intro', '原文仍完整保留在「我的原始笔记」，这里仅列出部分更自然的职场说法。');
  for (const item of items) {
    const row = element('div', 'correction');
    appendText(row, 'span', 'correction-from', item.from);
    appendText(row, 'span', 'correction-arrow', '→');
    appendText(row, 'span', 'correction-to', item.to);
    appendText(row, 'span', 'correction-reason', item.reason);
    card.append(row);
  }
  return card;
}

function renderNotes() {
  const card = element('article', 'card');
  const head = element('div', 'notes-head');
  appendText(head, 'p', '', '以下内容逐字保存自你提供的资料，其中部分表达可能不够自然。可在本页搜索；需要原文件时可直接下载。');
  const link = appendText(head, 'a', 'download', '下载原始笔记 ↗');
  link.href = './content/original-notes.txt';
  link.download = 'original-notes.txt';
  card.append(head);
  const raw = appendText(card, 'pre', 'notes-raw', state.notes);
  if (state.query) {
    const lines = state.notes.split('\n');
    const found = new Set();
    lines.forEach((line, i) => {
      if (line.toLocaleLowerCase().includes(state.query.toLocaleLowerCase())) {
        for (let n = Math.max(0, i - 1); n <= Math.min(lines.length - 1, i + 2); n++) found.add(n);
      }
    });
    raw.textContent = found.size ? [...found].map(i => `${i + 1}  ${lines[i]}`).join('\n') : '原始笔记中没有匹配内容。';
    raw.classList.add('expanded');
  } else {
    const toggle = appendText(card, 'button', 'notes-toggle', '展开全文 ↓');
    toggle.type = 'button';
    toggle.addEventListener('click', () => {
      raw.classList.toggle('expanded');
      toggle.textContent = raw.classList.contains('expanded') ? '收起全文 ↑' : '展开全文 ↓';
    });
  }
  return card;
}

function renderResource(item) {
  const card = element('a', 'card resource-card');
  card.href = item.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  const left = element('div');
  appendText(left, 'h3', '', item.title);
  appendText(left, 'p', '', item.description);
  const right = element('div', 'resource-link');
  appendText(right, 'span', 'resource-level', item.level);
  appendText(right, 'span', '', '打开 ↗');
  card.append(left, right);
  return card;
}

function renderFilters() {
  const target = document.querySelector('#filters');
  target.replaceChildren();
  if (state.view !== 'scenarios') return;
  for (const tag of ['全部', ...new Set(state.data.scenarios.map(item => item.tag))]) {
    const button = element('button', `filter${state.filter === tag ? ' active' : ''}`, tag);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(state.filter === tag));
    button.addEventListener('click', () => { state.filter = tag; render(); });
    target.append(button);
  }
}

function render() {
  if (!state.data) return;
  const [kicker, title, description] = labels[state.view];
  document.querySelector('#section-kicker').textContent = kicker;
  document.querySelector('#section-title').textContent = title;
  document.querySelector('#section-description').textContent = description;
  document.querySelectorAll('.nav-button').forEach(button => {
    const active = button.dataset.view === state.view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  renderFilters();
  const target = document.querySelector('#content');
  target.replaceChildren();
  let count = 0;
  if (state.view === 'scenarios') {
    const items = state.data.scenarios.filter(item =>
      (state.filter === '全部' || state.filter === item.tag) &&
      matches(item.title, item.tag, item.intro, item.say, ...item.phrases.flatMap(p => [p.en, p.zh]))
    );
    items.forEach(item => target.append(renderScenario(item, state.data.scenarios.indexOf(item))));
    count = items.length;
  } else if (state.view === 'grammar') {
    const grammar = state.data.grammar.filter(item => matches(item.title, item.pattern, item.when, item.example, item.translation));
    grammar.forEach(item => target.append(renderGrammar(item)));
    const fixes = state.data.corrections.filter(item => matches(item.from, item.to, item.reason));
    if (fixes.length) target.append(renderCorrections(fixes));
    count = grammar.length + fixes.length;
  } else if (state.view === 'notes') {
    target.append(renderNotes());
    count = state.notes.trimEnd().split('\n').length;
  } else {
    const items = state.data.resources.filter(item => matches(item.title, item.level, item.description));
    items.forEach(item => target.append(renderResource(item)));
    count = items.length;
  }
  if (!target.children.length) appendText(target, 'p', 'empty', '没有找到相关内容，试试更短的关键词。');
  document.querySelector('#section-count').textContent = state.view === 'notes' ? `${count} 行原文` : `${count} 条内容`;
}

document.querySelectorAll('.nav-button').forEach(button => button.addEventListener('click', () => {
  state.view = button.dataset.view;
  state.query = '';
  document.querySelector('#search').value = '';
  render();
  document.querySelector('.library').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
document.querySelector('#search').addEventListener('input', event => {
  state.query = event.target.value.trim();
  render();
});

Promise.all([
  fetch('./content/lessons.json').then(response => { if (!response.ok) throw new Error('lessons'); return response.json(); }),
  fetch('./content/original-notes.txt').then(response => { if (!response.ok) throw new Error('notes'); return response.text(); })
]).then(([data, notes]) => {
  state.data = data;
  state.notes = notes;
  render();
}).catch(() => {
  document.querySelector('#content').replaceChildren(element('p', 'error', '内容加载失败。请刷新页面重试，或通过本地服务器打开本站。'));
});
