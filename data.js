// Dictionary. Key - Rank, Value -> power.
const buildings_cfg = {};

const generateBuildingCfg = (ranksAmount) => {
    for (let i = 1; i <= ranksAmount; i++) {
        if (i === 1) {
            buildings_cfg[i] = 10;
        } else {
            if (i % 3 === 1) {
                buildings_cfg[i] = Math.ceil(buildings_cfg[i-1]*2);
            } else {
                buildings_cfg[i] = Math.ceil(buildings_cfg[i-1]*1.5);
            }
        }
    }
}
generateBuildingCfg(9);

const buildings = {
    1: 644,
    2: 0,
    3: 0,
    4: 120,
    5: 0,
    6: 0,
    7: 36,
    8: 0,
    9: 0
}
const calculateTotalProfitability = () => {
    let profitability = 0;
    for (const buildingsKey in buildings) {
        profitability += buildings[buildingsKey] * buildings_cfg[buildingsKey];
    }
    return profitability
}

const game_cfg = {
    ranks_available: 9,
    total_profitability: calculateTotalProfitability(),
    withdraw_fee: 6,
    minimal_pack_price: 400,
    pack_discount : 5,
    upgrade_discount: 5,
    pack_chances: [90, 8, 2],
    token_creation_s: 0.5
}

const price_var = 23;

module.exports = {
    buildings_cfg,
    game_cfg,
    buildings,
    price_var
}