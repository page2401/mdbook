(function () {
  var DARK_CLASSES = ['navy', 'coal', 'ayu', 'dark'];
  var LIGHT_CLASSES = ['light', 'rust'];
  var isSyncingTheme = false;
  var lastMermaidDark = null;

  function isHtmlDark() {
    var root = document.documentElement;
    var dt = root.getAttribute('data-theme');
    if (dt === 'dark') return true;
    if (dt === 'light') return false;
    for (var i = 0; i < DARK_CLASSES.length; i++) {
      if (root.classList.contains(DARK_CLASSES[i])) return true;
    }
    return false;
  }

  function syncThemeFromDataAttr() {
    var root = document.documentElement;
    var dt = root.getAttribute('data-theme');
    if (dt !== 'dark' && dt !== 'light') return;

    isSyncingTheme = true;
    try {
      if (dt === 'dark') {
        var hasNativeDark =
          root.classList.contains('navy') ||
          root.classList.contains('coal') ||
          root.classList.contains('ayu');
        LIGHT_CLASSES.forEach(function (c) {
          root.classList.remove(c);
        });
        if (!hasNativeDark) {
          root.classList.add('navy');
        }
      } else {
        ['navy', 'coal', 'ayu'].forEach(function (c) {
          root.classList.remove(c);
        });
        if (!root.classList.contains('light') && !root.classList.contains('rust')) {
          root.classList.add('light');
        }
      }
    } finally {
      isSyncingTheme = false;
    }
  }

  function prepareMermaidContainers() {
    var codeBlocks = document.querySelectorAll('pre > code.language-mermaid, code.language-mermaid');
    codeBlocks.forEach(function (codeEl) {
      var pre = codeEl.closest('pre');
      if (!pre || pre.dataset.mermaidPrepared === '1') return;
      var raw = (codeEl.textContent || '').trim();
      if (!raw) return;
      var container = document.createElement('div');
      container.className = 'mdbook-mermaid';
      container.setAttribute('data-mermaid-src', raw);
      pre.replaceWith(container);
    });
  }

  async function renderMermaidDiagrams(force) {
    if (!window.mermaid) return;
    prepareMermaidContainers();
    var containers = document.querySelectorAll('.mdbook-mermaid[data-mermaid-src]');
    if (!containers.length) return;

    var dark = isHtmlDark();
    if (!force && lastMermaidDark === dark && containers[0].querySelector('svg')) {
      return;
    }
    lastMermaidDark = dark;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      securityLevel: 'loose'
    });

    for (var i = 0; i < containers.length; i++) {
      var el = containers[i];
      var src = el.getAttribute('data-mermaid-src');
      if (!src) continue;
      var id = 'mdbook-mermaid-' + Date.now() + '-' + i;
      try {
        var res = await window.mermaid.render(id, src);
        el.innerHTML = res.svg;
      } catch (err) {
        console.error('Mermaid render failed:', err);
      }
    }
  }

  function renderMath() {
    if (typeof window.renderMathInElement !== 'function') return;
    var target = document.querySelector('main') || document.body;
    window.renderMathInElement(target, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });
    var walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.indexOf('\\$') !== -1) {
        var parent = node.parentElement;
        if (parent && !parent.closest('code, pre, script, style, .katex')) {
          node.nodeValue = node.nodeValue.replace(/\\\$/g, '$');
        }
      }
    }
  }

  function initAll() {
    syncThemeFromDataAttr();
    renderMath();
    void renderMermaidDiagrams(true);

    var observer = new MutationObserver(function (mutations) {
      if (isSyncingTheme) return;
      var dataThemeChanged = false;
      var classChanged = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'data-theme') dataThemeChanged = true;
        if (mutations[i].attributeName === 'class') classChanged = true;
      }
      if (dataThemeChanged) {
        syncThemeFromDataAttr();
        void renderMermaidDiagrams(false);
      } else if (classChanged) {
        void renderMermaidDiagrams(false);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
