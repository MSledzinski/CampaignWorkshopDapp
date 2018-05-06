const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const fs = require('fs-extra');

// TODO: hide creds, event if this is account used only for this workshop project
const provider = new HDWalletProvider(
    'potato twist clean peasant drip flash nature clerk undo link scheme pioneer',
    'https://rinkeby.infura.io/SEP6iVBX1ULDNGKgCCo0'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempt using account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy( { data: compiledFactory.bytecode })
                    .send({ gas: '1000000', from: accounts[0] });

    console.log('Deployed to: ', result.options.address);

    const addresFilePath = 'CONTRACT_ADDRESS';
    if (fs.existsSync(addresFilePath)) {
        fs.removeSync(addresFilePath);
    }

    fs.writeFileSync(addresFilePath, result.options.address);
};

deploy().catch(err => console.log('ERROR', err));