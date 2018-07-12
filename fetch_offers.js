const Eos = require('eosjs');

// ----------------------------------

const network_address = 'http://jungle.cryptolions.io:38888';
const betting_contract = 'esbcontrac1';

// ----------------------------------

/**
 * Function fetching offers from eos contract
 */
function fetch_offers(account){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
    });

    // Getting offers

    eos.getTableRows({'code':betting_contract,'scope':account, 'table':'offers', 'json': true}).then(function(response){

        for(var i=0;i<response['rows'].length;i++){
            let offer = response['rows'][i];

            if(offer['status']===0){
                console.log("Pending: "+ JSON.stringify(offer))
            }else{
                console.log("Matched "+ JSON.stringify(offer))
            }
        }
    });
}

fetch_offers('user1');
