type GraphNode = {
    neighbors: string[];
    resources: string[];
    cache: any;
};

type GraphStructure = {
    [node: string]: GraphNode;
};

export default class Graph {
    graph: GraphStructure;

    constructor() {
        this.graph = {};
    }

    addNode(nodeName: string, resources: string[] = []): void {
        if (!this.graph[nodeName]) {
            this.graph[nodeName] = { neighbors: [], resources: resources, cache: {} };
        }
    }

    addEdge(node1: string, node2: string): void {
        if (this.graph[node1] && this.graph[node2]) {
            this.graph[node1].neighbors.push(node2);
            this.graph[node2].neighbors.push(node1);
        } else {
            throw new Error(`Os nós ${node1} e ${node2} devem existir no grafo.`);
        }
    }

    addResource(nodeName: string, resource: string): void {
        if (this.graph[nodeName]) {
            this.graph[nodeName].resources.push(resource);
        } else {
            throw new Error(`O nó ${nodeName} não existe no grafo.`);
        }
    }

    getNeighbors(nodeName: string): string[] {
        if (this.graph[nodeName]) {
            return this.graph[nodeName].neighbors;
        } else {
            throw new Error(`O nó ${nodeName} não existe no grafo.`);
        }
    }

    getResources(nodeName: string): string[] {
        if (this.graph[nodeName]) {
            return this.graph[nodeName].resources;
        } else {
            throw new Error(`O nó ${nodeName} não existe no grafo.`);
        }
    }

    getNodeCache(nodeName: string){
        return this.graph[nodeName].cache;
    }

    isInCache(nodeName: string, targetResource: string): string | null {
        for(const node of Object.keys(this.graph['n1'].cache)){
            if(this.graph['n1'].cache[node] && this.graph['n1'].cache[node].has(targetResource))
                return node;
        }

        return null;
    }

    addToCache(nodeName: string, targetNode: string, resources: string[]): void {
        if(targetNode in this.graph[nodeName].cache)
            this.graph[nodeName].cache[targetNode] = new Set([...this.graph[nodeName].cache[targetNode], ...resources]);
        else{
            this.graph[nodeName].cache[targetNode] = new Set(resources);
            this.graph[nodeName].cache[targetNode] = new Set([...this.graph[nodeName].cache[targetNode], ...resources]);
        }
    }
}
