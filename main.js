const {buildings_cfg, buildings, game_cfg, price_var} = require("./data")
const {Game} = require("./game");

const game = new Game();
console.log(buildings_cfg);

console.log(game_cfg)
console.log(buildings, " total: ", calculate_total_buildings());





//params for simulation.
const days = 30;

function a() {
    var total_game_balance = 0;
    for (let i = 1; i < days; i++) {
        const mined_per_day = get_token_creation_s(i) * (60*60*24) * 0.94 ;
        total_game_balance += mined_per_day * (100 - game_cfg.withdraw_fee/2 )  / 100;

        let tokens_to_spend = 0;
        if (total_game_balance% 5 === 0) {
            tokens_to_spend = total_game_balance * 0.75;
        }
        else {
            tokens_to_spend = total_game_balance * 0.9;
        }
        total_game_balance -= tokens_to_spend;
        console.log("Day: ", i, " Tokens to spend: ", tokens_to_spend, " Total power : ", game_cfg.total_profitability);
        //starts upgrading, opening packs.
        let upgrading = true;
        while (upgrading) {
            const randN = Math.floor(Math.random()*100);
            if (randN < 50) {
                //upgrading
                const build_rank = pickRandomRank()
                const upgrade_price = game.calculateUpgradePrice(build_rank);
                if (upgrade_price <= tokens_to_spend) {
                    tokens_to_spend -= upgrade_price;
                    game.upgradeBuilding(build_rank);
                }
                else {
                    upgrading = false;
                }
            }
            else {
                //buying pack
                const pack_price = game.calculatePack();
                if (pack_price.pack_price <= tokens_to_spend) {
                    tokens_to_spend-= pack_price.pack_price;
                    game.buyPack();
                }
                else {
                    upgrading = false;
                }
            }
        }
        total_game_balance += tokens_to_spend; // reminder
        console.log(total_game_balance)
    }
    console.log(buildings, " total: ", calculate_total_buildings());
}



function pickRandomRank() {
    const randR = Math.floor(Math.random()*game_cfg.ranks_available)+1;
    if (buildings[randR] > 0) {
       return randR;
    }
    else {
        return pickRandomRank();
    }
}
function calculate_total_buildings() {
    let total = 0;
    for (const argumentsKey in buildings) {
        total += buildings[argumentsKey];
    }
    return total;
}

function get_token_creation_s(day) {
    return game_cfg.token_creation_s
}