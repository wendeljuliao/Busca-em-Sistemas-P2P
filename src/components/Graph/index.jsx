import React from 'react'
import Graph from 'react-vis-network-graph'
import { Container } from './styles'

export function GraphView({ fileText }) {
    const nodes = Array.from({ length: fileText.num_nodes }, (v, index) => {  
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
    })

    /* console.log(nodes)
    console.log(edges) */

    const graph = {
        nodes: nodes,
        edges: edges
    };

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

  return (
    <Container>
        <Graph 
            graph={graph}
            options={options}
        />
    </Container>
  )
}