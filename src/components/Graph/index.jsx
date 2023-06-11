import React, { useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'
import { Container } from './styles'

export function GraphView({ fileText, path}) {

    const [graphData, setGraphData] = useState({
        nodes: Array.from({ length: fileText.num_nodes }, (v, index) => {  
            return {id: index + 1,
                    label: `Node ${index + 1}`,
                    title: '',
                    font: {color: "yellow"}
                }
        }),
        edges: fileText.edges.map(edge => {
            const [e0, e1] = edge;
            return {
                from: parseInt(e0.replace('n', '').trim()),
                to: parseInt(e1.replace('n', '').trim()),
                color: 'yellow',
                width: 1
            }
        }),
      });
    
/*     const nodes = Array.from({ length: fileText.num_nodes }, (v, index) => {  
        return {id: index + 1,
                label: `Node ${index + 1}`,
                title: ''}
    })

    const edges = fileText.edges.map(edge => {
        const [e0, e1] = edge;
        return {
            from: parseInt(e0.replace('n', '').trim()),
            to: parseInt(e1.replace('n', '').trim())
        }
    }) */

    /* console.log(nodes)
    console.log(edges) */

    /* const graph = {
        nodes: graphData.nodes,
        edges: graphData.edges
    }; */

    const options = {
        physics: {
            enabled: false
        },
        interaction: {
            navigationButtons: true
        },
        nodes: {
            borderWidth: 2,
            size: 40,
            color: {
                border: "#222222",
                background: "#666666"
            },
            font: {color: "yellow"}
        },
        edges: {
            color: "yellow",
            arrows: {
                to: { enabled: false },
                from: { enabled: false }
            },
            width: 1
        },
        height: "100%",
    }

    const events = {
        select: function(event) {
            let { nodes, edges } = event;
            console.log(nodes, edges)
        },
        
    };

    function animateGraph(nodeId) {
        const updatedGraphData = {
          nodes: [...graphData.nodes],
          edges: [...graphData.edges],
        };

        const extractedId = parseInt(nodeId.replace('n', ''))
        
        // Faz alguma alteração nos dados do gráfico
        // Neste exemplo, estamos mudando a cor dos nós em um loop contínuo
        /* const updatedNodes = updatedGraphData.nodes.map((node) => {
          return {
              ...node,
              font: {
              color: 'red'
          }}
        });

        const updatedEdges = updatedGraphData.edges.map((edge) => {
          return {
              ...edge,
              color: 'white',
              width: 3
          }
        }); */

        const node = updatedGraphData.nodes.find((node) => node.id === extractedId);
/*         const edge = updatedGraphData.edges.find((edge) => edge.from === 1);
 */
        const updatedNode = { ...node, font: {color: 'red'} }
/*         const updatedEdge = { ...edge, color: 'white', width: 3}
 */
        const updatedGraph = { 
                          nodes: [...updatedGraphData.nodes, updatedNode],
                          edges: [...updatedGraphData.edges]
                          /* edges: [...updatedGraphData.edges, updatedEdge]  */
                        }

        setGraphData(updatedGraph);
      }

    async function reset() {

        const updatedGraphData = {
            nodes: [...graphData.nodes],
            edges: [...graphData.edges],
          };

        const updatedNodes = updatedGraphData.nodes.map((node) => {
            return {
                ...node,
                font: {
                color: 'yellow'
            }}
          });

        
        const updatedGraph = { 
            nodes: [...updatedNodes],
            edges: [...graphData.edges]
            /* edges: [...updatedGraphData.edges, updatedEdge]  */
        }

        setGraphData(updatedGraph);
    }

    useEffect(() => {
        // reset();
/*         for (let i = 0; i < path.length; i++) {
            setInterval(animateGraph(path[i]), 1000);

        } */

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < path.length) {
                animateGraph(path[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval); // Limpa o intervalo quando o laço for concluído
            }
            console.log("teste")
        }, 1000);

/*         const animationInterval = setInterval(animateGraph, 1000);
 */    
        return () => {
          clearInterval(interval);
        }; 
      }, [path]);

  return (
    <Container>
        <Graph 
            graph={graphData}
            options={options}
            events={events}
        />
    </Container>
  )
}