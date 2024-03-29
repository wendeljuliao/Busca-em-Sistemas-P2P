import React, { useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'
import { Container } from './styles'

export function GraphView({ fileText, path}) {

    const [graphData, setGraphData] = useState({
        nodes: Array.from({ length: fileText.num_nodes }, (v, index) => {  
            return {id: index + 1,
                    label: `Node ${index + 1}`,
                    title: fileText.resources[`n${index+1}`].join(),
                    font: {color: "red"}
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
            font: {color: "red"}
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
              color: 'white'
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
        const updatedNode = { ...node, font: {color: 'white'} }
/*         const updatedEdge = { ...edge, color: 'white', width: 3}
 */
        const updatedGraph = { 
                          nodes: [...updatedGraphData.nodes, updatedNode],
                          edges: [...updatedGraphData.edges]
                          /* edges: [...updatedGraphData.edges, updatedEdge]  */
                        }

        setGraphData(updatedGraph);
      }

    useEffect(() => {

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