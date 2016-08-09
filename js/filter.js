chrome.extension.sendRequest({
  'cmd': 'loaded',
  'url': location.href
}, function () {
  'use strict';

  chrome.storage.sync.get({
    urls: [],
    titles: [],
    excludeWithBoth: true
  }, function (item) {
    var techFeedFilter = new TechFeedFilter(item.urls, item.titles, item.excludeWithBoth);
    techFeedFilter.execute();
  });
});