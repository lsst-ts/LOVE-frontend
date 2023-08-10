#!/bin/bash

FILES=$(<files.txt)
for f in $FILES
do
    echo "Processing $f file..."
    sed -i '' '1,19d' $f
    (cat header-frontend.txt; echo -e "\n\n"; cat $f) > tmpfile && mv tmpfile $f
done