import fs from 'fs';
import TSP from './tsp';

let inputFile = 'input1.txt';

if (process.argv.length >= 3) {
    try {
        if (fs.existsSync(process.argv[2])) {
            inputFile = process.argv[2];
        }
    } catch(err) {
        console.error(err)
    }
}

const path = './data/' + inputFile;

fs.readFile(path, "utf8", (err, data) => {
    if (err) {
        throw err;
    }

    const lines = data.split("\n");
    if (!lines.length) {
        throw new Error('Empty file');
    }

    const points = [];

    lines.forEach((line) => {
        let [x, y] = line.split(',');

        x = +x;
        y = +y;

        if (isNaN(x) || isNaN(y)) {
            return;
        }

        points.push([x, y]);
    });

    const tsp = new TSP(points);

    tsp.greedyAlgorithm();
    tsp.info();
});