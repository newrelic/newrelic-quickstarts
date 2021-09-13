#!/bin/bash

while true; do
    curl http://localhost:8888/simple-lamp/index.php --max-time 10 > /dev/null
    sleep $(( ( RANDOM % 10 )  + 1 ))
done
