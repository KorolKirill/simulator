const {price_var, buildings,game_cfg, buildings_cfg} = require("./data");

class Game {

    buyPack() {
        const pack_info = this.calculatePack();
        let randomN = Math.floor(Math.random() * 100);
        let checked = true;
        for (let i = 0; i< game_cfg.pack_chances.length; i++) {
            if (randomN >= game_cfg.pack_chances[i] && checked) {
                randomN -= game_cfg.pack_chances[i];
                pack_info.rank_start+=3;
            }
            else {
                checked = false;
            }
        }
  //      console.log("Bought: " + pack_info.rank_start, "Paid: " + pack_info.pack_price);
        buildings[pack_info.rank_start]++;
        game_cfg.total_profitability += buildings_cfg[pack_info.rank_start];
    }

    upgradeBuilding(building_rank) {
        if (buildings_cfg[building_rank] === undefined || buildings_cfg[building_rank+1] === undefined) {
    //        console.error("Can not be upgraded, congifg is not set. Rank: ", building_rank);
            return;
        }
        buildings[building_rank+1]++;
        buildings[building_rank]--;
        game_cfg.total_profitability += buildings_cfg[building_rank+1] - buildings_cfg[building_rank];
    }

     calculateUpgradePrice(building_rank) {
         if ( buildings_cfg[building_rank+1] === undefined) {
             return 0;
         }
        let price = this.calculateMiningSec(building_rank) * 60 * 60 * 24;
        price = price * price_var;
        price = price * (100-game_cfg.upgrade_discount)/100;
        price = price / (building_rank % 3 === 0 ? 2 : 1.5);
        return price;
    }
     calculatePack() {
        const calculate_pack_price = (start_from_rank) => {
            let price = 0;
            let indexer = 0;
            for (let i = start_from_rank; i < start_from_rank + 7; i+=3, indexer++) {
                const dummy = 1.2;
                price += price_var * this.calculateMiningSec(i) * ( 24 * 60 * 60) * dummy * game_cfg.pack_chances[indexer] / 100;
            }
            return price;
        };
        let pack_price = 0;
        let rank_start = 1;
        for (let i = 1; i <= game_cfg.ranks_available - 6; i++) {
            if (pack_price > game_cfg.minimal_pack_price) {
                break;
            }
            pack_price = calculate_pack_price(i);
            rank_start = i;
        }
        return {
            pack_price: pack_price,
            rank_start :rank_start ,
        }
    }

    calculateMiningSec(building_rank) {
        return  game_cfg.token_creation_s* (buildings_cfg[building_rank]/game_cfg.total_profitability);
    }
}


module.exports = {
    Game
}