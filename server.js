const request = require('request');
const Eos = require('eosjs');

// ----------------------------------

const network_address = 'http://jungle.cryptolions.io:38888';
const betting_contract = 'esbcontrac1';
const house_account = 'house1';
const house_account_private_key = '----REPLACE_WITH_HOUSE_ACCOUNT_PRIVATE_KEY-----';

// ----------------------------------

function create_bet_on_matchbook(price, amount_eos){
    console.log("Create MB offer. Price: "+price+"; EOS: "+amount_eos);
    return 880000+Math.random() * (10000 - 0);
}

function accept_transaction(offer_id, mb_offer_id, amount_eos){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': [ house_account_private_key ]
    });

    eos.transfer({from: house_account, to: betting_contract, quantity: (amount_eos.toFixed(4))+" EOS", memo: 'ao:'+offer_id+':'+mb_offer_id}, (error, result) => {
        console.log("Error: "+JSON.stringify(error));
        console.log("Result: "+JSON.stringify(result));
    })
}


function offers_processor(){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
    });

    // Getting offers

    eos.getTableRows({'code':betting_contract,'scope':betting_contract, 'table':'offers', 'json': true}).then(function(response){

        for(var i=0;i<response['rows'].length;i++){
            let offer = response['rows'][i];

            if(offer['status']===0){

                console.log("Offer "+offer['offer_id']+" waiting for matching");
                mb_offer_id = create_bet_on_matchbook(offer['price'], offer['amount']);

                // calculate
                let eos_amount = ((offer['price']-1.0)*offer['amount'])/10000.0;

                console.log("Eos amount to create lay bet "+eos_amount);
                accept_transaction(offer['offer_id'], mb_offer_id, eos_amount)

            }else{
                console.log("Offer "+offer['offer_id']+" matched")
            }
        }
    });


}

function mainLoop(){
    console.log("-------------> loop");
    //downloadsEvents();
    //setTimeout(mainLoop, 10000)

    update_events()
}


//console.log("-----------> hello");
//setTimeout(mainLoop, 0);

offers_processor()



