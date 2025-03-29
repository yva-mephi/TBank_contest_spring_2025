const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const MOD = 998244353n;
const inv_2 = 499122177n;

let firstLineRead = false;
let n, k;
let a = [];

rl.on("line", (line) => {
    if (!firstLineRead) {
        [n, k] = line.trim().split(/\s+/).map(v => parseInt(v));
        firstLineRead = true;
    } else {
        a = line.trim().split(/\s+/).map(v => BigInt(v));
        rl.close();
    }
});

rl.on("close", () => {
    let result = findF();
    console.log(result.join('\n'));
    process.exit(0);
});

const findF = () => {
    const C = new Array(k + 1);
    for (let p = 0; p <= k; p++) {
        C[p] = new Array(k + 1).fill(0n);
        C[p][0] = 1n;
        C[p][p] = 1n;
        for (let m = 1; m < p; m++) {
            C[p][m] = (C[p - 1][m - 1] + C[p - 1][m]) % MOD;
        }
    }

    const pow2 = new Array(k + 1).fill(0n);
    pow2[0] = 1n;
    for (let p = 1; p <= k; p++) {
        pow2[p] = (pow2[p - 1] * 2n) % MOD;
    }

    const sumPow = new Array(k + 1).fill(0n);
    sumPow[0] = BigInt(n) % MOD;
    for (const ai of a) {
        let current = 1n;
        for (let m = 1; m <= k; m++) {
            current = (current * ai) % MOD;
            sumPow[m] = (sumPow[m] + current) % MOD;
        }
    }

    const result = [];
    for (let p = 1; p <= k; p++) {
        let sum = 0n;
        for (let m = 0; m <= p; m++) {
            const cm = C[p][m];
            const sm = sumPow[m];
            const spm = sumPow[p - m];
            const term = (cm * sm % MOD) * spm % MOD;
            sum = (sum + term) % MOD;
        }

        const termSub = (pow2[p] * sumPow[p]) % MOD;
        let total = (sum - termSub + MOD) % MOD;
        total = (total * inv_2) % MOD;
        result.push(total.toString());
    }

    return result;
}