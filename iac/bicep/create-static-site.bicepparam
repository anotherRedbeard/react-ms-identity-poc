using './create-static-site.bicep'

param staticSiteName = '<your-site-name>'
param location = '<azure-region>'
param siteSku = 'Free'
param ghBranch = 'main'
param ghRepoUrl = '<your-github-repo-url>'
