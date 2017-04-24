export function initialize(/* application */) {

  $.fn.multiSelect.Constructor.prototype.generateLisFromOption = function (option, index, $container) {
    var that = this,
      ms = that.$element,
      attributes = "",
      $option = $(option);
    for (var cpt = 0; cpt < option.attributes.length; cpt++) {
      var attr = option.attributes[cpt];

      if (attr.name !== 'value' && attr.name !== 'disabled') {
        attributes += attr.name + '="' + attr.value + '" ';
      }
    }
    var selectableLi = $('<li ' + attributes + '><span>' + that.escapeHTML($option.text()) + '</span></li>'),
      selectedLi = selectableLi.clone(),
      value = $option.val(),
      elementId = that.sanitize(value);

    selectableLi
      .data('ms-value', value)
      .addClass('ms-elem-selectable')
      .attr('id', elementId + '-selectable');

    selectedLi
      .data('ms-value', value)
      .addClass('ms-elem-selection')
      .attr('id', elementId + '-selection')
      .hide();

    if ($option.prop('disabled') || ms.prop('disabled')) {
      selectedLi.addClass(that.options.disabledClass);
      selectableLi.addClass(that.options.disabledClass);
    }

    var $optgroup = $option.parent('optgroup');

    if ($optgroup.length > 0) {
      var optgroupLabel = $optgroup.attr('label'),
        optgroupId = that.sanitize(optgroupLabel),
        $selectableOptgroup = that.$selectableUl.find('#optgroup-selectable-' + optgroupId),
        $selectionOptgroup = that.$selectionUl.find('#optgroup-selection-' + optgroupId);
      if ($selectableOptgroup.length === 0) {
        var optgroupContainerTpl = '<li class="ms-optgroup-container"></li>',
          optgroupTpl = '<ul class="ms-optgroup "><li class="ms-optgroup-label"><span>' + optgroupLabel + '</span></li></ul>';

        $selectableOptgroup = $(optgroupContainerTpl);
        $selectionOptgroup = $(optgroupContainerTpl);
        $selectableOptgroup.attr('id', 'optgroup-selectable-' + optgroupId);
        $selectionOptgroup.attr('id', 'optgroup-selection-' + optgroupId);
        $selectableOptgroup.append($(optgroupTpl));
        $selectionOptgroup.append($(optgroupTpl));
        if (that.options.selectableOptgroup) {
          $selectableOptgroup.find('.ms-optgroup-label').on('click', function () {
            var values = $optgroup.children(':not(:disabled)').map(function () {
              return $(this).val()
            }).get();
            that.select(values);
          });
          $selectionOptgroup.find('.ms-optgroup-label').on('click', function () {
            var values = $optgroup.children(':not(:disabled)').map(function () {
              return $(this).val()
            }).get();
            that.deselect(values);
          });
        }
        that.$selectableUl.append($selectableOptgroup);
        that.$selectionUl.append($selectionOptgroup);
      }
      index = index == undefined ? $selectableOptgroup.find('ul').children().length : index + 1;
      selectableLi.insertAt(index, $selectableOptgroup.children());
      selectedLi.insertAt(index, $selectionOptgroup.children());
    } else {
      index = index == undefined ? that.$selectableUl.children().length : index;

      selectableLi.insertAt(index, that.$selectableUl);
      selectedLi.insertAt(index, that.$selectionUl);
    }
  };

  $.fn.multiSelect.Constructor.prototype.select = function (value, method) {
    if (typeof value === 'string') {
      value = [value];
    }

    var that = this,
      ms = this.$element,
      msIds = $.map(value, function (val) {
        return (that.sanitize(val));
      }),
      selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #') + '-selectable'),
      selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection'),
      options = ms.find('option').filter(function () {
        return ($.inArray(this.value, value) > -1);
      });

    if (method === 'init') {
      selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #') + '-selectable'),
        selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection');
    }

    if (selectables.length > 0) {
      selectables.addClass('ms-selected').hide();
      selections.addClass('ms-selected').show();

      options.prop('selected', true);

      that.$container.find(that.elemsSelector).removeClass('ms-hover');

      var selectableOptgroups = that.$selectableUl.children('.ms-optgroup-container');
      if (selectableOptgroups.length > 0) {
        selectableOptgroups.each(function () {
          var selectablesLi = $(this).find('.ms-elem-selectable');
          if (selectablesLi.length === selectablesLi.filter('.ms-selected').length) {
            $(this).find('.ms-optgroup-label').hide();
          }
        });

        var selectionOptgroups = that.$selectionUl.children('.ms-optgroup-container');
        selectionOptgroups.each(function () {
          var selectionsLi = $(this).find('.ms-elem-selection');
          if (selectionsLi.filter('.ms-selected').length > 0) {
            $(this).find('.ms-optgroup-label').show();
          }
        });
      } else {
        if (that.options.keepOrder && method !== 'init') {
          var selectionLiLast = that.$selectionUl.find('.ms-selected');
          if ((selectionLiLast.length > 1) && (selectionLiLast.last().get(0) != selections.get(0))) {
            selections.insertAfter(selectionLiLast.last());
          }
        }
      }
      if (method !== 'init') {
        ms.trigger('change');
        if (typeof that.options.afterSelect === 'function') {
          that.options.afterSelect.call(this, value);
        }
      }
    }
  };


  (function ($, window, document, undefined) {
    $.fn.quicksearch = function (target, opt) {

      var timeout, cache, rowcache, jq_results, val = '', e = this, options = $.extend({
        delay: 100,
        selector: null,
        stripeRows: null,
        loader: null,
        noResults: '',
        matchedResultsCount: 0,
        bind: 'keyup',
        onBefore: function () {
          return;
        },
        onAfter: function () {
          return;
        },
        show: function () {
          this.style.display = "";
        },
        hide: function () {
          this.style.display = "none";
        },
        prepareQuery: function (val) {
          return val.toLowerCase().split(' ');
        },
        testQuery: function (query, txt, _row) {
          for (var i = 0; i < query.length; i += 1) {
            if (txt.indexOf(query[i]) === -1) {
              return false;
            }
          }
          return true;
        }
      }, opt);

      this.go = function () {

        var i = 0,
          numMatchedRows = 0,
          noresults = true,
          query = options.prepareQuery(val),
          val_empty = (val.replace(' ', '').length === 0);

        if (val_empty) {
          for (var i = 0, len = rowcache.length; i < len; i++) {
            options.show.apply(rowcache[i]);
            noresults = false;
            numMatchedRows++;
          }
          var topRow = [];
          for (var i = 0, len = rowcache.length; i < len; i++) {
            var topObject = $(rowcache[i]).prevAll()[0];
            if (!topRow.contains(topObject) && topObject.className === 'ms-optgroup-label') {
              topRow.addObject(topObject);
            }
          }
          for (var i = 0, len = topRow.length; i < len; i++) {
            options.show.apply(topRow[i]);
          }
        } else {
          for (var i = 0, len = rowcache.length; i < len; i++) {
            if (val_empty || options.testQuery(query, cache[i], rowcache[i])) {
              options.show.apply(rowcache[i]);
              noresults = false;
              numMatchedRows++;
            } else {
              options.hide.apply(rowcache[i]);
            }
          }

          var topRow = [];
          for (var i = 0, len = rowcache.length; i < len; i++) {
            var topObject = $(rowcache[i]).prevAll()[0];
            if (!topRow.contains(topObject) && topObject.className === 'ms-optgroup-label') {
              topRow.addObject(topObject);
            }
          }
          for (var i = 0, len = topRow.length; i < len; i++) {

            if ($(topRow[i]).nextAll('li:hidden').length === $(topRow[i]).nextAll('li').length) {
              options.hide.apply(topRow[i]);
            } else {
              options.show.apply(topRow[i]);
            }
          }
        }

        if (noresults) {
          this.results(false);
        } else {
          this.results(true);
          this.stripe();
        }

        this.matchedResultsCount = numMatchedRows;
        this.loader(false);
        options.onAfter();

        return this;
      };

      /*
       * External API so that users can perform search programatically.
       * */
      this.search = function (submittedVal) {
        val = submittedVal;
        e.trigger();
      };

      /*
       * External API to get the number of matched results as seen in
       * https://github.com/ruiz107/quicksearch/commit/f78dc440b42d95ce9caed1d087174dd4359982d6
       * */
      this.currentMatchedResults = function () {
        return this.matchedResultsCount;
      };

      this.stripe = function () {

        if (typeof options.stripeRows === "object" && options.stripeRows !== null) {
          var joined = options.stripeRows.join(' ');
          var stripeRows_length = options.stripeRows.length;

          jq_results.not(':hidden').each(function (i) {
            $(this).removeClass(joined).addClass(options.stripeRows[i % stripeRows_length]);
          });
        }

        return this;
      };

      this.strip_html = function (input) {
        var output = input.replace(new RegExp('<[^<]+\>', 'g'), "");
        output = $.trim(output.toLowerCase());
        return output;
      };

      this.results = function (bool) {
        if (typeof options.noResults === "string" && options.noResults !== "") {
          if (bool) {
            $(options.noResults).hide();
          } else {
            $(options.noResults).show();
          }
        }
        return this;
      };

      this.loader = function (bool) {
        if (typeof options.loader === "string" && options.loader !== "") {
          (bool) ? $(options.loader).show() : $(options.loader).hide();
        }
        return this;
      };

      this.cache = function () {

        jq_results = $(target);

        if (typeof options.noResults === "string" && options.noResults !== "") {
          jq_results = jq_results.not(options.noResults);
        }

        var t = (typeof options.selector === "string") ? jq_results.find(options.selector) : $(target).not(options.noResults);
        cache = t.map(function () {
          return e.strip_html(this.innerHTML);
        });

        rowcache = jq_results.map(function () {
          return this;
        });

        /*
         * Modified fix for sync-ing "val".
         * Original fix https://github.com/michaellwest/quicksearch/commit/4ace4008d079298a01f97f885ba8fa956a9703d1
         * */
        val = val || this.val() || "";

        return this.go();
      };

      this.trigger = function () {
        this.loader(true);
        options.onBefore();

        clearTimeout(timeout);
        timeout = setTimeout(function () {
          e.go();
        }, options.delay);

        return this;
      };

      this.cache();
      this.results(true);
      this.stripe();
      this.loader(false);

      return this.each(function () {

        /*
         * Changed from .bind to .on.
         * */
        $(this).on(options.bind, function () {

          val = $(this).val();
          e.trigger();
        });
      });

    };

  }(jQuery, this, document));
}

export default {
  name: 'quicksearch-plugin',
  initialize
};
