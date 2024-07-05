@description('Provide the name of the static site instance.')
param staticSiteName string = ''
@description('Provide the url of the github repo that stores the code.')
param ghRepoUrl string = ''
@description('Provide the name of the branch for the github repo that stores the code.')
param ghBranch string = ''

@description('Provide the location of the static site instance.')
param location string = resourceGroup().location

@allowed([
  'Free'
  'Standard'
])
@description('The name of the static site sku.')
param siteSku string = 'Standard'

module service 'br/public:avm/res/web/static-site:0.3.1' = {
  name: 'staticSiteDeployment'
  params: {
    // Required parameters
    name: staticSiteName
    // Non-required parameters
    sku: siteSku
    location: location
    managedIdentities: {
      systemAssigned: true
    }
    branch: ghBranch
    repositoryUrl: ghRepoUrl
  }
}

//@description('Output the backend id property for later use')
//output deploymentId string = service.outputs
