# Usage

## Server

### Start
```
node server.js
```

### Endpoints

POST http://localhost:8081/accept_offer
```
{
	"offer_id": 8,
	"mb_offer_id": 877812,
	"amount_eos": 2.5
}
```
Response contains json from received from block producer. More useful information can be found in node server console because this is where eosjs logs.
- 200 - success
- 400 - parameters validation error
- 500 - error from EOS server

POST http://localhost:8081/pay
```
{
	"mb_offer_id": 8778122,
	"user_win": true
}
```
Field user_win mean is user win in EOS. If user win == true, funds will be transferred to user. If user win == false, funds will be transferred to house.  

- 200 - always 200, even when error. I didn't find out how to handle errors, yet ¯\_(ツ)_/¯ 
