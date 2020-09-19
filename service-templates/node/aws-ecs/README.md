### {{swagger.info.title}}

{{swagger.info.description}}


#### Local Development

To bootstrap a local development environment:

1. Do `npm install` (and optionally `npm audit fix`)
2. Do `docker-compose up`


#### Terraform Configuration and Deployments (AWS and Terraform Cloud)

_Note the following instruction apply only to users who wish to use the included Terraform and AWS configuration for zero-touch deployment to AWS_

For templates configured to deploy to Amazon Web Services, ensure that the **AWS Access Key ID** and **AWS Secret Access Key** are stored in the secrets section of the Github repository the application is stored in. Github organization-level secrets can also work but require updating the Github Workflow pipeline configuration accordingly.

Find the pipeline configuration file in the `./.github/workflows` directory.

This repo is pre-configured to use Terraform Cloud to plan and apply Terraform configurations and manage infrastructure state. 

Please ensure that:
* you have a Terraform Cloud account set up and that you have selected the repository housing this code for VCS integration in the Terraform Cloud dashboard.
* you have configured the **AWS Access Key ID** and **AWS Secret Access Key** in the secrets section of the Terraform Cloud dashboard.

In order to use the zero-touch configuration provided in this template _ensure your API has a `/health` endpoint that returns a `200` HTTP status code_. This is required by the Terraform configuration in order to use Amazon's automated health checks for services running on Amazon Elastic Container Service. To disable automated health checks update the Terraform configuration located in `./tf/main.tf`.

To ensure successful Terraform plans and applys using the zero-touch configuration provided, _download the following custom Terraform provider_ located [here](https://github.com/seanttaylor/custom_provider_TF_Cloud/blob/master/.terraform/plugins/linux_amd64/terraform-provider-environment). 

You will need to place the downloaded binary file in `./tf/.terraform/plugins/linux_amd64`. 

This custom provider allows the included Terraform configuration to access environment variables automatically injected by the Terraform Cloud virtual machine during runs and applys ([see Terraform docs](https://www.terraform.io/docs/cloud/run/run-environment.html]).) 

If you do not wish to make use of the environment variables available during Terraform executions, _you do not need this file_. However you will need to remove any references to these environment variables in `main.tf`. You will also need to update the Github Worklfow pipeline file as it uses the git commit sha to tag Docker images before pushing the images to AWS Elastic Container Registry.


#### Notes

* Documentation on Github Workflows [here](https://help.github.com/en/actions).