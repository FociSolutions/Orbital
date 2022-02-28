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

echo "Create a resource group"
az group create --name "$ORBITAL-$ENV-$RESOURCEGROUP" --location "$LOCATION"

echo " Create an App Service plan"
az appservice plan create --name "$ORBITAL-$ENV-$SERVICEPLAN" --resource-group "$ORBITAL-$ENV-$RESOURCEGROUP" --location "$LOCATION" --is-linux

echo "Get registry credentials"
usernameacr=$(az acr credential show --name $REGISTRY --query username --output tsv)
passwordacr=$(az acr credential show --name $REGISTRY --query passwords[0].value --output tsv)

echo " Create orbital designer web app"
az webapp create --name "$ORBITAL-$ENV-$DESIGNER" --plan "$ORBITAL-$ENV-$SERVICEPLAN" --resource-group "$ORBITAL-$ENV-$RESOURCEGROUP" -i "$REGISTRY/$IMAGENAMEDESIGNER:$1"
az webapp config container set --name "$ORBITAL-$ENV-$DESIGNER" --resource-group "$ORBITAL-$ENV-$RESOURCEGROUP" --docker-custom-image-name "$REGISTRY.azurecr.io/$IMAGENAMEDESIGNER:$1" --docker-registry-server-url "https://$REGISTRY.azurecr.io" --docker-registry-server-user "$usernameacr" --docker-registry-server-password "$passwordacr"

echo " Create orbital mock web app"
az webapp create --name "$ORBITAL-$ENV-$MOCK" --plan "$ORBITAL-$ENV-$SERVICEPLAN" --resource-group "$ORBITAL-$ENV-$RESOURCEGROUP" -i "$REGISTRY/$IMAGENAMEMOCK:$1"
az webapp config container set --name "$ORBITAL-$ENV-$MOCK" --resource-group "$ORBITAL-$ENV-$RESOURCEGROUP" --docker-custom-image-name "$REGISTRY.azurecr.io/$IMAGENAMEMOCK:$1" --docker-registry-server-url "https://$REGISTRY.azurecr.io" --docker-registry-server-user "$usernameacr" --docker-registry-server-password "$passwordacr"
