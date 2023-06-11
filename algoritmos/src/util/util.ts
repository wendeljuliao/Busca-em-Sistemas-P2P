import { promises as fs } from 'fs';
import GraphConfig, { Edge } from '../model/graph-config';
import Graph from '../model/graph';

/**
 * Carrega o arquivo de configuração para memória.
 * @param filePath Caminho do arquivo de configuração do grafo.
 * @returns 
 */
export async function loadGraphConfig(filePath: string): Promise<GraphConfig | undefined> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(data);

        return new GraphConfig(json.num_nodes, json.min_neighbors, json.max_neighbors, json.resources, json.edges);
    } catch (err) {
        console.error('Error reading file from disk:', err);
    }
}

/**
 * Valida se a configuração do grafo é válida.
 * @param graphConfig 
 */
export function validateConfigFile(graphConfig: GraphConfig): Array<string> | null {
    const errors = [];
    if(!graphConfig.numNodes)
        errors.push("O número de nós deve ser informado no arquivo de configuração");

    if(!graphConfig.maxNeighbors)
        errors.push("O número mínimo de nós vizinhos deve ser informado no arquivo de configuração");

    if(!graphConfig.maxNeighbors)
        errors.push("O número máximo de nós vizinhos deve ser informado no arquivo de configuração");

    if(graphConfig.maxNeighbors && graphConfig.minNeighbors && graphConfig.minNeighbors > graphConfig.maxNeighbors)
        errors.push("O número mínimo de nós vizinhos não pode ser maior que o máximo configurado.");

    if(!graphConfig.resources)
        errors.push("Os recursos de cada nó devem ser informados.");
    
    if(graphConfig.resources && graphConfig.numNodes && Object.keys(graphConfig.resources).length !== graphConfig.numNodes)
        errors.push("Todos os nós devem conter pelo menos um recurso");

    if(!graphConfig.edges || (graphConfig.edges && graphConfig.edges.length === 0))
        errors.push("Informe a conexão entre os nós vizinhos.");

    if(graphConfig.edges && graphConfig.edges.length !== 0){
        for(const edge of graphConfig.edges){
            if(edge.length !== 2){
                errors.push(`Aresta inválida: ${edge}`);
                continue;
            }

            const [nx, ny] = edge;

            if(nx === ny)
                errors.push(`Não pode haver arestas de um nó para ele mesmo. ${nx} - ${ny}`);
        }
    }


    if(graphConfig.edges){
        if(!checkGraphPartition(graphConfig.edges, graphConfig.numNodes)) {
            errors.push("O grafo não pode estar particionado.")
        }
    }

    if(errors.length > 0)
        return errors;
    return null;
}

export async function createP2PGraph(graphConfig: GraphConfig){
    const p2pGraph = new Graph();

    for(const node of Object.keys(graphConfig.resources)){
        p2pGraph.addNode(node, graphConfig.resources[node]);
    }

    for(const edge of graphConfig.edges){
        const [nx, ny] = edge;
        p2pGraph.addEdge(nx, ny);
    }

    return p2pGraph;
}

/**
 * Verifica se o grafo possui partições
 * @param edges 
 * @param numNodes 
 */
function checkGraphPartition(edges: Edge[], numNodes: number): boolean{
    const connections = Array.from({ length: numNodes }, (_, i) => [`n${i + 1}`]);
    for(const edge of edges){
        const [nOrigin, nDest] = edge;
        
        let originPos = -1;
        let destPos = -1;


        for(let [i, conn] of connections.entries()){
            if(originPos !== -1 && destPos !== -1)
                break;
            
            if(conn.includes(nOrigin))
               originPos = i;

            if(conn.includes(nDest))
                destPos = i;
        }

        if(originPos === destPos)
            continue;
        
        connections[originPos].push(...connections[destPos]);
        connections[destPos] = [];
    }
    const partitions = connections.filter(el => el.length > 0);
    if(partitions.length > 1)
        return false;
    return true;
}