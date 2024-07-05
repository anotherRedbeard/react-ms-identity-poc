@description('Provide the name of the static site instance.')
param staticSiteName string = ''

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
  }
}

//@description('Output the backend id property for later use')
//output deploymentId string = service.outputs
