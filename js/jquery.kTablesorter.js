(function ($) {

	var dataName = "kSorter";
	var columnIndexName = "kSorterColumnIndex";

	// Default settings for kTablesorter
	var defaults = {
		debug: true
	};

	function mySorter(column, order) {
		return function (a, b) {
			if (order === "asc") {
				return a[column] - b[column];
			}
			return a[column] + b[column];
		};
	}

	function bindHeaders(headers) {
		for (var i = 0; i < headers.length; i++) {
			var header = headers[i];
			$(header).unbind('click').click(function() {
				
				// Get table (should be optimized)
				var table = $(this).parent().parent().parent();

				// Get data
				var data = $(table).data(dataName);

				// Get sorting
				var sorting = data.sorting;

				// Get header index
				var headerIndex = $(this).data(columnIndexName);

				// Update sorting and save it
				if (sorting.column === headerIndex) {
					sorting.order = (sorting.order === "asc" ? "desc" : "asc");
				} else {
					sorting.column = headerIndex;
				}
				$(table).data(dataName, data);

				// Resort data
				methods.sort.apply(table);

				// Rewrite table
				methods.updateTable.apply(table);
			});
		};
	}

	function rewriteTable(table, dataCache) {
		for (var i = 0; i < dataCache.length; i++) {
			var row = dataCache[i];
			$(row.rowElement[0]).detach();
			$(table).find("tbody").append(row.rowElement[0]);
		}
	}

	var methods = {
		init: function (options) {
			return this.each(function (options) {

				var data = {
					'options': '',
					'headerCache': '',
					'dataCache': '',
					'sorting': ''
				};

				// Options for table
				data.options = $.extend(defaults, options);

				// Cache for headers in table
				data.headerCache = [];

				// 2D array with all data in table
				data.dataCache = [[]];

				// Sorting settings for table
				data.sorting = {
					'column': 0,
					'order': 'asc'
				};

				// Save everything on element
				$(this).data(dataName, data);

				// Update headers
				methods.updateHeaders.apply(this);
				if (data.options.debug) {
					console.log('headerCache:');
					console.log(data.headerCache);
				}

				// Update data
				methods.updateData.apply(this);
				if (data.options.debug) {
					console.log('dataCache:');
					console.log(data.dataCache);
				}

				// Sort everyting 
				methods.sort.apply(this);
				if (data.options.debug) {
					console.log("DataCache after sorting:");
					console.log(data.dataCache);
				}

				// Create bindings for headers
				var headers = $(this).find('thead th');
				bindHeaders(headers);

				// Rerender the table for the user
				methods.updateTable.apply(this);
			});
		},
		updateHeaders: function () {

			return $(this).each(function () {
				var data = $(this).data(dataName);
				var headers = $(this).find('thead th');
				var body = $(this).find('tbody td');
				var headersLength = headers.length;

				var i;

				// TODO : Unbind everything on headers (if some is removed)

				// Save headers in seperate cache
				for (i = 0; i < headersLength; i++) {
					var header = headers[i];

					// Determine column type 
					var type = 'text';

					// Save header
					data.headerCache[i] = {
						'header': $(header).text(),
						'type': type
					};

					// Save column index to data on column
					$(header).data(columnIndexName, i);


				}
				$(this).data(dataName, data);
			});

		},
		updateData: function () {
			return $(this).each(function () {
				var data = $(this).data(dataName);
				var headers = $(this).find('thead th');
				var body = $(this).find('tbody td');
				var headersLength = headers.length;
				var x = 0,
					y = 0;

				// Save all data in a 2D array
				for (var i = 0; i < body.length; i++) {
					var elementTd = body[i];

					// Calculate Y and X in table
					y = Math.floor(i / headersLength);
					x = i % headersLength;

					// If first element on row, create new array and save the row
					if (x === 0) {
						data.dataCache[y] = [];
						data.dataCache[y]['rowElement'] = $(elementTd).parent();
					}

					data.dataCache[y][x] = $(elementTd).text();
				}
				$(this).data(dataName, data);
			});
		},
		sort: function () {
			return $(this).each(function () {
				var data = $(this).data(dataName);
				data.dataCache.sort(mySorter(data.sorting.column, data.sorting.order));
				$(this).data(dataName, data);
			});
		},
		destroy: function () {
			// TODO
		},
		updateTable: function () {
			return $(this).each(function () {
				var data = $(this).data(dataName);
				rewriteTable($(this), data.dataCache);
			});
		}
	};

	$.fn.kTablesorter = function (method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.kTablesorter');
		}
	};

})(jQuery);