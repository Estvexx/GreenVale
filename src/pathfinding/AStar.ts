import { Grid } from "./Grid";

interface Node {
    x: number;
    y: number;
    g: number; // custo do início até aqui
    h: number; // estimativa até ao destino
    f: number; // g + h
    parent: Node | null;
}

export class AStar {
    private grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public findPath(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
    ): { x: number; y: number }[] {
        // Destino não é passável — não há caminho
        if (!this.grid.isWalkable(endX, endY)) return [];

        const openList: Node[] = [];
        const closedList: Set<string> = new Set();

        const startNode: Node = {
            x: startX,
            y: startY,
            g: 0,
            h: this.heuristic(startX, startY, endX, endY),
            f: 0,
            parent: null,
        };
        startNode.f = startNode.g + startNode.h;
        openList.push(startNode);

        while (openList.length > 0) {
            // Pega o nó com menor f
            const current = this.getLowestF(openList);

            // Chegámos ao destino
            if (current.x === endX && current.y === endY) {
                return this.buildPath(current);
            }

            // Move da lista aberta para a fechada
            openList.splice(openList.indexOf(current), 1);
            closedList.add(`${current.x},${current.y}`);

            // Explora vizinhos (4 direções)
            for (const neighbor of this.getNeighbors(current)) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;
                if (!this.grid.isWalkable(neighbor.x, neighbor.y)) continue;

                const g = current.g + 1;
                const h = this.heuristic(neighbor.x, neighbor.y, endX, endY);
                const f = g + h;

                // Já existe na lista aberta com melhor f? ignora
                const existing = openList.find(
                    (n) => n.x === neighbor.x && n.y === neighbor.y,
                );
                if (existing && existing.f <= f) continue;

                openList.push({ ...neighbor, g, h, f, parent: current });
            }
        }

        return []; // Sem caminho
    }

    private heuristic(x1: number, y1: number, x2: number, y2: number): number {
        // Distância Manhattan — ideal para grids sem diagonais
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    private getLowestF(list: Node[]): Node {
        return list.reduce((lowest, node) =>
            node.f < lowest.f ? node : lowest,
        );
    }

    private getNeighbors(node: Node): Node[] {
        // 4 direções — cima, baixo, esquerda, direita
        return [
            { x: node.x, y: node.y - 1, g: 0, h: 0, f: 0, parent: node },
            { x: node.x, y: node.y + 1, g: 0, h: 0, f: 0, parent: node },
            { x: node.x - 1, y: node.y, g: 0, h: 0, f: 0, parent: node },
            { x: node.x + 1, y: node.y, g: 0, h: 0, f: 0, parent: node },
        ];
    }

    private buildPath(node: Node): { x: number; y: number }[] {
        const path: { x: number; y: number }[] = [];
        let current: Node | null = node;

        while (current) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }

        return path; // Lista de tiles do início ao fim
    }
}
