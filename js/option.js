function save_options() {
  var urls = document.getElementById('exclude-urls').value.split('\n');
  var titles = document.getElementById('exclude-titles').value.split('\n');
  var excludeWithBoth = document.getElementById('exclude-with-both').checked;

  console.log(excludeWithBoth);

  chrome.storage.sync.set({
    urls: urls,
    titles: titles,
    excludeWithBoth: excludeWithBoth
  });
}

function restore_options() {
  chrome.storage.sync.get([
    'urls', 'titles', 'excludeWithBoth'
  ], function(item) {
    document.getElementById('exclude-urls').value = item.urls.join('\n');
    document.getElementById('exclude-titles').value = item.titles.join('\n');
    document.getElementById('exclude-with-both').checked = item.excludeWithBoth;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);