import GraphConfig, { Edge } from '../model/graph-config';
import Graph from '../model/graph';

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


        for(const [i, conn] of connections.entries()){
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