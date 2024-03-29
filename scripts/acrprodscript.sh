#!/bin/bash

echo "ACR login"
echo "$2" | docker login "$REGISTRY.azurecr.io" --username "$ACRFOCI" --password-stdin

echo "Pull Orbital Designer image"
docker image pull "$REGISTRY.azurecr.io/$IMAGENAMEDESIGNER:$1"

echo "Pull Orbital Mock image"
docker image pull "$REGISTRY.azurecr.io/$IMAGENAMEMOCK:$1"

echo "Logging out from ACR"
docker logout
