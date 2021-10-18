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
  features {}
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
  allocation_method            = "Dynamic"
  idle_timeout_in_minutes = 30

  tags = {
    environment = "Terraform Demo"
  }
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
    private_ip_address = "10.0.2.5"
    public_ip_address_id          = azurerm_public_ip.capstonePublicIP.id
  }

  tags = {
    environment = "Terraform Demo"
  }
}

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
  name                  = "myVM"
  location              = var.azure_region
   admin_username      = "adminuser"
  resource_group_name   = azurerm_resource_group.capstoneterraformgroup.name
  network_interface_ids = [azurerm_network_interface.capstoneTerraformnic.id]
  size                  = "Standard_DS1_v2"

  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
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
  admin_enabled       = false
}

