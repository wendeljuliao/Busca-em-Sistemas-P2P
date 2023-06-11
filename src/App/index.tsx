import { useState } from 'react'

import { Category } from "../components/Category"
import { Input } from "../components/Input"
import { ButtonStyle, Container, Content, ContentSide, LeftSide, RightSide, Title } from "./styles"
import { validationGrafo } from '../utils/validationGrafo';
import { GraphView } from '../components/Graph';
import { createP2PGraph } from '../utils/util';
import { cacheFloodSearch, floodSearch } from '../search-algorithms/flood-search';
import { cacheRandomSearch, randomSearch } from '../search-algorithms/random-search';

function App() {
  const [loading, setLoading] = useState(false)

  const [nodeID, setNodeID] = useState('');
  const [resourceID, setResourceID] = useState('');
  const [TTL, setTTL] = useState('');
  const [category, setCategory] = useState(0);

  const [fileText, setFileText] = useState();

  const [path, setPath] = useState([])

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      const lines = content.split('\n');

      const obj: any = {};

      let currentSection = '';

      lines.forEach((line: string) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('num_nodes:') || trimmedLine.startsWith('min_neighbors:') || trimmedLine.startsWith('max_neighbors:')) {
          const [key, value] = trimmedLine.split(':');
          obj[key.trim()] = parseInt(value.trim());
        } else if (trimmedLine === 'resources:') {
          currentSection = 'resources';
          obj[currentSection] = {};
        } else if (trimmedLine === 'edges:') {
          currentSection = 'edges';
          obj[currentSection] = [];
        } else if (currentSection === 'resources' && trimmedLine) {
          const [node, resources] = trimmedLine.split(':');
          obj[currentSection][node.trim()] = resources.trim().split(',').map((r) => r.trim());
        } else if (currentSection === 'edges' && trimmedLine) {
          const [source, target] = trimmedLine.split(',');
          obj[currentSection].push([source.trim(), target.trim()]);
        }

      });

      const validation = validationGrafo(obj);

      if (!validation.isValid) {
        return alert(validation.message ?? '')
      }

      setFileText(obj);

    };

    reader.readAsText(file);
  }

  async function executeSearch() {
    setLoading(true)
    if (!fileText) {
      return alert('Arquivo não selecionado.')
    }

    if (!nodeID || !resourceID || !TTL) {
      return alert('Há campos em branco.')
    }


    const p2pGraph = await createP2PGraph(fileText)

    if (category == 0) {

      console.log('Flooding')

      const floodSearchResult: any = floodSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));
      console.log(floodSearchResult)

      setPath(floodSearchResult.path)

    } else if (category == 1) {

      console.log('Informed Flooding')

      const cacheFloodSearchResult: any = cacheFloodSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));
      console.log(cacheFloodSearchResult);

      setPath(cacheFloodSearchResult.path)


    } else if (category == 2) {

      console.log('Random Walk')

      const randomSearchResult: any = randomSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));
      console.log(randomSearchResult);

      setPath(randomSearchResult.path)

    } else {

      console.log('Informed Random Walk')

      const cacheRandomSearchResult: any = cacheRandomSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));
      console.log(cacheRandomSearchResult);

      setPath(cacheRandomSearchResult.path)

    }
    setLoading(false)

  }

  return (
    <Container>
      <Content>
        <Title>Buscas em sistemas P2P</Title>
        {/* {JSON.stringify(fileText)} */}

        <ContentSide>

          <LeftSide>
            {fileText && !loading && <GraphView fileText={fileText} path={path} />}

          </LeftSide>
          <RightSide>
            <input type="file" onChange={handleFileChange} />

            <Input
              type={"text"}
              label={"Node ID"}
              placeholder={"0"}
              value={nodeID}
              setValue={(e) => setNodeID(e.target.value)}
            />

            <Input
              type={"text"}
              label={"Resource ID"}
              placeholder={"0"}
              value={resourceID}
              setValue={(e) => setResourceID(e.target.value)}
            />

            <Input
              type={"text"}
              label={"TTL"}
              placeholder={"0"}
              value={TTL}
              setValue={(e) => setTTL(e.target.value)}
            />

            <Category category={category} setCategory={setCategory} />

            <ButtonStyle onClick={executeSearch}>Buscar</ButtonStyle>

          </RightSide>
        </ContentSide>
      </Content>
    </Container>
  )
}

export default App
