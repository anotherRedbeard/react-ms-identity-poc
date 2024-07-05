# React MS Identity Proof of Concept

This project demonstrates a React single-page application (SPA) that integrates with Microsoft Identity Platform using Entra ID to authenticate users and acquire tokens for accessing protected resources.  It was created mostly following the [React single-page application using MSAL React](https://learn.microsoft.com/en-us/samples/azure-samples/ms-identity-ciam-javascript-tutorial/ms-identity-ciam-javascript-tutorial-1-sign-in-react/) project. The main difference is that I am using regular Entra instead of Entra External ID.  The project also adds how to host the application on Azure Static Web Apps.

## Features

- **Authentication**: Utilizes [@azure/msal-react](https://www.npmjs.com/package/@azure/msal-react) for handling authentication with Microsoft Identity Platform.
- **Azure Static Web Apps**: Instructions on deploying to Azure Static Web Apps for seamless hosting and scalability.
- **Protected API Calls**: Demonstrates how to call a protected web API using tokens acquired via MSAL.
- **Infrastructure as Code (IAC)**: Take a look at the [Bicep](https://github.com/anotherRedbeard/react-ms-identity-poc/tree/main/iac/bicep) templates to get this up and running in your subscription.
- *coming soon* - **Add Azure Configuration to get secrets**

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/en-us/free/).
- Node.js installed on your local machine. [Download Node.js](https://nodejs.org/en/download/).
- A configured Azure Active Directory (AAD) tenant. [Follow these instructions](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant) to create one.
- Two App Registrations are needed for this POC. One will represent the backend API and the other one will represent this app (the frontend). The backend app registration will need to expose two roles:
  - Todolist.Read
  - Todolist.ReadWrite

  The frontend app will need to be configured to add these `API Permissions` so that when the MSAL library requests the access token, it will contain these two roles. The setup is similar to how you can use an [OAuth Server](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-oauth2#register-applications-with-the-oauth-server) in Azure API Management.  API Management is not necessary to use with this POC I am just referring to the documentation on how to setup an OAuth server there as it is similar.
- An implementation of the Todo API. The one I'm using is in [another repo](https://github.com/anotherRedbeard/web-api-demo-container) of mine and can be deployed to an App Server, Container App, or AKS. Follow the instructions on that repo for specifics. You will need to implement the Azure Configuration feature on that example for this POC to work fully.

- Populate all of the GitHub secrets with values from your environment:

    | Secret Name | Description |
    | ----------- | ----------- |
    |REACT_APP_APIM_SUBSCRIPTION|The subscription id for the API |
    |REACT_APP_CLIENT_ID|The client id of the react app |
    |REACT_APP_AUTHORITY|The authority url for the Entra ID tenant|
    |REACT_APP_TODO_API_READ_SCOPE|The full uri for the Todolist.Read scope|
    |REACT_APP_TODO_API_READ_WRITE_SCOPE|The full uri for the Todolist.ReadWrite scopt|
    |REACT_APP_API_BASE_ENDPOINT|The base url for the todo api|
    |GITHUB_TOKEN|Automatic token that is generate within Github, you can get more information [here](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)|
    |AZURE_STATIC_WEB_APPS_API_TOKEN|This is the deployment token that is provided by Static WebApp. More info can be found in the [Reset Deployment Tokens](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management) doc.|

    *The `AZURE_STATIC_WEB_APPS_DEPLOYMENT_TOKEN` will need to be set in your github environment before you the automated pipeline will work correctly. You can use the [bicep section](https://github.com/anotherRedbeard/react-ms-identity-poc/blob/main/iac/bicep/README.md) to get the infrastructure to deploy and then use the `az staticwebapp secrets list` command to get the deployment token.*

## Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-repository-url.git
    cd react-ms-identity-poc
    ```

2. **Install dependencies**

    Navigate to the SPA directory and install the project dependencies:

    ```bash
    cd SPA
    npm install
    ```

3. **Configure the application**
    Create a .env file in the SPA directory with your Azure Active Directory details:

    ```bash
    REACT_APP_APIM_SUBSCRIPTION=<subscription_id>
    REACT_APP_CLIENT_ID=<client_id>
    REACT_APP_AUTHORITY=https://login.microsoftonline.com/<aad_tenant_id>
    REACT_APP_TODO_API_READ_SCOPE=<read_scope_uri>
    REACT_APP_TODO_API_READ_WRITE_SCOPE=<read_write_scope_uri>
    REACT_APP_API_BASE_ENDPOINT=<api_endpoint_uri>
    ```

4. **Run the application**

    Start the development server:

    ```bash
    npm start
    ```

    Your browser should open to `http://localhost:3000` displaying the application

## Deployment Pipeline Description 

The project is configured to automatically deploy to Azure Static Web Apps through a GitHub Actions workflow. This workflow is triggered on push events to the `main` branch and on pull request events against the `main` branch. It can also be manually triggered via the `workflow_dispatch` event.

### Workflow Steps

1. **Checkout**: The workflow starts by checking out the latest code from the `main` branch or the pull request branch.

2. **Environment Setup**: It then sets up the environment by creating an `.env.production` file with necessary environment variables. These variables are securely stored in GitHub Secrets and are used to configure the application for production.

3. **Build and Deploy**: The workflow uses the `Azure/static-web-apps-deploy@v1` GitHub Action to build the React application and deploy it to Azure Static Web Apps. The action is configured with:
    - `app_location`: Specifies the location of the React application code.
    - `api_location`: Since this project does not contain an API, this is set to an empty value.
    - `output_location`: Specifies the directory where the build output is located, typically `build`.

## Deployment to Azure via GitHub Actions

Here are the steps you can follow to deploy this into Azure.

1. **Create Static Web App**: Use the bicep template [here](https://github.com/anotherRedbeard/react-ms-identity-poc/tree/main/iac/bicep) to get the Static Web App created.

2. **Get the deployment token**: You will need to run the following command to get the deployment token from the newly created Static Web App and populated it in your GitHub secret.

    ```bash
    az staticwebapp secrets list --name <static_webapp_name> --resource-group <resource_group_name>
    ```

3. **Redirect URI and CORS**: You will need to update your redirect URI in your app registration and you might also need to add it to CORS.
