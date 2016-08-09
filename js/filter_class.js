TechFeedFilter = function (urls, titles, excludeWithBoth) {
  this.blackListUrls = urls;
  this.blackListTitles = titles;
  this.excludeWithBoth = excludeWithBoth;
  this.URL_ELEMENT_SELECTOR = '.entry-origin a';
  this.TITLE_ELEMENT_SELECTOR = 'h2.entry-title a';
};

TechFeedFilter.prototype.execute = function () {
  var elements = this._getElements();

  if (this.excludeWithBoth) {
    this._filteringUrlsAndTitles(elements);
  } else {
    this._filteringUrlsOrTitles(elements);
  }
};

/**
 * URLとタイトルが一致するもののみ削除する
 * @param elements
 * @private
 */
TechFeedFilter.prototype._filteringUrlsAndTitles = function (elements) {
  console.log(this._notExistArrayValue(this.blackListUrls), this._notExistArrayValue(this.blackListTitles));
  if (this._notExistArrayValue(this.blackListUrls) || this._notExistArrayValue(this.blackListTitles)) return;

  var urlElements = elements.url, that = this;

  urlElements.forEach(function (element) {
    while (!element.classList.contains('has-full-entry')) element = element.parentNode;
    var titleElement = element.querySelector(that.TITLE_ELEMENT_SELECTOR);
    for (var i = 0; i < that.blackListTitles.length; i++) {
      if (new RegExp(that.blackListTitles[i]).test(titleElement.textContent)) element.parentNode.removeChild(element);
    }
  });
};

/**
 * URLまたはタイトルが一致する場合削除する
 * @param elements
 * @private
 */
TechFeedFilter.prototype._filteringUrlsOrTitles = function (elements) {
  var existsUrl = !this._notExistArrayValue(this.blackListUrls),
    existsTitles = !this._notExistArrayValue(this.blackListTitles);

  if (existsUrl) {
    elements.url.forEach(function (urlElement) {
      while (!urlElement.classList.contains('has-full-entry')) urlElement = urlElement.parentNode;
      urlElement.parentNode.removeChild(urlElement);
    });
  }

  if (existsTitles) {
    elements.title.forEach(function (titleElement) {
      if (!titleElement) return;
      while (!titleElement.classList.contains('has-full-entry')) {
        titleElement = titleElement.parentNode;
        if (!titleElement) return;
      }
      if (titleElement.parentNode) titleElement.parentNode.removeChild(titleElement);
    });
  }
};

/**
 * フィルタリング対象のエレメントを取得する
 * @returns {{url, title}}
 * @private
 */
TechFeedFilter.prototype._getElements = function () {
  var entries = document.querySelectorAll('.entry');
  var entryUrlElements = this._getElementsWithSelector(entries, this.URL_ELEMENT_SELECTOR);
  var entryTitleElements = this._getElementsWithSelector(entries, this.TITLE_ELEMENT_SELECTOR);

  var filteredUrlElements = this._filterElements(entryUrlElements, this.blackListUrls);
  var filteredTitleElements = this._filterElements(entryTitleElements, this.blackListTitles);

  return {
    url: filteredUrlElements,
    title: filteredTitleElements
  };
};

/**
 * エレメントからセレクタに一致するものを取得する
 * @param elements
 * @param selector
 * @returns {Array.<Element>|*}
 * @private
 */
TechFeedFilter.prototype._getElementsWithSelector = function (elements, selector) {
  elements = elements || [];
  return Array.prototype.filter.call(elements, function (element) {
    if (element.querySelectorAll('.ad-mark').length > 0) return null;
    return element.querySelector(selector);
  });
};

/**
 * エレメントをフィルタリングする
 * @param elements
 * @param filters
 * @returns {Array.<Element>|*}
 * @private
 */
TechFeedFilter.prototype._filterElements = function (elements, filters) {
  return Array.prototype.filter.call(elements, function (element) {
    for (var i = 0; i < filters.length; i++) {
      if (new RegExp(filters[i]).test(element.textContent) === false) continue;
      return true;
    }
    return false;
  });
};

/**
 * 配列が存在しないか確認する
 * @param array
 * @returns {boolean}
 * @private
 */
TechFeedFilter.prototype._notExistArrayValue = function (array) {
  return !!array.filter(function (ary) {
    return ary == null || ary.toString().length === 0;
  }).length;
};