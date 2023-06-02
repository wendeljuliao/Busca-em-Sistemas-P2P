interface IValidationGrafo {
  message: string;
  isValid: boolean;
}

export function validationGrafo(obj: any): IValidationGrafo {
  // Variáveis principais
  const { num_nodes, min_neighbors, max_neighbors } = obj;
  const edges = obj.edges;
  const resources = obj.resources;

  // 1. A rede não pode estar particionada (ou seja, deve existir pelo menos um caminho conectando qualquer nó a qualquer outro nó).
  // 2. Os números mínimo e máximo de vizinhos de cada nó devem obedecer os limites estabelecidos nos parâmetros min_neighbors e max_neighbors.

  const nodesQuantityNeighbors: any = {};
  for (let i = 1; i <= num_nodes; i++) {
    nodesQuantityNeighbors[`n${i}`] = 0;
  }

  for (const edge of edges) {
    nodesQuantityNeighbors[edge[0]]++;
    nodesQuantityNeighbors[edge[1]]++;
  }

  let auxNode;
  for (const node of Object.keys(nodesQuantityNeighbors)) {
    auxNode = nodesQuantityNeighbors[node];
    // Verificando 1.
    if (auxNode === 0) {
      return { message: 'A rede não pode estar particionada (ou seja, deve existir pelo menos um caminho conectando qualquer nó a qualquer outro nó).', isValid: false };
    }

    // Verificando 2.
    if (min_neighbors > auxNode || max_neighbors < auxNode) {
      return { message: 'Os números mínimo e máximo de vizinhos de cada nó devem obedecer os limites estabelecidos nos parâmetros min_neighbors e max_neighbors.', isValid: false };
    }
  }

  // 3. Não pode haver nós sem recursos.
  
  if (Object.keys(resources).length < obj.num_nodes) {
    return { message: 'Não pode haver nós sem recursos.', isValid: false };
  }

  // 4. Não pode haver arestas de um nó para ele mesmo.
  
  for (const edge of edges) {
    if (edge[0] === edge[1]) {
      return { message: 'Não pode haver arestas de um nó para ele mesmo.', isValid: false };
    }
  }

  return { message: '', isValid: true };
}