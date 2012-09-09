<!DOCTYPE html>
<?php
	function randomString($length = 10) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, strlen($characters) - 1)];
	    }
	    return $randomString;
	}
?>


<html lang="en">
	<head>
		<title>The HTML5 Herald</title>
		<link rel="stylesheet" href="styles.css" type="text/css" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
		<script src="js/jquery.kTablesorter.js"></script>
  		<script>
  			$(document).ready(function () {

				$('table').kTablesorter({
					'sortOnInit': false
				});
			});
  		</script>
	</head>
	<body>
		<a href="index.html">Back</a>
		<table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Nickname</th>
					<th>Datestamp</th>
					<th>Note</th>
				</tr>
			</thead>
			<tbody>
				<?php
					$rows = $_GET['rows'];
					if (!$rows) {
						$rows = 10;
					}
					for ($i=0; $i < $rows; $i++) { 
						?>
						<tr>
							<td><?php echo randomString(3) ?></td>
							<td><?php echo randomString(5) ?></td>
							<td><?php echo randomString(7) ?></td>
							<td><?php echo randomString(12) ?></td>
						</tr>
						<?php
					}
				?>
			</tbody>
		</table>
	</body>
</html>