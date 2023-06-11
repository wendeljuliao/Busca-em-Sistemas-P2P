import Graph from "../model/graph";

type SearchNode = {
    node: string;
    depth: number;
};

export function floodSearch(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
    if(TTL === 0) {
        return { node: null, visited: 0, path: [] };
    }

    TTL += 1;

    let queue: SearchNode[] = [{ node: startNode, depth: 0 }];
    let visited = new Set<string>();

    while(queue.length > 0) {
        if(TTL === 0) {
            return { node: null, visited: visited.size - 1, path: Array.from(visited.values()) };
        }
        let current = queue.shift();
        if(current) {
            let { node, depth } = current;

            if(visited.has(node))
                continue;

            visited.add(node);
            console.log("Visitando nó", node)
            let resources = graph.getResources(node);

            if(resources.includes(targetResource)) {
                return { node, visited: visited.size - 1, path: Array.from(visited.values()) };
            }

            if(depth < TTL) {
                let neighbors = graph.getNeighbors(node);
                for(let neighbor of neighbors) {
                    queue.push({ node: neighbor, depth: depth + 1 });
                }
            }
        TTL -= 1;
        }
    }

    return { node: null, visited: visited.size, path: Array.from(visited.values()) };
}

export function cacheFloodSearch(graph: Graph, startNode: string, targetResource: string, ttl: number): { node: string | null, visited: number, path: Array<any> } {
    let queue: Array<{ node: string, ttl: number }> = [{ node: startNode, ttl: ttl }];
    let visited = new Set<string>();
    let nodeVisited = 0;

    while(queue.length > 0) {
        let { node, ttl } = queue.shift()!;

        if(visited.has(node)) {
            continue;
        }

        visited.add(node);
        console.log("Visitando nó", node);
        nodeVisited++;

        const cacheNode = graph.isInCache(node, targetResource);

        if(cacheNode) {
            return { node: cacheNode, visited: nodeVisited, path: Array.from(visited.values()) };
        }

        let resources = graph.getResources(node);

        graph.addToCache(node, node, targetResource);

        if(resources.includes(targetResource)) {
            return { node, visited: nodeVisited, path: Array.from(visited.values()) };
        }

        if(ttl <= 0) {
            continue;
        }

        let neighbors = graph.getNeighbors(node);

        neighbors.forEach(neighbor => {
            if(!visited.has(neighbor)) {
                queue.push({ node: neighbor, ttl: ttl - 1 });
            }
        });
    }

    return { node: null, visited: nodeVisited , path: Array.from(visited.values()) };
}