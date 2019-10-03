export default class TSP {
    points = [];
    pointsCount = 0;
    minRoute = [];
    distance = Infinity;
    matrix = [];
    executionTime = 0;

    constructor(points) {
        this.points = points;
        this.pointsCount = points.length;

        this.init();
    }

    init() {
        for (let i = 0; i < this.pointsCount; i++) {
            this.matrix[i] = [];
        }

        this.matrix = this.points.reduce((result, item, i, arr) => {
            result.push(arr.map((itemMap, iMap) => {
                if (i === iMap) {
                    return Infinity;
                }

                return TSP.calculateDistance(item, itemMap);
            }));

            return result;
        }, []);
    }

    greedyAlgorithm() {
        const time = new Date().getTime();

        const points = [];

        for (let i = 0; i < this.pointsCount; i++) {
            points[i] = i;
        }

        for (let j = 0; j < this.pointsCount; j++) {
            const tmpPoints = [...points];

            TSP.swap(tmpPoints, 0, j);

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
            route.push(j);

            if (this.distance > distance) {
                this.distance = distance;
                this.minRoute = [...route];
            }
        }

        this.executionTime = new Date().getTime() - time;
    }

    info() {
        console.log('Min route: ', TSP.printRoute(this.points, this.minRoute));
        console.log('Min distance: ', this.distance);
        console.log('Execution time: ', this.executionTime + ' ms');
    }

    static printRoute(points, route) {
        let items = [];

        route.forEach((item) => {
            items.push(`${item} (${points[item]})`);
        });

        return items.join(' -> ');
    }

    static calculateDistance([xA, yA], [xB, yB]) {
        return Math.round(Math.sqrt((xB - xA)**2 + (yB - yA)**2))
    }

    static swap(arr, i, j) {
        if (i === j) {
            return;
        }

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
