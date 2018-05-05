import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // TODO: read provider url from file/env
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/SEP6iVBX1ULDNGKgCCo0')
    web3 = new Web3(provider);
}

export default web3;