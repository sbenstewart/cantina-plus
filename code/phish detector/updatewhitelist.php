<?php
header("Access-Control-Allow-Origin: *");
$site=$_POST['url'];

$decision=exec("/home/sbenstewart/anaconda3/envs/fyp/bin/python /mnt/neverdelete/projects/fyp/code/phish\ detector/whitelistadder.py $site 2>&1 ");
echo $decision;
?>
