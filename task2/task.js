const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let lines = [];
let n = 0;

rl.on("line", function (line) {
  if (n === 0) {
    // Считываем первое число - количество строк
    n = parseInt(line.trim());
  } else {
    // Преобразуем строку в число и добавляем в массив
    lines.push(parseInt(line.trim()));

    // Если собрали все строки, завершаем чтение
    if (lines.length === n) {
      rl.close();
    }
  }
});

rl.on("close", function () {
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    results.push(findMaxSum(lines[i]));
  }

  console.log(results.join('\n'));
  process.exit(0);
});

const findMaxSum = (num) => {
  if (num < 7) return -1;
  let x = 0, y = 0, z = 0;

  x = Math.floor(Math.log2(num));
  if ((num - 2 ** x) < 3) x--; // если оставшаяся часть числа меньше 3 - то при любом раскладе y и z неправильно вычислятся
  let diff = num - (2 ** x); // запись оставшейся части числа


  y = Math.floor(Math.log2(diff));
  if (diff - 2 ** y < 1) y--; // смотрим если оставшееся число окажется меньше 1 то z неправильно вычислится
  if (y === x) y--; // если y = x то условие по уникальности не выполнится
  if (y === 0) return -1; // если y оказался равным 0 то смысла вычислять z нет
  diff -= 2 ** y; // запись оставшейся части числа

  z = Math.floor(Math.log2(diff));
  if (z >= y || z >= x) z--; // если это условие выполнится то вычисления были неверны

  if ((x < 0 || y < 0 || z < 0) || !(z < y && y < x)) { // итоговая проверка на валидность полученных данных
    return -1;
  } else {
    // console.log(z, y, x);
    return (2n ** BigInt(x) + 2n ** BigInt(y) + 2n ** BigInt(z)).toString();
  }
}
