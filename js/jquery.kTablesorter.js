(function ($) {
	$.fn.extend({
		kTablesorter: function () {

			var defaults = {
				debug: true
			};

			function mySorter (column) {
				return function (a, b) {
					return a[column] - b[column];
				};
			}
			
			return this.each(function (options) {

				var options = $.extend(defaults, options);

				var headerCache = [];
				var dataCache = [[]];
				var sorting = {
					'column': 0,
					'order': 'asc'
				};
				var table = $(this);
				var headers = $(table).find('thead th');
				var body = $(table).find('tbody td');

				var i;
				for (i = 0; i < headers.length; i++) {
					var header = headers[i];
					var type = 'text';
					headerCache[i] = {
						'header': $(header).text(),
						'type': type
					};
				}

				var headersLength = headers.length;
				var x = 0, y =0;


				for (var i = 0; i < body.length; i++) {
					var elementTd = body[i];
					y = Math.floor(i / headersLength);
					x = i % headersLength;
					if (x === 0) {
						dataCache[y] = [];
					}

					dataCache[y][x] = $(elementTd).text();
				}

				if (options.debug) {
					console.log('DataCache...');
					console.log(dataCache);
				}

				dataCache.sort(mySorter(sorting.column));

				if (options.debug) {
					console.log("dataCache:");
					console.log(dataCache);
				}
			});
		}
	});
})(jQuery);