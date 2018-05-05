import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// TODO: read address from file
const factoryInstance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xeFA6D11BAF48dD5876498658e241089d18485CC9');

export default factoryInstance;