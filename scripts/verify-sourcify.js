const fs = require('fs');
const path = require('path');
const https = require('https');

async function verifyOnSourcify() {
  // Your deployed contract details
  const contractAddress = '0x99ce72f3882DA665e3Ea89A3242E9b4C86914395';
  const chainId = '999'; // HyperEVM chain ID
  const sourcifyApiUrl = 'https://sourcify.parsec.finance';

  // Read the deployment artifact
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MultiSender.sol', 'MultiSender.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // Read the contract source file
  const contractPath = path.join(__dirname, '..', 'contracts', 'MultiSender.sol');
  const contractSource = fs.readFileSync(contractPath, 'utf8');

  // Prepare the metadata
  const metadata = {
    compiler: {
      version: '0.8.20+commit.a1b79de6'
    },
    language: 'Solidity',
    output: {
      abi: artifact.abi,
      devdoc: {},
      userdoc: {}
    },
    settings: {
      compilationTarget: {
        'contracts/MultiSender.sol': 'MultiSender'
      },
      evmVersion: 'paris',
      libraries: {},
      metadata: {
        bytecodeHash: 'ipfs'
      },
      optimizer: {
        enabled: true,
        runs: 200
      },
      remappings: []
    },
    sources: {
      'contracts/MultiSender.sol': {
        keccak256: '', // Will be calculated by Sourcify
        urls: []
      }
    },
    version: 1
  };

  console.log('Preparing to verify contract on Sourcify...');
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`API URL: ${sourcifyApiUrl}`);

  // Create form data
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  let body = '';

  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="address"\r\n\r\n`;
  body += `${contractAddress}\r\n`;

  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="chain"\r\n\r\n`;
  body += `${chainId}\r\n`;

  // Add contract source file
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="files"; filename="MultiSender.sol"\r\n`;
  body += `Content-Type: text/plain\r\n\r\n`;
  body += `${contractSource}\r\n`;

  // Add metadata file
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="files"; filename="metadata.json"\r\n`;
  body += `Content-Type: application/json\r\n\r\n`;
  body += `${JSON.stringify(metadata, null, 2)}\r\n`;

  body += `--${boundary}--\r\n`;

  const options = {
    method: 'POST',
    hostname: 'sourcify.parsec.finance',
    path: '/server/verify',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response:', data);

        if (res.statusCode === 200) {
          console.log('\n✅ Contract verified successfully on Sourcify!');
          console.log(`View on HyperEVM Explorer: https://hyperevmscan.io/address/${contractAddress}`);
          resolve(data);
        } else {
          console.error('\n❌ Verification failed');
          console.log('\nTrying alternative verification method...');
          console.log('You can manually verify at: https://hyperevmscan.io/address/' + contractAddress);
          reject(new Error(data));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error);
      console.log('\n💡 Alternative verification options:');
      console.log('1. Visit https://hyperevmscan.io/address/' + contractAddress);
      console.log('2. Use the "Verify & Publish" feature on the block explorer');
      console.log('3. Upload your contract source code manually');
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

verifyOnSourcify().catch(console.error);
