import Graph from "../model/graph";

type SearchNode = {
    node: string;
    depth: number;
};


export function floodSearch(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
    if (TTL === 0) {
        return { node: null, visited: 0, path: [] };
    }

    TTL += 1;
    const visited = new Set<string>();
    let messages = -1;
    const queue: SearchNode[] = [{ node: startNode, depth: 0 }];

    let nodeResourceFound: string | null = null

    function search(): { node: string | null, visited: number, path: Array<any>, messages: number } {
        if (queue.length === 0 || TTL === 0) {
            return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
        }

        const current = queue.shift();
        if (current) {
            const { node } = current;
            
            if (visited.has(node)) {
                return search();
            }
            messages += 1;

            visited.add(node);
            console.log("Visitando nó", node);
            const resources = graph.getResources(node);

            if (resources.includes(targetResource)) {
                nodeResourceFound = node;
                TTL -= 1;
                return search();
                // return { node, visited: visited.size - 1, path: Array.from(visited.values()) };
            }

            const neighbors = graph.getNeighbors(node);
            for (const neighbor of neighbors) {
                queue.push({ node: neighbor, depth: 0 });
            }

            TTL -= 1;
            return search();
        }

        return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
    }

    return search();
}

export function cachedFloodSearch(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
    if (TTL === 0) {
        return { node: null, visited: 0, path: [] };
    }

    TTL += 1;
    const visited = new Set<string>();
    let messages = -1;
    const queue: SearchNode[] = [{ node: startNode, depth: 0 }];

    let nodeResourceFound: string | null = null

    function search(): { node: string | null, visited: number, path: Array<any>, messages: number } {
        if (queue.length === 0 || TTL === 0) {
            return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
        }

        const current = queue.shift();
        if (current) {
            const { node } = current;
            
            if (visited.has(node)) {
                return search();
            }
            messages += 1;

            visited.add(node);
            console.log("Visitando nó", node);
            const resources = graph.getResources(node);

            if (resources.includes(targetResource)) {
                nodeResourceFound = node;
                TTL -= 1;
                return search();
                // return { node, visited: visited.size - 1, path: Array.from(visited.values()) };
            }

            
            const nodeCache = graph.getNodeCache(node);

            if(nodeCache.has(targetResource)){
                messages+=1;
                return { node: nodeCache.get(targetResource), visited: visited.size, path: Array.from(visited.values()), messages };
            }


            const neighbors = graph.getNeighbors(node);
            const lastNodes = extractNumbers(node)[0];
            for(let i=1; i <= Number(lastNodes); i++){
                const auxNodeCache = graph.getNodeCache(`n${i}`);
                for (const neighbor of neighbors) {
                    const tmpResources = graph.getResources(neighbor);
                    for(const tmpResource of tmpResources) {
                        auxNodeCache.set(tmpResource, neighbor)
                    }
                }
            }
            for (const neighbor of neighbors) {
                const tmpResources = graph.getResources(neighbor);
                for(const tmpResource of tmpResources) {
                    nodeCache.set(tmpResource, neighbor)
                }
                queue.push({ node: neighbor, depth: 0 });
            }

            TTL -= 1;
            return search();
        }

        return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
    }

    return search();
}

/* export function floodSearch(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
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
} */

export function cacheFloodSearch(graph: Graph, startNode: string, targetResource: string, ttl: number): { node: string | null, visited: number, path: Array<any> } {
    const queue: Array<{ node: string, ttl: number }> = [{ node: startNode, ttl: ttl }];
    const visited = new Set<string>();
    let nodeVisited = 0;

    while(queue.length > 0) {
        const { node, ttl } = queue.shift()!;

        if(visited.has(node)) {
            continue;
        }

        const lastNode = Array.from(visited).pop();

        visited.add(node);
        console.log("Visitando nó", node);
        nodeVisited++;
        
        const cacheNode = graph.isInCache('n6', targetResource);

        if(cacheNode) {
            return { node: cacheNode, visited: nodeVisited, path: Array.from(visited.values()) };
        }

        const resources = graph.getResources(node);

        graph.addToCache('n1', node, resources);

        if(resources.includes(targetResource)) {
            return { node, visited: nodeVisited, path: Array.from(visited.values()) };
        }

        if(ttl <= 0) {
            continue;
        }

        const neighbors = graph.getNeighbors(node);

        neighbors.forEach(neighbor => {
            if(!visited.has(neighbor)) {
                queue.push({ node: neighbor, ttl: ttl - 1 });
            }
        });
    }

    return { node: null, visited: nodeVisited , path: Array.from(visited.values()) };
}

function extractNumbers(input: string): number[] {
    const regex = /\d+/g;
    const matches = input.match(regex);
    return matches ? matches.map(Number) : [];
}