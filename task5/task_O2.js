const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let n, s;
let a = [];

rl.on("line", (line) => {
    if (!n) {
        [n, s] = line.trim().split(' ').map(BigInt);
        n = Number(n);
        s = BigInt(s);
    } else {
        a = line.trim().split(' ').map(BigInt);
        rl.close();
    }
});

rl.on("close", () => {
    const prefix = new Array(n + 1).fill(0n);
    for (let i = 1; i <= n; i++) {
        prefix[i] = prefix[i - 1] + a[i - 1];
    }

    let total = 0n;

    for (let l = 1; l <= n; l++) {
        for (let r = l; r <= n; r++) {
            const sum = prefix[r] - prefix[l - 1];
            if (sum <= s) {
                total += 1n;
            } else {
                let cnt = 0n;
                let currentSum = 0n;
                for (let i = l; i <= r; i++) {
                    currentSum += a[i - 1];
                    if (currentSum > s) {
                        cnt += 1n;
                        currentSum = a[i - 1];
                    }
                }
                cnt += 1n;
                total += cnt;
            }
        }
    }

    console.log(total.toString());
});