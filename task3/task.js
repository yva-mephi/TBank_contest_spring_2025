const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let firstLineRead = false; // Флаг для проверки, считана ли первая строка
let n, m; // Переменные для хранения двух чисел из первой строки
let a = []; // Массив для хранения чисел из второй строки

rl.on("line", function (line) {

    if (!firstLineRead) {
        // Считываем первую строку
        const [first, second] = line.trim().split(' ').map(Number);
        n = first;
        m = second;
        firstLineRead = true; // Устанавливаем флаг, что первая строка считана
    } else {
        // Считываем вторую строку (массив чисел)
        a = line.trim().split(' ').map(Number);
        rl.close(); // Завершаем чтение
    }
});

rl.on("close", function () {
    let steps = findCorrections(a.slice(2).sort((a, b) => a - b));
    console.log(steps);
    process.exit(0);
});

const findCorrections = (arr) => {
    if (arr.length < m) return -1;

    let minCost = +Infinity;
    for (let i = 0; i <= arr.length - m; i++) {
        const left = arr[i];
        const right = arr[i + m - 1];

        let costLeft = Math.max(0, a[0] - left); // Стоимость "подвинуть" a[0]
        let costRight = Math.max(0, right - a[1]); // Стоимость "подвинуть" a[1]

        let totalCost = costLeft + costRight; // Общая стоимость

        minCost = Math.min(minCost, totalCost);

        // Если стоимость уже 0, можно завершить поиск
        if (minCost === 0) break;
    }

    return minCost;
}