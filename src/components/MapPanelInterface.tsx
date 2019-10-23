import React from 'react';
import { connect } from 'react-redux';

import createGraph, { Graph, Link, Node }  from 'ngraph.graph';
import { aStar, aGreedy, nba, PathFinder } from 'ngraph.path'

import L, { LatLngBounds, Layer, LayerGroup } from 'leaflet';
import { Map, LatLngExpression } from "leaflet";

import { AppState } from "../store";
import { ControlPanelState } from "../store/controlPanel/types";

import kirovRoads from '../assets/kirov-roads.json';

interface MapPanelInterfaceProps {
    controlPanel: ControlPanelState;
}

interface MapPanelInterfaceState {
    graph: Graph;
    graphLayer: LayerGroup;
    map: Map;
    polyline: Layer;
}

interface NodeData {
    lat: number,
    lon: number,
}

class MapPanelInterface extends React.Component<MapPanelInterfaceProps, MapPanelInterfaceState> {
    componentDidMount(): void {
        let map = L.map('map', {
            center: [58.6026, 49.66664],
            zoom: 16,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });

        L.marker([58.6052333, 49.6666882])
            .bindTooltip('Дерево желаний', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.6018713, 49.6681091])
            .bindTooltip('Музей Васнецовых', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.5940628, 49.6816840])
            .bindTooltip('Филармония', {
                permanent: true
            })
            .addTo(map);

        this.setState({ map: map });

        let graph = createGraph();

        kirovRoads.elements.forEach(element => {
            if (element.type === 'node') {
                graph.addNode(element.id, { lat: element.lat, lon: element.lon });
            }
            else if (element.type === 'way' ) {
                const nodes = element.nodes;
                for (let i = 1; i < nodes.length; ++i) {
                    graph.addLink(nodes[i], nodes[i-1]);
                }
            }
        });

        this.setState({ graph: graph });
    };

    componentDidUpdate(prevProps: MapPanelInterfaceProps, prevState: MapPanelInterfaceState): void {
        if(this.props.controlPanel.startPoint && this.props.controlPanel.endPoint && this.props.controlPanel.algorithm) {
            if(prevProps !== this.props) {
                if(prevProps.controlPanel.startPoint !== this.props.controlPanel.startPoint ||
                    prevProps.controlPanel.endPoint !== this.props.controlPanel.endPoint) {
                    const lonPadding = 0.00583;
                    const latPadding = 0.00311;

                    let pointStart = this.state.graph.getNode(this.props.controlPanel.startPoint);
                    let pointEnd = this.state.graph.getNode(this.props.controlPanel.endPoint);

                    if(pointStart && pointEnd) {
                        let pointALat: number;
                        let pointALon: number;
                        let pointBLat: number;
                        let pointBLon: number;

                        if (pointStart.data.lon > pointEnd.data.lon) {
                            pointALon = pointStart.data.lon + lonPadding;
                            pointBLon = pointEnd.data.lon - lonPadding;
                        } else {
                            pointALon = pointStart.data.lon - lonPadding;
                            pointBLon = pointEnd.data.lon + lonPadding;
                        }

                        if (pointStart.data.lat > pointEnd.data.lat) {
                            pointALat = pointStart.data.lat + latPadding;
                            pointBLat = pointEnd.data.lat - latPadding;
                        } else {
                            pointALat = pointStart.data.lat - latPadding;
                            pointBLat = pointEnd.data.lat + latPadding;
                        }

                        let bounds = new LatLngBounds([pointALat, pointALon], [pointBLat, pointBLon]);

                        if(this.state.graphLayer) {
                            this.state.map.removeLayer(this.state.graphLayer);
                        }

                        let lines: any = [];

                        this.state.graph.forEachNode((node: Node): boolean => {
                            if(bounds.contains([node.data.lat, node.data.lon])) {
                                node.links.forEach((link: Link): void => {
                                    if(link.fromId === node.id) {
                                        let toNode = this.state.graph.getNode(link.toId);
                                        if(toNode) {
                                            let line = L.polyline([[node.data.lat, node.data.lon], [toNode.data.lat, toNode.data.lon]], {
                                                color: 'green'
                                            });
                                            lines.push(line);
                                        }
                                    }
                                });
                            }
                            return false;
                        });

                        let graphLayer = L.layerGroup(lines)
                            .addTo(this.state.map);

                        if(prevState.graphLayer !== graphLayer) {
                            this.setState({ graphLayer: graphLayer });
                        }
                    }

                }

                let pathfinder: PathFinder<NodeData>;

                switch (this.props.controlPanel.algorithm) {
                    case 'aGreedy':
                        pathfinder = aGreedy(this.state.graph, {distance: this.distance, heuristic: this.heuristic});
                        break;
                    case 'aStar':
                        pathfinder = aStar(this.state.graph, {distance: this.distance, heuristic: this.heuristic});
                        break;
                    case 'nba':
                        pathfinder = nba(this.state.graph, {distance: this.distance, heuristic: this.heuristic});
                        break;
                    default:
                        return;
                }

                if(this.state.polyline) {
                    this.state.map.removeLayer(this.state.polyline);
                }

                const result = pathfinder.find(this.props.controlPanel.startPoint, this.props.controlPanel.endPoint);

                const path: LatLngExpression[] = result.map(element => {
                    return [element.data.lat, element.data.lon]
                });

                let polyline = L.polyline(path, {
                    color: 'red'
                })
                    .addTo(this.state.map);

                if(prevState.polyline !== polyline) {
                    this.setState({ polyline: polyline });
                }
            }
        }
    }

    distance(fromNode: Node, toNode: Node) {
        let dx = fromNode.data.lat - toNode.data.lat;
        let dy = fromNode.data.lon - toNode.data.lon;

        return Math.sqrt(dx * dx + dy * dy);
    }

    heuristic(fromNode: Node, toNode: Node) {
        let dx = fromNode.data.lat - toNode.data.lat;
        let dy = fromNode.data.lon - toNode.data.lon;

        return Math.sqrt(dx * dx + dy * dy);
    }

    render() {
        return (
            <div className='map-panel'>
                <div id='map'>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    controlPanel: state.controlPanel
});

export default connect(
    mapStateToProps
)(MapPanelInterface);