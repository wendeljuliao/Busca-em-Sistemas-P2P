import { useState } from 'react'

import { Category } from "../components/Category"
import { Input } from "../components/Input"
import { ButtonStyle, Container, Content, ContentPath, ContentSide, LeftSide, RightSide, Title } from "./styles"
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
  const [visited, setVisited] = useState(0)

  function handleFileChange(event: any) {
    setLoading(true)
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
      setLoading(false)

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
      setLoading(false)
      return alert('Há campos em branco.')
    }


    const p2pGraph = await createP2PGraph(fileText)

    let search: any;

    if (category == 0) {

      console.log('Flooding')

      search = floodSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));


    } else if (category == 1) {

      console.log('Informed Flooding')

      search = cacheFloodSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));



    } else if (category == 2) {

      console.log('Random Walk')

      search = randomSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));


    } else {

      console.log('Informed Random Walk')

      search = cacheRandomSearch(p2pGraph, nodeID, resourceID, parseInt(TTL));


    }

    console.log(search)
    setPath(search.path)
    setVisited(search.visited)

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

            {path.length > 0 &&
              <ContentPath>
                <p>Caminho: {path.join(' => ')}</p>
                <p>Nº de nós visitados: {visited}</p>
              </ContentPath>}
          </RightSide>
        </ContentSide>
      </Content>
    </Container>
  )
}

export default App
