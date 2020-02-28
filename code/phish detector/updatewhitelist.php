<?php
header("Access-Control-Allow-Origin: *");
$site=$_POST['url'];

$decision=exec("/Users/benstewart/anaconda3/envs/py2/bin/python /Users/benstewart/BEN\ STUFF/PROJECTS/fyp/code/phish\ detector/whitelistadder.py $site 2>&1 ");
echo $decision;
?>
