import Graph from "../model/graph";
import { shuffle } from 'lodash';

type SearchNode = {
  node: string;
  depth: number;
};

export function cachedRandomSearch2(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
  if (TTL === 0) {
      return { node: null, visited: 0, path: [] };
  }

  TTL += 1;
  const visited = new Set<string>();
  let messages = -1;
  const queue: SearchNode[] = [{ node: startNode, depth: 0 }];

  let nodeResourceFound: string | null = null;
  let enableCache = false;

  const testCache = graph.getNodeCache("n1");
  if(testCache.size !== 0){
    enableCache = true;
  }

  function search(): { node: string | null, visited: number, path: Array<any>, messages: number } {
      if (queue.length === 0 || TTL === 0) {
          return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
      }

      TTL -=1;

      

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
              // TTL -= 1;
              return search();
          }

          const nodeCache = graph.getNodeCache(node);

            if(enableCache && nodeCache.has(targetResource)){
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
          const shuffledNeighbors = shuffle(neighbors); // Shuffle neighbors
          for (const neighbor of shuffledNeighbors) {
              queue.push({ node: neighbor, depth: 0 });
          }

          // TTL -= 1;
          return search();
      }

      return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
  }

  return search();
}

export function randomSearch2(graph: Graph, startNode: string, targetResource: string, TTL: number): { node: string | null, visited: number, path: Array<any> } {
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

      TTL -=1;

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
              // TTL -= 1;
              return search();
          }

          const neighbors = graph.getNeighbors(node);
          const shuffledNeighbors = shuffle(neighbors); // Shuffle neighbors
          for (const neighbor of shuffledNeighbors) {
              queue.push({ node: neighbor, depth: 0 });
          }

          // TTL -= 1;
          return search();
      }

      return { node: nodeResourceFound, visited: visited.size, path: Array.from(visited.values()), messages };
  }

  return search();
}

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
    if (ttl === 0 || queue.length === 0) {
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
        ttl -=1;
        return search(queue, ttl)
        // return { node, visited: visited.size, path: Array.from(visited.values()), messages: messages };
      }

      const neighbors = graph.getNeighbors(node);

      for (let i = neighbors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
      }

      const newQueue = [...neighbors, ...queue];
      return search(newQueue, ttl);
    }

    return { node: null, visited: visited.size, path: Array.from(visited.values()), messages: messages };
  }

  const queue: string[] = [startNode];
  return search(queue, TTL);
}

export function cachedRandomSearch(
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

  function extractNumbers(input: string): number[] {
    const regex = /\d+/g;
    const matches = input.match(regex);
    return matches ? matches.map(Number) : [];
}