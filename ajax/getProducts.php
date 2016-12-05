
<?php
	header('Access-Control-Allow-Origin: *'); 
$data = file_get_contents ('./products.json');
    echo ($data);
?>