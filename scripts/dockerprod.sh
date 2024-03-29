#!/bin/bash

echo "Docker login"
echo "$5" | docker login --username "$DOCKERHUBUSERNAME" --password-stdin

versions="$2.$3 $4 $2 latest"

echo "Tagging and pushing Orbital mock image"
for i in $versions; do
  docker tag "$REGISTRY.azurecr.io/$IMAGENAMEMOCK:$1" "$DOCKERHUBREGISTRY/$IMAGENAMEMOCK:$i";
  docker push "$DOCKERHUBREGISTRY/$IMAGENAMEMOCK:$i";
done;

echo "Tagging and pushing Orbital designer image"
for j in $versions; do
  docker tag "$REGISTRY.azurecr.io/$IMAGENAMEDESIGNER:$1" "$DOCKERHUBREGISTRY/$IMAGENAMEDESIGNER:$j";
  docker push "$DOCKERHUBREGISTRY/$IMAGENAMEDESIGNER:$j";
done;
