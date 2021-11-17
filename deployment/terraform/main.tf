# Configure the Microsoft Azure Provider
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}

locals {
    # get json
    credentials = jsondecode(file("${path.module}/credentials.json"))

   }


provider "azurerm" {
  features {
     key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
  subscription_id   =  local.credentials.subscrition
  tenant_id         = local.credentials.tenant
  client_id         = local.credentials.appId
  client_secret     = local.credentials.password
}

# Create a resource group if it doesn't exist
resource "azurerm_resource_group" "capstoneterraformgroup" {
  name     = "capstoneResourceGroup"
  location = var.azure_region

  tags = {
    environment = "Capstone Demo"
  }
}

# Create virtual network
resource "azurerm_virtual_network" "capstoneterraformnetwork" {
  name                = "capstoneVnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.capstoneterraformgroup.name

  tags = {
    environment = "Capstone Demo"
  }
}


output "account_id" {
  value = data.azurerm_client_config.current.client_id
}
# Create subnet
resource "azurerm_subnet" "capstoneterraformsubnet" {
  name                 = "capstoneSubnet"
  resource_group_name  = azurerm_resource_group.capstoneterraformgroup.name
  virtual_network_name = azurerm_virtual_network.capstoneterraformnetwork.name
  address_prefixes       = ["10.0.2.0/24"]
}

# Create public IPs
resource "azurerm_public_ip" "capstonePublicIP" {
  name                         = "capstonePublicIP"
  location                     = var.azure_region
  resource_group_name          = azurerm_resource_group.capstoneterraformgroup.name
  allocation_method            = "Static"
  idle_timeout_in_minutes      = 30
  domain_name_label            = "capstoneseal"
  tags                         = azurerm_resource_group.capstoneterraformgroup.tags
}


data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "agw" {
  name                       = "capstone3"
  location                   = azurerm_resource_group.capstoneterraformgroup.location
  resource_group_name        = azurerm_resource_group.capstoneterraformgroup.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name                   = "standard"


  tags = azurerm_resource_group.capstoneterraformgroup.tags

   access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    certificate_permissions = [
      "create",
    "get",
    "list"
    ]

    key_permissions = [
         "get", "list"
    ]

    secret_permissions = [
      "Get","list","set","delete"
    ]
    storage_permissions = [
      "Get",
    ]
  }
}

resource "azurerm_key_vault_secret" "example" {
  name         = "secret-sauce"
  value        = "szechuan"
  key_vault_id = azurerm_key_vault.agw.id
}

resource "azurerm_key_vault_certificate" "mysite1" {
  name         = "capstoneSite"
  key_vault_id = azurerm_key_vault.agw.id

  certificate_policy {
    issuer_parameters {
      name = "Self"
    }

    key_properties {
      exportable = true
      key_size   = 2048
      key_type   = "RSA"
      reuse_key  = true
      }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        days_before_expiry = 30
      }
    }

    secret_properties {
      content_type = "application/x-pkcs12"
    }

    x509_certificate_properties {
      # Server Authentication = 1.3.6.1.5.5.7.3.1
      # Client Authentication = 1.3.6.1.5.5.7.3.2
      extended_key_usage = ["1.3.6.1.5.5.7.3.1"]

      key_usage = [
        "cRLSign",
        "dataEncipherment",
        "digitalSignature",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
      ]

      subject_alternative_names {
        dns_names = ["capstoneseal.northeurope.cloudapp.azure.com"]
      }

      subject            = "CN=capstoneseal.northeurope.cloudapp.azure.com"
      validity_in_months = 12
    }
  }
}

resource "time_sleep" "wait_60_seconds" {
  depends_on = [azurerm_key_vault_certificate.mysite1]

  create_duration = "60s"
}


# Create network interface
resource "azurerm_network_interface" "capstoneTerraformnic" {
  name                      = "network_interface"
  location                  = var.azure_region
  resource_group_name       = azurerm_resource_group.capstoneterraformgroup.name

  ip_configuration {
    name                          = "capstoneNicConfiguration"
    subnet_id                     = azurerm_subnet.capstoneterraformsubnet.id
    private_ip_address_allocation = "Static"
    private_ip_address            = "10.0.2.5"
    public_ip_address_id          = azurerm_public_ip.capstonePublicIP.id
  }

  tags = {
    environment = "Terraform Demo"
  }
}




# resource "azurerm_application_gateway" "network" {
#   depends_on          = [azurerm_key_vault_certificate.mysite1, time_sleep.wait_60_seconds]
#   name                = "capstone-appgateway"
#   resource_group_name = azurerm_resource_group.capstoneterraformgroup.name
#   location            = var.azure_region
#   enable_http2        = true

#   sku {
#     name     = "Standard_Small"
#     tier     = "Standard"
#     capacity = 2
#   }

#   gateway_ip_configuration {
#     name      = "my-gateway-ip-configuration"
#     subnet_id = azurerm_subnet.capstoneterraformsubnet.id
#   }

