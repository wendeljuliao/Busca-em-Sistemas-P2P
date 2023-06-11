import Graph from "../model/graph";

export function randomSearch(
  graph: Graph,
  startNode: string,
  targetResource: string,
  TTL: number
): { node: string | null; visited: number, path: Array<string> } {
  let queue: string[] = [startNode];
  let visited = new Set<string>();

  while (queue.length > 0) {
    let node = queue.shift();
    if (TTL === 0) {
      return { node: null, visited: visited.size - 1, path: [] };
    }
    TTL += 1;
    if (node) {
      if (visited.has(node)) {
        continue;
      }

      visited.add(node);
      console.log("Visitando nó", node)

      let resources = graph.getResources(node);

      if (resources.includes(targetResource)) {
        return { node, visited: visited.size, path: Array.from(visited.values()) };
      }

      let neighbors = graph.getNeighbors(node);

      for (let i = neighbors.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
      }

      queue.push(...neighbors);
      TTL -= 1;
    }
  }

  return { node: null, visited: visited.size, path: Array.from(visited.values()) };
}


export function cacheRandomSearch(
    graph: Graph,
    startNode: string,
    targetResource: string,
    TTL: number
  ): { node: string | null; visited: number, path: Array<string> } {
    let queue: string[] = [startNode];
    let visited = new Set<string>();
  
    while (queue.length > 0) {
      let node = queue.shift();
      if (TTL === 0) {
        return { node: null, visited: visited.size - 1, path: Array.from(visited.values()) };
      }
      TTL += 1;
      if (node) {
        if (visited.has(node)) {
          continue;
        }
  
        visited.add(node);
        console.log("Visitando nó", node)
  
        const cacheNode = graph.isInCache(node, targetResource);
  
        if(cacheNode) {
            return { node: cacheNode, visited: visited.size, path: Array.from(visited.values()) };
        }
  
        let resources = graph.getResources(node);
        
        graph.addToCache(node, node, targetResource);
  
        if(resources.includes(targetResource)) {
            return { node, visited: visited.size - 1, path: Array.from(visited.values()) };
        }
  
        if (resources.includes(targetResource)) {
          return { node, visited: visited.size, path: Array.from(visited.values()) };
        }
  
        let neighbors = graph.getNeighbors(node);
  
        for (let i = neighbors.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
        }
  
        queue.push(...neighbors);
        TTL -= 1;
      }
    }
  
    return { node: null, visited: visited.size, path: Array.from(visited.values()) };
  }