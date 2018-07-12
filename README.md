### Usage

## Server

# Start
```
node server.js
```

# Endpoints

POST http://localhost:8081/accept_offer
```
{
	"offer_id": 8,
	"mb_offer_id": 877812,
	"amount_eos": 2.5
}
```
Response contains json from received from block producer. More useful information can be found in node server console because this is where eosjs logs.
200 - success
400 - parameters validation error
500 - error from EOS server
