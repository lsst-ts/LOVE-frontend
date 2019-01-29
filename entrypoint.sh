#!/bin/sh

echo "Copying webpack-stats.prod.json"
mkdir -p /home/LOVE/manager/manager
cp /home/docker/webpack-stats.prod.json /home/LOVE/manager/manager/webpack-stats.prod.json
echo "Copying build files"
mkdir -p /home/LOVE/manager/manager/assets
cp -r /home/docker/love/build /home/LOVE/manager/manager/assets/bundles
echo "Done"
