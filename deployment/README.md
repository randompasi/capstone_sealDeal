Ifrastrucure as code
Code and tools to create needed infrastructure in Azure and configuration how to deploy project to server and run.


# Terraform #

Building Infrastructure for the project in Azure.

- All files will be in terraform folder

## Requirements ##

- Terraform on computer
- SSH key that will be saved to server for shh connections(more info later)
-  Service principal for terraform to atheticate itself to azure

## Setting up Infrastrucure ##
- from templa-credentials.json create credentials.json
- add pricipal service data to credentials.json file
- use "terraform init" to initialize the terraform to work with azure.
- Usefull commands:
- plan: will go through all scripts and show waht has beem changed if there is any
- apply: changes azure configuration if needed. Configuration print out ip addres of server when run.
- destroy: destroyes everything on azure

# Ansible #

Updates and configuring linux virtual machine.
Updates and deployes production docker containers with github CI/CD pipeline.

# Building Docker Files of Production For Local use #

- run ansible file deployToProduction.yml
