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
    const sections = findSectionSum();
    console.log(sections.toString());
    process.exit(0);
});

const findSectionSum = () => {
    const pref = new Array(n + 1).fill(BigInt(0));
    for (let i = 0; i < n; i++) {
        pref[i + 1] = pref[i] + a[i];
    }

    const point = new Array(n + 1).fill(0);
    const nextPoint = new Array(n + 2).fill(0);
    let j = 0;
    for (let i = 1; i <= n; i++) {
        while (j < n && pref[j + 1] - pref[i - 1] <= s) {
            j++;
        }
        point[i] = j;
        nextPoint[i] = (point[i] < n) ? point[i] + 1 : n + 1;
    }
    nextPoint[n + 1] = n + 1;

    const f = new Array(n + 2).fill(BigInt(0));
    for (let i = n; i >= 1; i--) {
        f[i] = BigInt(n - i + 1) + f[nextPoint[i]];
    }

    let result = BigInt(0);
    for (let i = 1; i <= n; i++) {
        result += f[i];
    }

    return result;
}