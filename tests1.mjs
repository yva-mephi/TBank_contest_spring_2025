import { expect } from 'chai';
import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk'; // Для цветного вывода

describe('Program Tests', () => {
    // Функция для чтения файла
    const readFile = (filePath) => {
        return fs.readFileSync(filePath, 'utf-8').trim();
    };

    // Функция для записи файла
    const writeFile = (filePath, data) => {
        fs.writeFileSync(filePath, data);
    };

    // Функция для сравнения выводов
    const compareOutputs = (output, expectedOutput, testNumber) => {
        const outputLines = output.split('\n').filter(line => line.trim() !== ''); // Игнорируем пустые строки
        const expectedLines = expectedOutput.split('\n').filter(line => line.trim() !== ''); // Игнорируем пустые строки

        if (outputLines.length !== expectedLines.length) {
            console.log(chalk.red(`Test ${testNumber} ALL BAD`));
            console.log(`Expected ${expectedLines.length} lines, got ${outputLines.length} lines`);
            return false;
        }

        let mismatchCount = 0;
        const maxMismatchesToShow = 10; // Максимальное количество различий для вывода
        for (let i = 0; i < outputLines.length; i++) {
            if (outputLines[i].trim() !== expectedLines[i].trim()) {
                if (mismatchCount < maxMismatchesToShow) {
                    console.log(chalk.yellow(`Mismatch at line ${i + 1}`));
                    console.log(`Expected: ${expectedLines[i].trim()}`);
                    console.log(`Got: ${outputLines[i].trim()}`);
                }
                mismatchCount++;
            }
        }

        if (mismatchCount > maxMismatchesToShow) {
            console.log(chalk.yellow(`... and ${mismatchCount - maxMismatchesToShow} more mismatches.`));
        }

        if (mismatchCount === 0) {
            console.log(chalk.green(`Test ${testNumber} ALL GOOD`));
            return true;
        } else {
            console.log(chalk.red(`Test ${testNumber} ALL BAD`));
            return false;
        }
    };

    // Список тестов
    const testCases = [
        { input: 'test-data/task1/tsk1_input-1.txt', output: 'test-data/task1/tsk1_output-1.txt', expected: 'test-data/task1/tsk1_right_output-1.txt' },
        // Добавьте другие тестовые случаи
    ];

    // Запуск тестов
    testCases.forEach((testCase, index) => {
        it(`Test ${index + 1}`, (done) => {
            const startTime = Date.now();
            const testNumber = index + 1;

            // Чтение входных данных
            const inputLines = readFile(testCase.input).split('\n');
            const outputFilePath = testCase.output;

            // Очистка файла вывода
            writeFile(outputFilePath, '');

            // Обработка каждой строки
            let output = '';
            let currentLine = 0;

            const processNextLine = () => {
                if (currentLine >= inputLines.length) {
                    // Все строки обработаны, сравниваем вывод
                    const expectedOutput = readFile(testCase.expected);
                    const isSuccess = compareOutputs(output, expectedOutput, testNumber);

                    // Вывод времени выполнения
                    const endTime = Date.now();
                    const executionTime = endTime - startTime;
                    console.log(`Execution time: ${executionTime}ms`);

                    done();
                    return;
                }

                const inputLine = inputLines[currentLine].trim();
                currentLine++;

                // Запуск программы для текущей строки
                const command = `node task1/task.js`;
                const childProcess = exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(chalk.red(`Test ${testNumber} ALL BAD`));
                        console.error('Program error:', stderr);
                        done(error);
                        return;
                    }

                    // Запись вывода программы
                    output += stdout;
                    writeFile(outputFilePath, output); // Записываем вывод в файл

                    // Логирование
                    console.log(chalk.blue(`Input: ${inputLine}`));
                    console.log(chalk.blue(`Output: ${stdout.trim()}`));

                    // Обработка следующей строки
                    processNextLine();
                });

                // Отправка входных данных в программу
                childProcess.stdin.write(inputLine + '\n');
                childProcess.stdin.end();
            };

            // Начало обработки
            processNextLine();
        });
    });
});