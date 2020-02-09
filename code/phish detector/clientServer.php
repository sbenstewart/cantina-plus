<?php
header("Access-Control-Allow-Origin: *");
$site=$_POST['url'];
$html = file_get_contents($site);

$bytes=file_put_contents('markup.txt', $html);

//echo $site;
//echo "<br>";
//echo $html;
// Can use this if your default interpreter is Python 2.x.
// Has some problem executing 'which python2'. So, absolute path is just simpler.
//$python_path=exec("which python 2>&1 ");
//echo $python_path;
//$decision=exec("$python_path test.py $site 2>&1 ");

// Replace the path with the path of your python2.x installation.
$decision=exec("/Users/benstewart/anaconda3/envs/py2/bin/python /Users/benstewart/BEN\ STUFF/PROJECTS/fyp/code/phish\ detector/test.py $site 2>&1 ");
echo $decision;
?>
