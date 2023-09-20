#!/bin/bash

FILES=$(<files.txt)
for f in $FILES
do
    echo "Processing $f file..."
    (cat header-frontend.txt; echo -e "\n\n"; cat $f) > tmpfile && mv tmpfile $f
done