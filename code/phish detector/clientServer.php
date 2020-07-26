<?php
header("Access-Control-Allow-Origin: *");
$site=$_POST['url'];
$html = file_get_contents($site);

$bytes=file_put_contents('markup.txt', $html);

$decision=exec("/mnt/neverdelete/projects/fyp/code/phish\ detector/test.py $site 2>&1 ");
echo $decision;

if($decision == "PHISHING")
    {
        $decision=exec("/mnt/neverdelete/projects/fyp/code/target\ identifier/scrape.py http://localhost:8050 /Users/benstewart/BEN\ STUFF/PROJECTS/fyp/code/target\ identifier/single-sites.json 1 /Users/benstewart/BEN\ STUFF/PROJECTS/fyp/code/target\ identifier/data 2>&1 ");
        $decision=exec("/mnt/neverdelete/projects/fyp/code/target\ identifier/compare-tags-all.py data 2>&1 ");
        echo $decision;
    }
?>
