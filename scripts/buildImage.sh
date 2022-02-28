#/bin/bash

if [ "$RELEASE_ENVIRONMENTNAME" == "Dev" ]; then
    echo "Running in Development environment"
elif [ "$RELEASE_ENVIRONMENTNAME" == "Prod" ]; then
    echo "Running in Production environment"
elif [ "$RELEASE_ENVIRONMENTNAME" == "UAT" ]; then
    echo "Running in UAT environment"
else
    echo "Running in Testing environment"
fi

echo "Build new Orbital Mock image"
az acr build -t "$IMAGENAMEMOCK:$1" -r "$REGISTRY" "$SYSTEM_DEFAULTWORKINGDIRECTORY/_Orbital_CI/drop"

echo "Build new Orbital Mock Designer image"
az acr build -t "$IMAGENAMEDESIGNER:$1" -r "$REGISTRY" "$SYSTEM_DEFAULTWORKINGDIRECTORY/_Orbital_Designer_CI/drop"
