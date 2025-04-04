# Bicep

This directory contains bicep templates that are used for various tasks in this project. If you want to use your own parameter files, this repo is setup to copy the `*.bicepparam` files and create your own with the `dev.bicepparam` extension. They will be ignored from check-in. I'm using [Azure Verifed Modules](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/bicep-resource-modules/) where they exist to create these bicep files.

1. **Create Static Web App**

    `create-static-site.bicep` is the main template for creating a static web app. Use the command below after creating the infrastructure to get the deployment token

    ```bash
    az staticwebapp secrets list --name <static_webapp_name> --resource-group <resource_group_name>
    ```

## Deploying with Bicep

Bicep is an Infrastructure as Code (IaC) language developed by Microsoft for deploying Azure resources in a declarative manner. It simplifies the deployment process and enhances readability and maintainability of your infrastructure code. Here is the [official Bicep documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)

### Prerequisites

Before you begin, ensure you have the following installed:

- Azure CLI: Bicep is integrated directly into the Azure CLI and provides first-class support for deploying Bicep files.
- Bicep CLI: While not strictly necessary due to Azure CLI integration, the Bicep CLI can be useful for compiling, decompiling, and validating Bicep files.

### Steps to Deploy

1. **Login to Azure**

    Start by logging into Azure with the Azure CLI:

    ```bash
    az login
    ```

2. **Set your subscription**

    Make sure you're working with the correct Azure subscription:

    ```bash
    az account set --subscription "<Your-Subscription-ID>"
    ```

3. **(Optional)Compile Bicep file**

    If you have Bicep CLI installed, you can manually compile your Bicep file to an ARM template. This step is optional because Azure CLI compiles Bicep files automatically on deployment.

    ```bash
    bicep build <your-file>.bicep
    ```

4. **Create Resource Group**

    If you've already created the ResourceGroup then you can skip this step.

    ```bash
    az group create --name <resource-group-name> --location <location>
    ```

5. **Deploy the Bicep file**

    Use the Azure CLI to deploy your Bicep file. Replace `<your-resource-group>` with your Azure Resource Group name, and `<your-deployment-name>` with a name for your deployment.  **Note**: since we are using bicep parameter files and they are tied to one bicep file we don't need the --template-file switch.  See [Bicep file with parameters file](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/parameter-files?tabs=Bicep#deploy-bicep-file-with-parameters-file) for more info.

    ```bash
    az deployment group create --resource-group <your-resource-group> --name <your-deployment-name> --parameters <your-file>.bicepparam
    ```
