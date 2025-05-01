//Copyright (c) 2022 Oracle and/or its affiliates.
//Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
variable "ociTenancyOcid" {
  default = "ocid1.tenancy.oc1..aaaaaaaan7jtdvh7y4rmm4kw67gkkottukneixg2v4gutcexypdszr62vdiq"
}
variable "ociUserOcid" {
  default = "ocid1.user.oc1..aaaaaaaaaefwdtlobyok26cptkvvvxolerny7ml3xfkwzwketqkibupoznqq"
}

variable "ociCompartmentOcid" {
  default = "ocid1.compartment.oc1..aaaaaaaalfq7lr6xf2malitokbw7gwlhhqg2fqpeyi6oz62s3q3tdagjavdq"
}

variable "ociRegionIdentifier" {
  default = "mx-queretaro-1"
}

variable "mtdrDbName" {
    default = "MTDRDB"
}

variable "runName" {
  default = "a01637405"
}

# mtdrKey is a unique generated id
variable "mtdrKey" {

}

