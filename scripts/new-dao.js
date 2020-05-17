const KarmaTemplate = artifacts.require("KarmaTemplate")
const Token = artifacts.require("Token")

const DAO_ID = "karma" + Math.random() // Note this must be unique for each deployment, change it for subsequent deployments
const TOKEN_OWNER = "0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"
const NETWORK_ARG = "--network"
const DAO_ID_ARG = "--daoid"

const argValue = (arg, defaultValue) => process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue

const network = () => argValue(NETWORK_ARG, "local")
const daoId = () => argValue(DAO_ID_ARG, DAO_ID)

const karmaTemplateAddress = () => {
  if (network() === "rinkeby") {
    const Arapp = require("../arapp")
    return Arapp.environments.rinkeby.address
  } else if (network() === "mainnet") {
    const Arapp = require("../arapp")
    return Arapp.environments.mainnet.address
  } else {
    const Arapp = require("../arapp_local")
    return Arapp.environments.devnet.address
  }
}

const DAYS = 24 * 60 * 60
const ONE_HUNDRED_PERCENT = 1e18
const ONE_TOKEN = 1e18
const FUNDRAISING_ONE_HUNDRED_PERCENT = 1e6
const FUNDRAISING_ONE_TOKEN = 1e6

// Create dao transaction one config
const ORG_TOKEN_NAME = "Karma"
const ORG_TOKEN_SYMBOL = "KARMA"
const SUPPORT_REQUIRED = 0.5 * ONE_HUNDRED_PERCENT
const MIN_ACCEPTANCE_QUORUM = 0.2 * ONE_HUNDRED_PERCENT
const VOTE_DURATION_BLOCKS = 15
const VOTE_BUFFER_BLOCKS = 10
const VOTE_EXECUTION_DELAY_BLOCKS = 5
const VOTING_SETTINGS = [SUPPORT_REQUIRED, MIN_ACCEPTANCE_QUORUM, VOTE_DURATION_BLOCKS, VOTE_BUFFER_BLOCKS, VOTE_EXECUTION_DELAY_BLOCKS]
const HOLDERS = ["0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"]
const STAKES = [1000000e18]

// Create dao transaction two config
const TOLLGATE_FEE = ONE_TOKEN * 1000
const BLOCKS_PER_YEAR = 31557600 / 15 // seeconds per year divided by 15 (assumes 15 second average block time)
const ISSUANCE_RATE = 1e18 / BLOCKS_PER_YEAR // per Block Inflation Rate
const DECAY = 9999599 // 3 days halftime. halftime_alpha = (1/2)**(1/t)
const MAX_RATIO = 1000000 // 10 percent
const MIN_THRESHOLD = 0.005 // half a percent
const WEIGHT = MAX_RATIO ** 2 * MIN_THRESHOLD / 10000000 // determine weight based on MAX_RATIO and MIN_THRESHOLD
const CONVICTION_SETTINGS = [DECAY, MAX_RATIO, WEIGHT]

module.exports = async (callback) => {
  try {
    const karmaTemplate = await KarmaTemplate.at(karmaTemplateAddress())

    const createDaoTxOneReceipt = await karmaTemplate.createDaoTxOne(
      ORG_TOKEN_NAME,
      ORG_TOKEN_SYMBOL,
      HOLDERS,
      STAKES,
      VOTING_SETTINGS
    );
    console.log(`Tx One Complete. DAO address: ${createDaoTxOneReceipt.logs.find(x => x.event === "DeployDao").args.dao} Gas used: ${createDaoTxOneReceipt.receipt.gasUsed} `)

    const createDaoTxTwoReceipt = await karmaTemplate.createDaoTxTwo(
      daoId(),
      TOLLGATE_FEE,
      ISSUANCE_RATE,
      CONVICTION_SETTINGS
    )
    console.log(`Tx Two Complete. Gas used: ${createDaoTxTwoReceipt.receipt.gasUsed}`)


  } catch (error) {
    console.log(error)
  }
  callback()
}
