const fs = require('fs');

function TSP(points) {
    this.points = points;
    this.pointsCount = points.length;
    this.minRoute = [];
    this.distance = Infinity;
    this.matrix = [];

    this.executionTime = 0;

    this.init(points);
}

TSP.prototype.calculateDistance = function([xA, yA], [xB, yB]) {
    return Math.round(Math.sqrt((xB - xA)**2 + (yB - yA)**2))
};

TSP.prototype.init = function(points) {
    for (let i = 0; i < this.pointsCount; i++) {
        this.matrix[i] = [];
    }

    this.matrix = points.reduce((result, item, i, arr) => {
        result.push(arr.map((itemMap, iMap) => {
            if (i === iMap) {
                return Infinity;
            }

            return this.calculateDistance(item, itemMap);
        }));

        return result;
    }, []);
};

TSP.prototype.swap = function(arr, i, j) {
    if (i === j) {
        return;
    }

    [arr[i], arr[j]] = [arr[j], arr[i]];
};

TSP.prototype.greedyAlgorithm = function() {
    const time = new Date().getTime();

    const points = [];

    for (let i = 0; i < this.pointsCount; i++) {
        points[i] = i;
    }

    for (let j = 0; j < this.pointsCount; j++) {
        const tmpPoints = [...points];

        this.swap(tmpPoints, 0, j);

        let distance = 0,
            lastPoint = j,
            point;

        const route = [j],
            excludePoints = {[lastPoint]: true};

        while (route.length < this.pointsCount) {
            let minDistance = Infinity;

            for (let i = 0; i < this.pointsCount; i++) {
                let currPoint = tmpPoints[i];

                if (excludePoints[currPoint] !== undefined) {
                    continue;
                }

                if (lastPoint === currPoint) {
                    continue;
                }

                let currDistance = this.matrix[lastPoint][currPoint];
                if (currDistance < minDistance) {
                    minDistance = currDistance;
                    point = currPoint;
                }
            }

            route.push(point);
            excludePoints[point] = true;

            distance += minDistance;
            lastPoint = point;
        }

        distance +=  this.matrix[lastPoint][j];

        if (this.distance > distance) {
            this.distance = distance;
            this.minRoute = [...route];
        }
    }

    this.executionTime = new Date().getTime() - time;
};

TSP.printRoute = function(points, route) {
    let items = [];

    route.forEach((item) => {
        items.push(`${item} (${points[item]})`);
    });

    return items.join(' -> ');
};

TSP.prototype.info = function() {
    console.log('Min route: ', TSP.printRoute(this.points, this.minRoute));
    console.log('Min distance: ', this.distance);
    console.log('Execution time: ', this.executionTime);
};


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

fs.readFile(inputFile, "utf8", (err, data) => {
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