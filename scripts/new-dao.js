const KarmaTemplate = artifacts.require("KarmaTemplate")
const Token = artifacts.require("Token")

const DAO_ID = "karma" + Math.random() // Note this must be unique for each deployment, change it for subsequent deployments
const TOKEN_OWNER = "0x625236038836CecC532664915BD0399647E7826b"
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
  } else if (network() === "xdai") {
    const Arapp = require("../arapp")
    return Arapp.environments.xdai.address
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
const ORG_TOKEN_NAME = "Honey"
const ORG_TOKEN_SYMBOL = "HNY"
const SUPPORT_REQUIRED = 0.5 * ONE_HUNDRED_PERCENT
const MIN_ACCEPTANCE_QUORUM = 0.1 * ONE_HUNDRED_PERCENT
const VOTE_DURATION_BLOCKS = 241920 // ~14 days
const VOTE_BUFFER_BLOCKS = 5760 // 8 hours
const VOTE_EXECUTION_DELAY_BLOCKS = 34560 // 48 hours
const VOTING_SETTINGS = [SUPPORT_REQUIRED, MIN_ACCEPTANCE_QUORUM, VOTE_DURATION_BLOCKS, VOTE_BUFFER_BLOCKS, VOTE_EXECUTION_DELAY_BLOCKS]
const HOLDERS = ["0x625236038836CecC532664915BD0399647E7826b", "0xa328500Eab25698b8b146D195F35f5b26C93AAEe","0xdf8f53B9f83e611e1154402992c6F6CB7Daf246c","0x5141970563C7d70a129A05f575e9e34DF4bD81d8","0xB24b54FE5a3ADcB4cb3B27d31B6C7f7E9F6A73a7", "0x60a9372862bD752CD02D9AE482F94Cd2fe92A0Bf", "0xf632Ce27Ea72deA30d30C1A9700B6b3bCeAA05cF", "0xB4eF7Ef49B81eb138106ED891570E07bf29Aaba2", "0x6bCE4F3aD3A9b9e98982E94Da3352C94d06dFCB1", "0x5EE3715Ca6063010De18BC55b5a2B0f10ab91aC2", "0x75B98710D5995AB9992F02492B7568b43133161D", "0xb18B276815d90e86EF0878E6ff57f765Ef444E8d", "0x81aaA9a7a8358cC2971B9b8dE72aCCe6d7862BC8", "0x95D9bED31423eb7d5B68511E0352Eae39a3CDD20", "0x839395e20bbB182fa440d08F850E6c7A8f6F0780", "0xDF290293C4A4d6eBe38Fd7085d7721041f927E0a", "0x778549Eb292AC98A96a05E122967f22eFA003707", "0x4194cE73AC3FBBeCE8fFa878c2B5A8C90333E724", "0x83E57888cd55C3ea1cfbf0114C963564d81e318d", "0x00862A702fDF600c4446D847341fDFAdAddAAbB0", "0x0f10f27fbE3622e7d4BdF1f141c6E50Ed8845AF6", "0xfA3D9807bFb82dD67Ed2f83E905DF63B8DA9E23f", "0x352346b3628529c29585bFD0aE0382bD5E49382b", "0xBFc7CAE0Fad9B346270Ae8fde24827D2D779eF07", "0x1338c277e03fbE9D6B1b3b655f0E567C0dCAAc4a", "0xCac20E53C2bF16BCC5251f5Ab98783C0DA1edBCE", "0xdC0046B52e2E38AEe2271B6171ebb65cCD337518", "0x5A47e860cC1EA1DBc87b54dAdcC7752957cC7AaC"  ]
const STAKES = [8048.39e18, 2351.43e18, 2020.93e18, 1768.51e18, 1513.63e18, 1264.93e18, 1070.26e18, 450.19e18, 355.26e18, 293.86e18, 261.62e18, 219.22e18, 186.96e18, 147.43e18, 139.08e18, 126.4e18, 113.06e18, 103.16e18, 98.72e18, 90.66e18, 75.67e18, 72.67e18, 50e18, 50e18, 49.11e18, 38.97e18, 33.86e18, 30.27e18]

// Create dao transaction two config
const TOLLGATE_FEE = ONE_TOKEN * 100
const BLOCKS_PER_YEAR = 31557600 / 5 // seeconds per year divided by 15 (assumes 15 second average block time)
const ISSUANCE_RATE = 60e18 / BLOCKS_PER_YEAR // per Block Inflation Rate
// const DECAY = 9999599 // 3 days halftime. halftime_alpha = (1/2)**(1/t)
const DECAY= 9999799 // 48 hours halftime
const MAX_RATIO = 1000000 // 10 percent
const MIN_THRESHOLD = 0.01 // half a percent
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
