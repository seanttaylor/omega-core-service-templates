### Omega Terraform Template


#### Template Folder

These folders provide templates for running Terraform locally via Local Stack as well as running Terraform to actually to create live infrastructure. 
Below are some tips, tricks, hazards and helpful hints observed while optimizing the Omega Framework for use with Terraform.

#### Getting Started

* **Running the terraform container**
    * Use the Dockerfile in this folder to build a custom Docker image that allows running terraform as in Docker container
    * When running the container ensure to use volume mount and ensure all Terraform variables are supplied
    * Example command: `docker run -it -v echo $PWD/tf/remote:/tf my-terraform plan -var echo access_key=$AWS_ACCESS_KEY -var echo secret_key=$AWS_SECRET_KEY /tf`
    * **Important**: Ensure that any echo commands are wrapped in _backticks_ (e.g. `-var` (_backtick_) `echo access=key=$AWS_ACCESS_KEY`(_backtick_) (Backticks not shown here becasue of markdown limitations.)

* **Debugging the Terraform container**
    * When the container is erroring on the `plan` or `apply` command:
        1. Try destroying and rebuilding the container
        2. Ensure volumes and folders are correctly mapped 