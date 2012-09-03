$(document).ready(function () {

	var demoAgeFilter = function(row) {
		if (row[2] < 22) {
			return false;
		}
		return true;
	};

	var demoIdFilter = function(row) {
		if (row[0] > 3) {
			return false;
		}
		return true;
	};

	$('#demo3').kTablesorter({
		filter: demoAgeFilter
	});

	$('#demo4').kTablesorter({});

	$("#filterId").unbind('click').click(function() {
		$('#demo4').kTablesorter('updateFilter', demoIdFilter);
		$('#demo4').kTablesorter('updateTable');
	});

	$("#filterAge").unbind('click').click(function() {
		$('#demo4').kTablesorter('updateFilter', demoAgeFilter);
		$('#demo4').kTablesorter('updateTable');
	});
});