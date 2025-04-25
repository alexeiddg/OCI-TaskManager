locals {
  repository_suffixes = toset([
    "webapp-springboot",
    "apiserver-springboot",
    "worker-springboot"
  ])
  # -----------------------------
}

resource "oci_artifacts_container_repository" "springboot_apps" {
  for_each = local.repository_suffixes

  compartment_id = var.ociCompartmentOcid
  display_name = "${var.runName}/${var.mtdrKey}/${each.value}"

  is_public = true
}