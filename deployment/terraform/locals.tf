locals {
    nsgrules = {
        ssh = {
             name                       = "SSH_RULE"
             priority                   = 100
             direction                  = "Inbound"
             access                     = "Allow"
             protocol                   = "Tcp"
             source_port_range          = "*"
             destination_port_range     = "22"
             source_address_prefix      = "*"
             destination_address_prefix = "*"
        }



        http = {
            name                       = "HTTP_RULE"
            priority                   = 201
            direction                  = "Inbound"
            access                     = "Allow"
            protocol                   = "Tcp"
            source_port_range          = "*"
            destination_port_range     = "80"
            source_address_prefix      = "*"
            destination_address_prefix = "*"
        }

        https = {
            name                       = "HTTPS_RULE"
            priority                   = 101
            direction                  = "Inbound"
            access                     = "Allow"
            protocol                   = "Tcp"
            source_port_range          = "*"
            destination_port_range     = "443"
            source_address_prefix      = "*"
            destination_address_prefix = "*"
        }
        
        outbound = {
            name                       = "OUTBOUND_RULE"
            priority                   = 103
            direction                  = "Outbound"
            access                     = "Allow"
            protocol                   = "Tcp"
            source_port_range          = "*"
            destination_port_range     = "*"
            source_address_prefix      = "*"
            destination_address_prefix = "*"
        }
    }

    
    prefix   = "capstone"
  backend_address_pool_name      = "${azurerm_virtual_network.capstoneterraformnetwork.name}-beap"
  frontend_port_name             = "${azurerm_virtual_network.capstoneterraformnetwork.name}-feport"
  frontend_ip_configuration_name = "${azurerm_virtual_network.capstoneterraformnetwork.name}-feip"
  http_setting_name              = "${azurerm_virtual_network.capstoneterraformnetwork.name}-be-htst"
  listener_name                  = "${azurerm_virtual_network.capstoneterraformnetwork.name}-httplstn"
  request_routing_rule_name      = "${azurerm_virtual_network.capstoneterraformnetwork.name}-rqrt"
  redirect_configuration_name    = "${azurerm_virtual_network.capstoneterraformnetwork.name}-rdrcfg"
}