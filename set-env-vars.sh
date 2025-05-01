#!/bin/bash

# Terraform Variables
export TF_VAR_ociTenancyOcid="ocid1.tenancy.oc1..aaaaaaaan7jtdvh7y4rmm4kw67gkkottukneixg2v4gutcexypdszr62vdiq"
export TF_VAR_ociUserOcid="ocid1.user.oc1..aaaaaaaaaefwdtlobyok26cptkvvvxolerny7ml3xfkwzwketqkibupoznqq"
export TF_VAR_ociCompartmentOcid="ocid1.compartment.oc1..aaaaaaaalfq7lr6xf2malitokbw7gwlhhqg2fqpeyi6oz62s3q3tdagjavdq"
export TF_VAR_ociRegionIdentifier="mx-queretaro-1"
export TF_VAR_mtdrDbName="MTDRDB"
export TF_VAR_runName="a01637405"
export TF_VAR_mtdrKey=$(openssl rand -hex 16)

# OCI Registry Variables
export REGION="mx-queretaro-1"
export REGISTRY="${REGION}.ocir.io"
export NAMESPACE="ax83el69bkfn"
export TG_REPO="mtdr-ocir-telegram"
export WEB_REPO="mtdr-ocir-web"
export FRONTEND_REPO="mtdr-ocir-front"
export TAG="latest"

echo "Environment variables set successfully."