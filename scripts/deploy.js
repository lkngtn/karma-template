const deployTemplate = require('@aragon/templates-shared/scripts/deploy-template')

const TEMPLATE_NAME = 'karma-template'
const CONTRACT_NAME = 'KarmaTemplate'

module.exports = (callback) => {
  deployTemplate(web3, artifacts, TEMPLATE_NAME, CONTRACT_NAME)
    .then(template => {
      console.log("Karma Template address: ", template.address)
    })
    .catch(error => console.log(error))
    .finally(callback)
}
