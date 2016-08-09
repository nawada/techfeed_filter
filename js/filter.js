chrome.extension.sendRequest({
  'cmd': 'loaded',
  'url': location.href
}, function () {
  'use strict';

  chrome.storage.sync.get([
    'urls', 'titles', 'excludeWithBoth'
  ], function (item) {
    var blackListUrls = item.urls;
    var blackListTitles = item.titles;
    var excludeWithBoth = item.excludeWithBoth;

    if (excludeWithBoth) {
      if (blackListUrls.length === 0 || blackListTitles.length === 0) return;
    } else {
      if (blackListUrls.length === 0 && blackListTitles.length === 0) return;
    }

    function filtering(entries, selector) {
      entries = entries || [];
      return Array.prototype.map.call(entries, function (entry) {
        if (entry.querySelectorAll('.ad-mark').length > 0) return null;
        entry = entry.querySelector(selector);
        return entry;
      }).filter(function (entry) {
        return entry;
      });
    }

    var entries = document.querySelectorAll('.entry');
    var entryUrlElements = filtering(entries, '.entry-origin a');
    var entryTitleElements = filtering(entries, 'h2.entry-title a');

    var blackListUrlIndices = [];
    var blackListTitleIndieces = [];

    var filteredUrlElements = entryUrlElements.filter(function (entryUrlElement, i) {
      var include = blackListUrls.filter(function (blackListUrl) {
        return new RegExp(blackListUrl, 'i').test(entryUrlElement.textContent);
      }).length;
      if (include) blackListUrlIndices.push(i);
      return include;
    });

    var filteredTitleElements = entryTitleElements.filter(function (entryTitleElement, i) {
      var include = !!blackListTitles.filter(function (blackListTitle) {
        return new RegExp(blackListTitle, 'i').test(entryTitleElement.textContent);
      }).length;
      if (include) blackListTitleIndieces.push(i);
      return include;
    });

    var i, el;
    if (excludeWithBoth) {
      for (i = 0; i < blackListUrlIndices.length; i++) {
        for (var j = 0; j < blackListTitleIndieces.length; j++) {
          if (blackListUrlIndices[i] === blackListTitleIndieces[j]) {
            el = filteredTitleElements[j];
            while (!el.classList.contains('has-full-entry')) {
              el = el.parentNode;
            }
            el.parentNode.removeChild(el);
          }
        }
      }
    } else {
      for (i = 0; i < filteredUrlElements.length; i++) {
        el = filteredUrlElements[i];
        while (!el.classList.contains('has-full-entry')) {
          el = el.parentNode;
        }
        el.parentNode.removeChild(el);
      }

      for (i = 0; i < filteredTitleElements.length; i++) {
        el = filteredTitleElements[i];
        if (!el) continue;
        while (!el.classList.contains('has-full-entry')) {
          el = el.parentNode;
        }
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    }
  });
});