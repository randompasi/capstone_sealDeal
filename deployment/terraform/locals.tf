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
    }
}