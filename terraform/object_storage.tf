data oci_objectstorage_namespace namespace {
  compartment_id = var.ociCompartmentOcid
}

resource "oci_objectstorage_bucket" dbbucket {
  namespace = data.oci_objectstorage_namespace.namespace.namespace
  compartment_id = var.ociCompartmentOcid
  name = "${var.runName}-${var.mtdrKey}"
}