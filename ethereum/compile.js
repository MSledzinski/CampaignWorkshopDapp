const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildOutPath = path.resolve(__dirname, 'build');

fs.removeSync(buildOutPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildOutPath);

console.log(output);
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildOutPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}

console.log('done');