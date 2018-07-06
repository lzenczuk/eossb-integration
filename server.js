const request = require('request');
const Eos = require('eosjs');

/*
mbesbuser921 - this don't work?

mbesbusera21

Private Key: 5KWwWKRnS3whHbsCgYwi9nmt4FKdNe4PeLewB9cfhh3v3nN8DAK
Public Key: EOS5BcFmPJ7LVyoyaq4JuLpe8B5y5y3faEHNQrpBgCQQfSQhjj9kk

jungle network info: http://jungle.cryptolions.io:38888/v1/chain/get_info

{
server_version: "5875549c",
chain_id: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
head_block_num: 4281759,
last_irreversible_block_num: 4281429,
last_irreversible_block_id: "004154553332ce562de7e8d3af59465cfeaf0c1633b5d54058447dd0669a75e1",
head_block_id: "0041559f6274427fe75d0be513dbef0e70f3871cfe9c581faf9786d879b3fde3",
head_block_time: "2018-07-06T16:00:22.000",
head_block_producer: "eosultramega",
virtual_block_cpu_limit: 200000000,
virtual_block_net_limit: 1048576000,
block_cpu_limit: 199050,
block_net_limit: 1048432
}

 */

function downloadsEvents(){

    let MB_SUB_EVENTS_URL = 'https://www.matchbook.com/edge/rest/events?language=en&currency=EUR&exchange-type=back-lay&odds-type=DECIMAL&price-depth=6&price-order=price%20desc&include-event-participants=true&offset=0&per-page=18&market-states=open%2Csuspended%2Cclosed&runner-states=open%2Csuspended%2Cclosed&tag-url-names=baseball%2Cmlb';

    const options = {
        url: MB_SUB_EVENTS_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    let eventsToImportMap = {};
    let runnersToImport = [];

    request(options, (err, res, body) => {
        if (err) { return console.log(err); }
        response = JSON.parse(body);

        response['events'].forEach((event) => {

            event['markets'].forEach((market) => {

                if(market['name']==='Moneyline'){
                    market['runners'].forEach(runner => {
                        console.log("Runner: "+runner['id']+" -> "+runner['name']);

                        eventsToImportMap[event['id']]={'eventId': event['id'], 'eventName': event['name']};
                        runnersToImport.push({'runnerId': runner['id'], 'eventId': event['id'], 'runnerName': runner['name']})
                    })
                }
            })
        });

        let eventsToImport = Object.values(eventsToImportMap);

        console.log(eventsToImport);
        console.log(runnersToImport);

        update_events(eventsToImport);
    });
}

function update_events(eventsList){

    eos = Eos({
        'httpEndpoint': 'http://jungle.cryptolions.io:38888',
        'chainId': '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        'keyProvider': '5KWwWKRnS3whHbsCgYwi9nmt4FKdNe4PeLewB9cfhh3v3nN8DAK'
    });

    eos.getBlock(1, (error, result) => {
        if(error) {return console.log(error)}

        console.log(JSON.stringify(result));
        console.log(eventsList.length);
    })

}

function mainLoop(){
    console.log("-------------> loop");
    downloadsEvents();
    setTimeout(mainLoop, 10000)
}


console.log("-----------> hello");
setTimeout(mainLoop, 0);

