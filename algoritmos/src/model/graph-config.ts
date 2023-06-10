type Resource = {
  [node: string]: string[];
};

export type Edge = [string, string];

export default class GraphConfig {
  numNodes: number;
  minNeighbors: number;
  maxNeighbors: number;
  resources: Resource;
  edges: Edge[];

  constructor(
    numNodes: number,
    minNeighbors: number,
    maxNeighbors: number,
    resources: Resource,
    edges: Edge[]
  ) {
    this.numNodes = numNodes;
    this.minNeighbors = minNeighbors;
    this.maxNeighbors = maxNeighbors;
    this.resources = resources;
    this.edges = edges;
  }
}
