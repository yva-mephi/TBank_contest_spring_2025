const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let firstLineRead = false;
let n;
let x, y, z;
let a = [];

rl.on("line", function (line) {
    if (!firstLineRead) {
        const parts = line.trim().split(' ');
        n = parseInt(parts[0], 10);
        x = BigInt(parts[1]);
        y = BigInt(parts[2]);
        z = BigInt(parts[3]);
        firstLineRead = true;
    } else {
        a = line.trim().split(' ').map(BigInt);
        rl.close();
    }
});

rl.on("close", function () {
    const result = findMinOperations();
    console.log(result.toString());
    process.exit(0);
});

const gcd = (a, b) => {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
}

const findMinOperations = () => {
    const INF = 1n << 60n;
    const fullMask = 0b111;
    let dp = new Array(fullMask + 1).fill(INF);
    dp[0] = 0n;
    const lcmXY = lcm(x, y);
    const lcmXZ = lcm(x, z);
    const lcmYZ = lcm(y, z);
    const lcmXYZ = lcm(lcmXY, z);

    for (const num of a) {
        const costX = (x - (num % x)) % x;
        const costY = (y - (num % y)) % y;
        const costZ = (z - (num % z)) % z;

        const costXY = (lcmXY - (num % lcmXY)) % lcmXY;
        const costXZ = (lcmXZ - (num % lcmXZ)) % lcmXZ;
        const costYZ = (lcmYZ - (num % lcmYZ)) % lcmYZ;
        const costXYZ = (lcmXYZ - (num % lcmXYZ)) % lcmXYZ;

        const masksCosts = [
            { mask: 0b001, cost: costX },
            { mask: 0b010, cost: costY },
            { mask: 0b100, cost: costZ },
            { mask: 0b011, cost: costXY },
            { mask: 0b101, cost: costXZ },
            { mask: 0b110, cost: costYZ },
            { mask: 0b111, cost: costXYZ },
        ];

        const newDp = [...dp];

        for (const { mask, cost } of masksCosts) {
            for (let prevMask = 0; prevMask <= fullMask; prevMask++) {
                if (dp[prevMask] === INF) continue;
                const newMask = prevMask | mask;
                const newCost = dp[prevMask] + cost;
                if (newCost < newDp[newMask]) {
                    newDp[newMask] = newCost;
                }
            }
        }

        dp = newDp;
    }

    return dp[fullMask] === INF ? -1n : dp[fullMask];
}
