const Eos = require('eosjs');
const express = require('express');
const bodyParser = require('body-parser');

const conf = require('./conf');
// ----------------------------------

const network_address = 'http://jungle.cryptolions.io:38888';
const betting_contract = conf.account.betting_contract;
const betting_contract_private_key = conf.keys.betting_contract;
const house_account = conf.account.house_account;
const house_account_private_key = conf.keys.house_account;

// ----------------------------------

/**
 * @param mb_offer_id - id of offer in MB
 * @param winner - 0 user win, 1 - house win
 */
function payout(mb_offer_id, winner, res){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': [ betting_contract_private_key ]
    });

    eos.transaction(
        {
            actions: [
                {
                    account: betting_contract,
                    name: 'payout',
                    authorization: [{
                        actor: betting_contract,
                        permission: 'active'
                    }],
                    data: {
                        "mb_offer_id": mb_offer_id, "winner": winner
                    }
                }
            ]
        }
    ).then(function(result){
        console.log(JSON.stringify(result));
        res.status(200).send("Check console")
    })
}

function accept_offer(offer_id, mb_offer_id, amount_eos, res){

    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': [ house_account_private_key ]
    });

    eos.transfer({from: house_account, to: betting_contract, quantity: (amount_eos.toFixed(4))+" EOS", memo: 'ao:'+offer_id+':'+mb_offer_id}, (error, result) => {

        if(result===undefined){
            res.status(500).json(error)
        }else{
            res.status(200).json(result)
        }
    })
}

function submit_offer(user, runner_id, odds, amount_eos, res){

    let user_account = conf.account[user];
    let user_account_private_key = conf.keys[user];

    if(user_account===undefined || user_account_private_key===undefined){
        res.status(404).send("Unknown user. Missing account name or key in config.")
        return;
    }


    eos = Eos({
        'httpEndpoint': network_address,
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': [ user_account_private_key ]
    });

    eos.transfer({from: user_account, to: betting_contract, quantity: (amount_eos.toFixed(4))+" EOS", memo: 'so:'+runner_id+':'+(odds*1000)}, (error, result) => {

        if(result===undefined){
            res.status(500).json(error)
        }else{
            res.status(200).json(result);
        }
    })
}

const app = express();

app.use(bodyParser.json());

app.post('/accept_offer', function (req, res) {

    if(req.body.offer_id===undefined){
        res.status(400).send('Missing offer_id,');
        return;
    }

    if(req.body.mb_offer_id===undefined){
        res.status(400).send('Missing mb_offer_id,');
        return;
    }

    if(req.body.amount_eos===undefined){
        res.status(400).send('Missing amount_eos.');
        return;
    }

    accept_offer(req.body.offer_id, req.body.mb_offer_id, req.body.amount_eos, res);
});

app.post('/pay', function (req, res) {

    if(req.body.mb_offer_id===undefined){
        res.status(400).send('Missing mb_offer_id,');
        return;
    }

    if(req.body.user_win===undefined){
        res.status(400).send('Missing user_win (true/false).');
        return;
    }

    let winner = 1;// house win
    if(req.body.user_win){
        winner = 0; // user win
    }

    payout(req.body.mb_offer_id, winner, res)
});

app.post('/submit_offer', function (req, res) {

    if(req.body.user===undefined){
        res.status(400).send('Missing user,');
        return;
    }

    if(req.body.runner_id===undefined){
        res.status(400).send('Missing runner_id');
        return;
    }

    if(req.body.odds===undefined){
        res.status(400).send('Missing odds');
        return;
    }

    if(req.body.amount_eos===undefined){
        res.status(400).send('Missing amount_eos');
        return;
    }

    submit_offer(req.body.user, req.body.runner_id, req.body.odds, req.body.amount_eos, res)
});

const server = app.listen(38889, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});

