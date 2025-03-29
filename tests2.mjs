import { expect } from 'chai';
import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';

describe('Program Tests', () => {
    const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();
    const writeFile = (filePath, data) => fs.writeFileSync(filePath, data);
    const deleteFile = (filePath) => fs.existsSync(filePath) && fs.unlinkSync(filePath);

    const compareOutputs = (output, expectedOutput, testNumber) => {
        const outputLines = output.split('\n');
        const expectedLines = expectedOutput.split('\n');

        if (outputLines.length !== expectedLines.length) {
            console.log(chalk.red(`Test ${testNumber} ALL BAD`));
            console.log(`Expected ${expectedLines.length} lines, got ${outputLines.length}`);
            return false;
        }

        let mismatchCount = 0;
        const maxMismatchesToShow = 10;
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

        return mismatchCount === 0;
    };

    const testCases = [
        { input: 'test-data/task2/tsk2_input-1.txt', output: 'test-data/task2/tsk2_output-1.txt', expected: 'test-data/task2/tsk2_right_output-1.txt' },
        { input: 'test-data/task2/tsk2_input-2.txt', output: 'test-data/task2/tsk2_output-2.txt', expected: 'test-data/task2/tsk2_right_output-2.txt' },
        { input: 'test-data/task2/tsk2_input-3.txt', output: 'test-data/task2/tsk2_output-3.txt', expected: 'test-data/task2/tsk2_right_output-3.txt' },
        // Добавьте другие тесты
    ];

    testCases.forEach((testCase, index) => {
        it(`Test ${index + 1}`, (done) => {
            const testNumber = index + 1;
            const metricsFile = `test-data/task2/tsk2_metrics-${testNumber}.log`;

            // Удаляем предыдущий файл метрик
            deleteFile(metricsFile);

            const startTime = Date.now();
            const command = `/usr/bin/time -v -o ${metricsFile} node task2/task.js < ${testCase.input} > ${testCase.output}`;

            exec(command, (error, stdout, stderr) => {
                const endTime = Date.now();
                const executionTime = endTime - startTime;

                if (error) {
                    console.error(chalk.red(`Test ${testNumber} ALL BAD`));
                    console.error('Program error:', stderr);
                    done(error);
                    return;
                }

                // Чтение метрик памяти
                let memoryMB = 0;
                try {
                    const metrics = readFile(metricsFile);
                    const memoryMatch = metrics.match(/Maximum resident set size \(kbytes\): (\d+)/);
                    if (memoryMatch) {
                        memoryMB = (parseInt(memoryMatch[1], 10) / 1024).toFixed(2);
                    }
                } catch (e) {
                    console.log(chalk.yellow('Memory measurement not available'));
                }

                // Сравнение выводов
                const output = readFile(testCase.output);
                const expectedOutput = readFile(testCase.expected);
                const isSuccess = compareOutputs(output, expectedOutput, testNumber);

                // Вывод результатов
                console.log(`Execution time: ${executionTime}ms`);
                console.log(`Memory usage: ${memoryMB} MB`);

                // Удаляем файл метрик
                deleteFile(metricsFile);

                done();
            });
        });
    });
});