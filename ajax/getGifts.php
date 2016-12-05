
<?php
	header('Access-Control-Allow-Origin: *'); 
$data = file_get_contents ('./gifts.json');
    echo ($data);
?>