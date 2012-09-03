(function ($) {

	var dataName = "kSorter";
	var columnIndexName = "kSorterColumnIndex";

	var sorters = [];

	// Default settings for kTablesorter
	var defaults = {
		debug: false,
		rowsToDetermineSorter: 1
	};

	function addSorter(sorter) {
		sorters.push(sorter);
	}

	function customSorter(column, order, sorter) {
		return function (a, b) {
			var result = sorter(a[column], b[column]);

			// Check order, else 'reverse'
			if (order === "asc") {
				return sorter(a[column], b[column]);
			}
			return (-sorter(a[column], b[column]));
		};
	}

	function bindHeaders(headers) {
		for (var i = 0; i < headers.length; i++) {
			var header = headers[i];
			$(header).unbind('click').click(function () {

				// Get table (should be optimized)
				var table = $(this).parent().parent().parent();

				// Get data
				var data = $(table).data(dataName);

				// Get sorting
				var sortingSettings = data.sortingSettings;

				// Get header index
				var headerIndex = $(this).data(columnIndexName);

				// Update sorting and save it
				if (sortingSettings.column === headerIndex) {
					sortingSettings.order = (sortingSettings.order === "asc" ? "desc" : "asc");
				} else {
					sortingSettings.column = headerIndex;
				}

				// TODO : Update styles for headers
				var a = 1;

				// Save new stuff
				$(table).data(dataName, data);

				// Resort data
				methods.sort.apply(table);

				// Rewrite table
				methods.updateTable.apply(table);
			});
		};
	}

	function rewriteTable(table, dataCache) {

		var data = $(table).data(dataName);
		var options = data.options;
		var filter = options.filter;

		// Hide everything, to improve performance
		$(table).find("tbody").addClass("hidden");
		for (var i = 0; i < dataCache.length; i++) {
			var row = dataCache[i];
			$(row.rowElement[0]).detach();
			if (filter === undefined || filter(row)) {
				$(table).find("tbody").append(row.rowElement[0]);
			}
		}
		$(table).find("tbody").removeClass("hidden");
	}

	function initStandardSorters() {
		var sorterText = {
			name: "text",
			format: function () {},
			test: function (string) {
				return true;
			},
			sorter: function (a, b) {
				return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
			}
		};
		var sorterInt = {
			name: "int",
			format: function () {},
			test: function (string) {
				return (/^\d*$/g).test(string);
			},
			sorter: function (a, b) {
				return a - b;
			}
		};
		addSorter(sorterText);
		addSorter(sorterInt);
	}

	function evaluateColumnType(types) {
		// If no types in array, then treat is as 'text'
		if (types.length === 0) {
			return "text";
		}

		// Create a temporary array that will help us (should only contains one value)
		var uniqueValues = [];

		// Add first type to teporary array
		uniqueValues.push(types[0]);

		for (var i = 1; i < types.length; i++) {
			var type = types[i];

			// If type exists in temporary array, continue
			if (uniqueValues.indexOf(type) === 0) {
				continue;
			}

			// If more then one type, treat is as 'text'
			return "text";
		}
		return uniqueValues[0];
	}

	function getSorterForData(columnData) {
		var results = [];

		for (var i = 0; i < columnData.length; i++) {
			var data = columnData[i];

			for (var j = 1; j < sorters.length; j++) {
				var sorter = sorters[j];
				if (sorter.test(data)) {
					results.push(sorter.name);
					break;
				}
			}
		}

		return evaluateColumnType(results);
	}

	function getDataForColumn(table, headerIndex) {
		var data = $(table).data(dataName);
		var dataCache = data.dataCache;
		var options = data.options;
		var returnData = [];

		for (var i = 0; i < dataCache.length; i++) {
			var row = dataCache[i];
			returnData.push(row[headerIndex]);

			if (i === options.rowsToDetermineSorter - 1) {
				break;
			}
		}
		return returnData;
	}

	var methods = {
		init: function (options) {
			return this.each(function () {

				var data = {
					'options': '',
					'headerCache': '',
					'dataCache': '',
					'sortingSettings': ''
				};

				// Options for table
				data.options = $.extend(defaults, options);

				// Cache for headers in table
				data.headerCache = [];

				// 2D array with all data in table
				data.dataCache = [[]];

				// Sorting settings for table
				data.sortingSettings = {
					'column': 0,
					'order': 'asc',
				};

				// Save everything on element
				$(this).data(dataName, data);

				// Update data
				methods.updateData.apply(this);
				if (data.options.debug) {
					console.log('dataCache:');
					console.log(data.dataCache);
				}

				// Update headers
				methods.updateHeaders.apply(this);
				if (data.options.debug) {
					console.log('headerCache:');
					console.log(data.headerCache);
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
		updateFilter: function (filter) {
			return $(this).each(function () {
				var data = $(this).data(dataName);
				var options = data.options;
				options.filter = filter;
				$(this).data(dataName, data);
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
				var a = "TODO";

				// TODO : Bind headers
				var b = "TODO";

				// Save headers in seperate cache
				for (i = 0; i < headersLength; i++) {
					var header = headers[i];

					// Get data for a column
					var columnData = getDataForColumn($(this), i);

					console.log(columnData);

					// Determine column type and selecting sorter
					var sorter = getSorterForData(columnData);

					// Save header
					data.headerCache[i] = {
						'header': $(header).text(),
						'sorter': sorter
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
				var sortingSettings = data.sortingSettings;
				var headerCache = data.headerCache;
				var sorterName = headerCache[sortingSettings.column].sorter;
				var sorter;
				for (var i = 0; i < sorters.length; i++) {
					sorter = sorters[i];
					if (sorter.name === sorterName) {
						break;
					}
				}

				data.dataCache.sort(customSorter(sortingSettings.column, sortingSettings.order, sorter.sorter));
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
		},
		addSorter: function (sorter) {
			addSorter(sorter);
		}
	};

	$.fn.kTablesorter = function (method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			initStandardSorters();
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.kTablesorter');
		}
	};

})(jQuery);