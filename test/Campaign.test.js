const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy({ data: compiledFactory.bytecode })
                    .send({ from: accounts[0], gas: '1000000' });
              
    await factory.methods.createNewCampaign('100').send({ from: accounts[0], gas: '1000000' }); 

    [campaignAddress] = await factory.methods.getDeployedCampaign().call();

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {

    it('should deploy a factory and then campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('should mark factory caller as the campaign manager', async () => {

        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('should mark sender as approver when ether contributted', async () => {
        
        await campaign.methods.contribute().send({ value: '500', from: accounts[1], gas: '1000000' });

        const hasContributed = await campaign.methods.approvers(accounts[1]).call();

        assert(hasContributed);
    });

    it('should not mark sender as approver when ether not contributted', async () => {
        
        const hasContributed = await campaign.methods.approvers(accounts[1]).call();

        assert(hasContributed === false);
    });

    it('should reject when user contributes below minimum', async () => {
        
        try{
            await campaign.methods.contribute().send({ value: '99', from: accounts[1], gas: '1000000' });
            assert.fail('error not thrown when contributing');
        }
        catch(error) {
            assert(error)
        }
    });

    it('should alllow to create request by manager', async () => {

        await campaign.methods
                .createRequest('Buy laptop', '1000', accounts[1])
                .send({ from: accounts[0], gas: '1000000' });
        
        const request = await campaign.methods.requests(0).call();

        // TODO: better assertions
        assert.equal(request.description, 'Buy laptop');
    });

    it('should process request [e2e test]', async () => {

        const accountManager = accounts[0];
        const accountReceiverOfRequest = accounts[1];
        const accountContributor = accounts[2];

        const weiToFloat = wei => parseFloat(web3.utils.fromWei(wei, 'ether'));

        await campaign.methods.contribute().send({
            from: accountContributor,
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
                .createRequest('Buy laptop', web3.utils.toWei('3', 'ether'), accountReceiverOfRequest)
                .send({ from: accountManager, gas: '1000000' }); 

        await campaign.methods.approveRequest(0).send({ from: accountContributor, gas: '1000000' });

        let oldBalance = await web3.eth.getBalance(accountReceiverOfRequest);
        oldBalance = weiToFloat(oldBalance);

        await campaign.methods.finalizeRequest(0).send({ from: accountManager, gas: '1000000' });

        let balance = await web3.eth.getBalance(accountReceiverOfRequest);
        balance = weiToFloat(balance);

        // TODO: improve this assertion
        assert(balance === oldBalance + 3);
    });
});
