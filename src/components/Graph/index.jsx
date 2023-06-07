import React, { useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'
import { Container } from './styles'

export function GraphView({ fileText }) {
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
                color: 'yellow'
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
            }
        },
        height: "100%",
    }

    const events = {
        select: function(event) {
            let { nodes, edges } = event;
            console.log(nodes, edges)
        },
        
    };

    useEffect(() => {
        // Função para animar o gráfico
        const animateGraph = () => {
          const updatedGraphData = {
            nodes: [...graphData.nodes],
            edges: [...graphData.edges],
          };
    
          // Faz alguma alteração nos dados do gráfico
          // Neste exemplo, estamos mudando a cor dos nós em um loop contínuo
          const updatedNodes = updatedGraphData.nodes.map((node) => {
            return {
                ...node,
                font: {
                color: 'red'
            }}
          });

          const updatedEdges = updatedGraphData.edges.map((edge) => {
            return {
                ...edge,
                color: 'white'
            }
          });

          setGraphData({nodes: updatedNodes, edges: updatedEdges});
        };
    
        // Define um intervalo para a animação
        const animationInterval = setInterval(animateGraph, 1000);
    
        // Limpa o intervalo quando o componente é desmontado
        return () => {
          clearInterval(animationInterval);
        };
      }, [graphData]);

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