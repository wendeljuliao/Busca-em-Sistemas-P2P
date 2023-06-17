import Graph from "../model/graph";

export function randomSearch(
  graph: Graph,
  startNode: string,
  targetResource: string,
  TTL: number
): { node: string | null; visited: number, path: Array<string> } {
  if (TTL === 0) {
    return { node: null, visited: 0, path: [] };
  }

  TTL += 1;
  let messages = -1;
  const visited = new Set<string>();

  function search(queue: string[], ttl: number): { node: string | null; visited: number, path: Array<string>, messages: number } {
    if (ttl === 0) {
      return { node: null, visited: visited.size - 1, path: [], messages: messages};
    }

    const node = queue.shift();
    if (node) {
      if (visited.has(node)) {
        return search(queue, ttl);
      }
      
      messages += 1;
      visited.add(node);
      console.log("Visitando nó", node);

      const resources = graph.getResources(node);

      if (resources.includes(targetResource)) {
        return { node, visited: visited.size, path: Array.from(visited.values()), messages: messages };
      }

      const neighbors = graph.getNeighbors(node);

      for (let i = neighbors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
      }

      const newQueue = [...neighbors, ...queue];
      return search(newQueue, ttl - 1);
    }

    return { node: null, visited: visited.size, path: Array.from(visited.values()), messages: messages };
  }

  const queue: string[] = [startNode];
  return search(queue, TTL);
}

/* export function randomSearch(
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
} */


export function cacheRandomSearch(
    graph: Graph,
    startNode: string,
    targetResource: string,
    TTL: number
  ): { node: string | null; visited: number, path: Array<string> } {
    const queue: string[] = [startNode];
    const visited = new Set<string>();
  
    while (queue.length > 0) {
      const node = queue.shift();
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
  
        const cacheNode = graph.isInCache('n1', targetResource);
  
        if(cacheNode) {
            return { node: cacheNode, visited: visited.size, path: Array.from(visited.values()) };
        }
  
        const resources = graph.getResources(node);
        
        graph.addToCache('n1', node, resources);
  
        if(resources.includes(targetResource)) {
            return { node, visited: visited.size - 1, path: Array.from(visited.values()) };
        }
  
        if (resources.includes(targetResource)) {
          return { node, visited: visited.size, path: Array.from(visited.values()) };
        }
  
        const neighbors = graph.getNeighbors(node);
  
        for (let i = neighbors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
        }
  
        queue.push(...neighbors);
        TTL -= 1;
      }
    }
  
    return { node: null, visited: visited.size, path: Array.from(visited.values()) };
  }