#    ssl_certificate {
#     name                = azurerm_key_vault_certificate.mysite1.name
#     key_vault_secret_id = azurerm_key_vault_certificate.mysite1.secret_id
#   }


#   identity {
#     type         = "UserAssigned"
#     identity_ids = [azurerm_user_assigned_identity.agw.id]
#   }

#     frontend_ip_configuration {
#     name                 = "frontend-public"
#     public_ip_address_id = azurerm_public_ip.capstonePublicIP.id
#   }

#    frontend_port {
#     name = "${local.frontend_port_name}-80"
#     port = 80
#   }

#   frontend_port {
#     name = "${local.frontend_port_name}-443"
#     port = 443
#   }


#   backend_address_pool {
#     name  = local.backend_address_pool_name
#   }

#    backend_http_settings {
#     name                  = "backendSetting"
#     cookie_based_affinity = "Disabled"
#     path                  = ""
#     port                  = 80
#     protocol              = "Http"
#     request_timeout       = 60
#   }

#    http_listener {
#     name                           = "${local.listener_name}-http"
#     frontend_ip_configuration_name = "${local.frontend_ip_configuration_name}-public"
#     frontend_port_name             = "${local.frontend_port_name}-80"
#     protocol                       = "Http"
#   }

#   http_listener {
#     name                           = "${local.listener_name}-https"
#     frontend_ip_configuration_name = "${local.frontend_ip_configuration_name}-public"
#     frontend_port_name             = "${local.frontend_port_name}-443"
#     protocol                       = "Https"
#     ssl_certificate_name           = azurerm_key_vault_certificate.mysite1.name
#   }

#    request_routing_rule {
#     name                       = "${local.request_routing_rule_name}-https"
#     rule_type                  = "Basic"
#     http_listener_name         = "${local.listener_name}-https"
#     backend_address_pool_name  = local.backend_address_pool_name
#     backend_http_settings_name = local.http_setting_name
#   }

#   redirect_configuration {
#     name                 = local.redirect_configuration_name
#     redirect_type        = "Permanent"
#     include_path         = true
#     include_query_string = true
#     target_listener_name = "${local.listener_name}-https"
#   }

#   request_routing_rule {
#     name                        = "${local.request_routing_rule_name}-http"
#     rule_type                   = "Basic"
#     http_listener_name          = "${local.listener_name}-http"
#     redirect_configuration_name = local.redirect_configuration_name
#   }




# }

# Create Network Security Group
resource "azurerm_network_security_group" "securityGroup" {
  name                = "capstoneNetworkSecurityGroup"
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.capstoneterraformgroup.name

}


#Create Network Security Rules
resource "azurerm_network_security_rule" "security_rules"{
    for_each                   = local.nsgrules
    name                       = each.key
    priority                   = each.value.priority
    direction                  = each.value.direction
    access                     = each.value.access
    protocol                   = each.value.protocol
    source_port_range          = each.value.source_port_range
    destination_port_range     = each.value.destination_port_range
    source_address_prefix      = each.value.source_address_prefix
    destination_address_prefix = each.value.destination_address_prefix
    resource_group_name = azurerm_resource_group.capstoneterraformgroup.name
    network_security_group_name = azurerm_network_security_group.securityGroup.name
}


# Connect the security group to the network interface
resource "azurerm_network_interface_security_group_association" "securityGroupAsssociation" {
  network_interface_id      = azurerm_network_interface.capstoneTerraformnic.id
  network_security_group_id = azurerm_network_security_group.securityGroup.id
}

# Generate random text for a unique storage account name
resource "random_id" "randomId" {
  keepers = {
    # Generate a new ID only when a new resource group is defined
    resource_group = azurerm_resource_group.capstoneterraformgroup.name
  }

  byte_length = 8
}



# Create virtual machine
resource "azurerm_linux_virtual_machine" "capstonevm" {
  name                  = "capstoneVM"
  location              = var.azure_region
   admin_username      = "adminuser"
  resource_group_name   = azurerm_resource_group.capstoneterraformgroup.name
  network_interface_ids = [azurerm_network_interface.capstoneTerraformnic.id]
  size                  = "Standard_B2s"

  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  disable_password_authentication = true

  admin_ssh_key {
    username       = "adminuser"
    public_key     = file("~/.ssh/capstone/capstone_id_rsa.pub")
  }


  tags = {
    environment = "Terraform Demo"
  }
}

data "azurerm_public_ip" "capstonePublicIP"{
  name                = azurerm_public_ip.capstonePublicIP.name
  resource_group_name = azurerm_linux_virtual_machine.capstonevm.resource_group_name

}


resource "azurerm_container_registry" "capstoneRegistery" {
  name                = "capstoneRegistery"
  resource_group_name = azurerm_resource_group.capstoneterraformgroup.name
  location            = azurerm_resource_group.capstoneterraformgroup.location
  sku                 = "Basic"
  admin_enabled       = true
}
