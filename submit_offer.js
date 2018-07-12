const Eos = require('eosjs');
const express = require('express');
const bodyParser = require('body-parser');

// ----------------------------------

const network_address = 'http://jungle.cryptolions.io:38888';
const betting_contract = 'esbcontrac1';
const user_account = 'user1';
const user_account_private_key = '----REPLACE_WITH_HOUSE_ACCOUNT_PRIVATE_KEY-----';

// ----------------------------------

function submit_offer(runner_id, odds, amount_eos){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': [ user_account_private_key ]
    });

    eos.transfer({from: user_account, to: betting_contract, quantity: (amount_eos.toFixed(4))+" EOS", memo: 'so:'+runner_id+':'+(odds*1000)}, (error, result) => {

        if(result===undefined){
            console.log("Error: "+JSON.stringify(error))
        }else{
            console.log("Success: "+JSON.stringify(result))
        }
    })
}

let runner_id = 110000+Math.random() * 10000;
submit_offer(runner_id, 3.5, 1);
