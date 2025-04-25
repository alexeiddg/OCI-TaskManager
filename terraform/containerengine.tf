resource "oci_containerengine_cluster" "mtdrworkshop_cluster" {
  #Required
  compartment_id      = var.ociCompartmentOcid
  endpoint_config {
    #optional
    is_public_ip_enabled = "true"
    nsg_ids = [
    ]
    subnet_id = oci_core_subnet.endpoint.id
  }
  # changed to match OKE node image
  kubernetes_version  = "v1.32.1"
  # kubernetes_version = local.latest
  name                = "mtdrworkshopcluster"
  vcn_id              = oci_core_vcn.okevcn.id
  #optional

  options{
    service_lb_subnet_ids = [oci_core_subnet.svclb_Subnet.id]

    add_ons {
      #Optional
      is_kubernetes_dashboard_enabled = "false"
      is_tiller_enabled               = "false"
    }
    admission_controller_options {
      #Optional
      is_pod_security_policy_enabled = "false"
    }
    kubernetes_network_config{
      #Optional
      pods_cidr                      = "10.244.0.0/16"
      services_cidr                  = "10.96.0.0/16"
    }
  }
}
resource "oci_containerengine_node_pool" "oke_node_pool" {
  #Required
  cluster_id         = oci_containerengine_cluster.mtdrworkshop_cluster.id
  compartment_id     = var.ociCompartmentOcid
  # changed to match OKE node image
  kubernetes_version  = "1.32.1"
  # kubernetes_version = local.latest
  name               = "Pool"
  node_shape         = "VM.Standard.E3.Flex"

  # Specific config
  # node_shape_config {
  #  memory_in_gbs = 6
  #  ocpus = 2
  # }

  #  node_shape="VM.Standard2.4"
  #  node_shape         = "VM.Standard.B2.1"
  # node_shape         = "VM.Standard.E2.1"
  #  node_shape         = "VM.Standard2.2"

  #subnet_ids         = [oci_core_subnet.nodePool_Subnet_1.id]
  #Optional
  node_config_details {
    placement_configs {
      availability_domain = data.oci_identity_availability_domain.ad1.name
      subnet_id           = oci_core_subnet.nodePool_Subnet.id
    }
    /*    placement_configs {
          availability_domain = data.oci_identity_availability_domain.ad2.name
          subnet_id           = oci_core_subnet.nodePool_Subnet.id
        }
        placement_configs {
          availability_domain = data.oci_identity_availability_domain.ad3.name
          subnet_id           = oci_core_subnet.nodePool_Subnet.id
        }
    */
    size = "3"
  }

  node_source_details {
    #Required
    # image_id    = local.oracle_linux_images.0 # Latest

    # Use x86-64 compatible image for OKE v1.28.2
    image_id    = "ocid1.image.oc1.mx-queretaro-1.aaaaaaaavh3fgphqouv4vxnhuj74v6jhpdgl26okkypntbk27ktloukxr3ea"
    source_type = "IMAGE"
    #Optional
    #boot_volume_size_in_gbs = "60"
  }
  //quantity_per_subnet = 1
  //ssh_public_key      = var.node_pool_ssh_public_key
  //ssh_public_key =  var.resUserPublicKey
}
data "oci_containerengine_cluster_option" "mtdrworkshop_cluster_option" {
  cluster_option_id = "all"
}
data "oci_containerengine_node_pool_option" "mtdrworkshop_node_pool_option" {
  node_pool_option_id = "all"
}
locals {
  all_sources = data.oci_containerengine_node_pool_option.mtdrworkshop_node_pool_option.sources
  oracle_linux_images = [for source in local.all_sources : source.image_id if length(regexall("Oracle-Linux-[0-9]*.[0-9]*-20[0-9]*",source.source_name)) > 0]
}

locals {
  versions = reverse(sort(data.oci_containerengine_cluster_option.mtdrworkshop_cluster_option.kubernetes_versions))
  latest = local.versions[0]
}