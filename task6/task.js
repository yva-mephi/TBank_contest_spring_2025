const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let n;
let points = [];
let lineCount = 0;

rl.on("line", (line) => {
    if (n === undefined) {
        n = parseInt(line.trim());
    } else {
        const [x, y] = line.trim().split(/\s+/).map(v => BigInt(v));
        points.push({ x, y });
        lineCount++;
        if (lineCount === n) rl.close();
    }
});

rl.on("close", () => {
    let maxCollinear = findMaxCollinear();
    let result = findThrees(maxCollinear);

    console.log(result.toString());
    process.exit(0);
});


const gcd = (a, b) => {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a < 0n ? -a : a;
}

const normalizeSlope = (dy, dx) => {
    if (dx === 0n) {
        return { dy: 1n, dx: 0n };
    }

    if (dy === 0n) {
        return { dy: 0n, dx: 1n };
    }

    if (dx < 0n) {
        dx = -dx;
        dy = -dy;
    }

    const g = gcd(dy < 0n ? -dy : dy, dx);
    return {
        dy: dy / g,
        dx: dx / g
    };
}

const findMaxCollinear = () => {
    let max = 1;
    for (let i = 0; i < n; i++) {
        const slopes = new Map();
        const point1 = points[i];
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const point2 = points[j];
            const dy = point2.y - point1.y;
            const dx = point2.x - point1.x;
            const slope = normalizeSlope(dy, dx);
            const key = `${slope.dy}:${slope.dx}`;
            slopes.set(key, (slopes.get(key) || 0) + 1);
        }

        let maxCount = 1;
        if (slopes.size > 0) {
            maxCount = Math.max(...slopes.values()) + 1;
        }
        max = Math.max(max, maxCount);
    }
    return max;
}

const findThrees = (maxCollinear) => {
    const k = n - maxCollinear;
    const maxPossibleThrees = Math.floor(n / 3);
    let bestThrees = 0;

    for (let threes = maxPossibleThrees; threes >= 0; threes--) {
        let found = false;
        for (let a = 0; a <= threes; a++) {
            for (let b = 0; b <= threes - a; b++) {
                const c = threes - a - b;
                if (2 * a + b > maxCollinear) continue;
                if (a + 2 * b + 3 * c > k) continue;
                found = true;
                break;
            }
            if (found) break;
        }
        if (found) {
            bestThrees = threes;
            break;
        }
    }
    return bestThrees;
}