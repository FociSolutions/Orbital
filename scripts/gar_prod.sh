#!/bin/bash

SEMVER="$1"
MAJOR="$2"
MINOR="$3"
FULL_VER="$4"

GAR_LOCATION=northamerica-northeast1
GAR_REPOSITORY=prj-tf-runners
GAR_PROJECT_ID=prj-cras-c-infra-pipeline-ba56

PROJECT_NUMBER="668896473669" # your Google Cloud project number (not name)
POOL_ID= # the ID of the Workload Identity Pool created in the first section
PROVIDER_ID= # the ID of the Workload Identity Provider created in the second section

versions="$MAJOR.$MINOR $PATCH $FULL_VER latest"

echo "gcloud auth"

SUBJECT_TOKEN=$(az account get-access-token --query accessToken --output tsv)

PAYLOAD="$(cat <<EOF
{
  "audience": "//iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}",
  "grantType": "urn:ietf:params:oauth:grant-type:token-exchange",
  "requestedTokenType": "urn:ietf:params:oauth:token-type:access_token",
  "scope": "https://www.googleapis.com/auth/cloud-platform",
  "subjectTokenType": "urn:ietf:params:oauth:token-type:jwt",
  "subjectToken": "${SUBJECT_TOKEN}"
}
EOF
)"

FEDERATED_STS_TOKEN="$(curl --fail "https://sts.googleapis.com/v1/token" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data "${PAYLOAD}" \
  | jq -r '.access_token'
)"

ACCESS_TOKEN="$(curl --fail "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${SERVICE_ACCOUNT_EMAIL}:generateAccessToken" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${FEDERATED_STS_TOKEN}" \
  --data '{"scope": ["https://www.googleapis.com/auth/cloud-platform"]}' \
  | jq -r '.accessToken'
)"

export CLOUDSDK_AUTH_ACCESS_TOKEN="${ACCESS_TOKEN}"

echo "gcloud configure docker"
gcloud --quiet auth configure-docker $GAR_LOCATION-docker.pkg.dev

echo "Tagging and pushing Orbital mock image"
for VERSION in $versions; do
  docker tag "$REGISTRY.azurecr.io/$IMAGENAMEMOCK:$SEMVER" "$DOCKERHUBREGISTRY/$IMAGENAMEMOCK:$VERSION";
  docker push "$GAR_LOCATION-docker.pkg.dev/$GAR_PROJECT_ID/$GAR_REPOSITORY/$IMAGENAMEMOCK:$VERSION"
done;

echo "Tagging and pushing Orbital designer image"
for VERSION in $versions; do
  docker tag "$REGISTRY.azurecr.io/$IMAGENAMEDESIGNER:$SEMVER" "$DOCKERHUBREGISTRY/$IMAGENAMEDESIGNER:$VERSION";
  docker push "$GAR_LOCATION-docker.pkg.dev/$GAR_PROJECT_ID/$GAR_REPOSITORY/$IMAGENAMEDESIGNER:$VERSION"
done;

