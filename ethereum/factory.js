import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// TODO: read address from file
const factoryInstance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x5b9b27A0230Fba93cbDEd037112474E84364fBA6');

export default factoryInstance;