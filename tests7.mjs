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

    // Функция для удаления файла
    const deleteFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    // Функция для сравнения выводов
    const compareOutputs = (output, expectedOutput, testNumber) => {
        const outputLines = output.split('\n');
        const expectedLines = expectedOutput.split('\n');

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
        { input: 'test-data/task7/tsk7_input-1.txt', output: 'test-data/task7/tsk7_output-1.txt', expected: 'test-data/task7/tsk7_right_output-1.txt' },
        // Добавьте другие тестовые случаи
    ];

    // Запуск тестов
    testCases.forEach((testCase, index) => {
        it(`Test ${index + 1}`, (done) => {
            const startTime = Date.now();
            const testNumber = index + 1;

            // Чтение входных данных
            const input = readFile(testCase.input);

            // Запуск программы с перенаправлением вывода в файл
            const command = `node task7/task.js < ${testCase.input} > ${testCase.output}`;
            exec(command, (error, stdout, stderr) => {
                const endTime = Date.now();
                const executionTime = endTime - startTime;

                if (error) {
                    console.error(chalk.red(`Test ${testNumber} ALL BAD`));
                    console.error('Program error:', stderr);
                    done(error);
                    return;
                }

                // Чтение вывода программы и ожидаемого вывода
                const output = readFile(testCase.output);
                const expectedOutput = readFile(testCase.expected);

                // Сравнение выводов
                const isSuccess = compareOutputs(output, expectedOutput, testNumber);

                // Вывод времени выполнения
                console.log(`Execution time: ${executionTime}ms`);
                done();
            });
        });
    });
});