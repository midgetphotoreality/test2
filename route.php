<?php

if(isset($_REQUEST['request'])){
    $point = (string)$_REQUEST['request'];
    if(strpos($point,"/")!==false){
        $params = explode("/",$point);
        $point = array_shift($params);
    }
}

