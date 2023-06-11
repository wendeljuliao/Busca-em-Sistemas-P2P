import { loadGraphConfig, validateConfigFile, createP2PGraph} from "./util/util";
import path from 'path';
import { floodSearch, cacheFloodSearch } from "./search-algorithms/flood-search";
import { randomSearch, cacheRandomSearch } from "./search-algorithms/random-search";

async function main() {
    const filePath = path.resolve('./config.json');
    const jsonData = await loadGraphConfig(filePath);
    console.log("Arquivo de configuração carregado:", jsonData);
    const validationErrors = validateConfigFile(jsonData!)

    if(validationErrors){
        //TODO imprimir erros na GUI.
    }

    const p2pGraph = await createP2PGraph(jsonData!);

    // 1 - FLOOD SEARCH
    // const floodSearchResult = floodSearch(p2pGraph, 'n1', 'r4', 20);
    // console.log(floodSearchResult);

    // 2 - RANDOM SEARCH
    // const randomSearchResult = randomSearch(p2pGraph, 'n1', 'r10', 8);
    // console.log(randomSearchResult);
    // 3 - CACHE FLOOD SEARCH
    // const cacheFloodSearchResult = cacheFloodSearch(p2pGraph, 'n1', 'r10', 20);
    // console.log(cacheFloodSearchResult);
    // const cacheFloodSearchResult2 = cacheFloodSearch(p2pGraph, 'n1', 'r10', 20);
    // console.log(cacheFloodSearchResult2);

    // 4- CACHE RANDOM SEARCH
    const cacheRandomSearchResult = cacheRandomSearch(p2pGraph, 'n1', 'r10', 20);
    console.log(cacheRandomSearchResult);
    const cacheRandomSearchResult2 = cacheRandomSearch(p2pGraph, 'n1', 'r10', 20);
    console.log(cacheRandomSearchResult2);
}

main();