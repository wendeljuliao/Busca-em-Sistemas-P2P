import { loadGraphConfig, validateConfigFile, createP2PGraph} from "./util/util";
import path from 'path';
import { floodSearch, cacheFloodSearch } from "./search-algorithms/flood-search";
import { randomSearch, cacheRandomSearch } from "./search-algorithms/random-search";

async function main() {
    const filePath = path.resolve('./config.json');
    const jsonData = await loadGraphConfig(filePath);
    console.log("Arquivo de configuração carregado:", jsonData);
    validateConfigFile(jsonData!)
    const p2pGraph = await createP2PGraph(jsonData!);

    // 1 - FLOOD SEARCH
    // const found = floodSearch(p2pGraph, 'n1', 'r10', 2);
    // 2 - RANDOM SEARCH
    // const found = randomSearch(p2pGraph, 'n1', 'r10', 8);

    // 3 - CACHE FLOOD SEARCH
    // const found = cacheFloodSearch(p2pGraph, 'n1', 'r10', 20);
    // console.log(found);
    // const found2 = cacheFloodSearch(p2pGraph, 'n1', 'r10', 20);
    // console.log(found2);

    // 4- CACHE RANDOM SEARCH
    const found = cacheRandomSearch(p2pGraph, 'n1', 'r10', 20);
    console.log(found);
    const found2 = cacheRandomSearch(p2pGraph, 'n1', 'r10', 20);
    console.log(found2);
}

main();