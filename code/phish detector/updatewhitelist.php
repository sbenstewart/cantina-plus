<?php
header("Access-Control-Allow-Origin: *");
$site=$_POST['url'];

$decision=exec("/mnt/neverdelete/projects/fyp/code/phish\ detector/whitelistadder.py $site 2>&1 ");
echo $decision;
?>
