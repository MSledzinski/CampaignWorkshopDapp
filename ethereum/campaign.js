import web3 from './web3';
import CompiledCampaign from './build/Campaign.json';

export default (address) => {

    const instance = new web3.eth.Contract(
        JSON.parse(CompiledCampaign.interface),
        address
    );

    return instance;
};