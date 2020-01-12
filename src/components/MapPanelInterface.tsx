import React from 'react';
import { connect } from 'react-redux';

import createGraph, {Graph, Link, Node, NodeId} from 'ngraph.graph';

import aStarPathSearch from "../lib/a-star";
import aGreedy from "../lib/a-greedy-star";

import L, { LatLngBounds, Layer, LayerGroup } from 'leaflet';
import { Map, LatLngExpression } from "leaflet";

import { AppState } from "../store";
import { ControlPanelState } from "../store/controlPanel/types";
import { setPathLength } from "../store/controlPanel/actions";

import kirovRoads from '../assets/kirov-roads.json';

interface MapPanelInterfaceProps {
    controlPanel: ControlPanelState;
    setPathLength: typeof setPathLength;
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

interface PathFinder<NodeData> {
    find: (from: NodeId, to: NodeId) => Node<NodeData>[]
}

class MapPanelInterface extends React.Component<MapPanelInterfaceProps, MapPanelInterfaceState> {
    //componentDidMount вызывается один раз при инициализации компонента
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

        L.marker([58.5790467, 49.6510139])
            .bindTooltip('Вокзал', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.6340257, 49.6106759])
            .bindTooltip('Факел', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.5777135, 49.6258210])
            .bindTooltip('Дружба', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.5927652, 49.6042923])
            .bindTooltip('Кочуровский парк', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.5757165, 49.6847114])
            .bindTooltip('Зональный институт', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.5910530, 49.6529298])
            .bindTooltip('Диорама', {
                permanent: true
            })
            .addTo(map);

        L.marker([58.6074791, 49.6133608])
            .bindTooltip('Парк Победы', {
                permanent: true
            })
            .addTo(map);

        L.Icon.Default.prototype.options.iconSize = [10, 25];
        L.Icon.Default.prototype.options.iconAnchor = [5, 22];
        L.Icon.Default.prototype.options.shadowSize = [0, 0];

        L.marker([58.5964114, 49.6200889])
            .bindTooltip('Т1', {
                permanent: false,
            })
            .addTo(map);

        L.marker([58.5965427, 49.6202311])
            .bindTooltip('Т2', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5966308, 49.6201828])
            .bindTooltip('Т3', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5966392, 49.6203598])
            .bindTooltip('Т4', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5963974, 49.6210518])
            .bindTooltip('Т5', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5962949, 49.6209325])
            .bindTooltip('Т6', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5961360, 49.6207300])
            .bindTooltip('Т7', {
                permanent: false
            })
            .addTo(map);

        L.marker([58.5967566, 49.6197563])
            .bindTooltip('Т8', {
                permanent: false
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

        // const nodes = [5998899980, 5998899981, 5998899975, 5998899976, 5998899977, 5998899978, 5998899979, 5998899974];
        // let node1 = graph.getNode(nodes[0]);
        // let node2 = graph.getNode(nodes[1]);
        //
        // if (node1 && node2) {
        //     L.polyline([[node1.data.lat, node1.data.lon], [node2.data.lat, node2.data.lon]], {
        //         color: 'blue'
        //     }).bindTooltip('jopa', {
        //         permanent: false
        //     }).addTo(map);
        // }

        this.setState({ graph: graph });
    };

    //componentDidUpdate вызывается при каждом изменении props/state компонента
    componentDidUpdate(prevProps: MapPanelInterfaceProps, prevState: MapPanelInterfaceState): void {
        //проверка на наличие данных в props, которые в свою очередь привязаны к state в redux store
        if(this.props.controlPanel.startPoint && this.props.controlPanel.endPoint && this.props.controlPanel.algorithm) {
            //проверка на то, что изменились именно props компонента, а не state
            if(prevProps !== this.props) {
                //расчет границ области, в которой необходимо отобразить граф только в том случае, если меняется точка
                //старта или точка конца маршрута
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
                                        //рисуем только те ребра (link), которые ведут к ноду
                                        let toNode = this.state.graph.getNode(link.toId);
                                        if(toNode) {
                                            let distance = Math.round(this.distance(node, toNode)).toString();
                                            let line = L.polyline([[node.data.lat, node.data.lon], [toNode.data.lat, toNode.data.lon]], {
                                                color: 'green'
                                            }).bindTooltip(distance, {
                                                permanent:false
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

                //расчет непосредственно маршрута
                if(prevProps.controlPanel.startPoint !== this.props.controlPanel.startPoint ||
                    prevProps.controlPanel.endPoint !== this.props.controlPanel.endPoint ||
                    prevProps.controlPanel.algorithm !== this.props.controlPanel.algorithm) {

                    let pathfinder: PathFinder<NodeData>;

                    switch (this.props.controlPanel.algorithm) {
                        case 'aGreedy':
                            pathfinder = aGreedy(this.state.graph, {distance: this.distance, heuristic: this.distance});
                            break;
                        case 'aStar':
                            pathfinder = aStarPathSearch(this.state.graph, {distance: this.distance, heuristic: this.distance});
                            break;
                        case 'dijkstra':
                            pathfinder = aStarPathSearch(this.state.graph, {distance: this.distance, heuristic: this.dijkstraHeuristic});
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
                        color: 'red',
                        interactive: false
                    })
                        .addTo(this.state.map);


                    if(prevState.polyline !== polyline) {
                        this.setState({ polyline: polyline });
                    }

                    // result.forEach((element, index) => {
                    //     if(result[index+1]){
                    //         let distance = this.distance(result[index], result[index+1]).toString();
                    //         L.polyline([[result[index].data.lat, result[index].data.lon], [result[index+1].data.lat, result[index+1].data.lon]], {
                    //             color: 'red'
                    //         }).bindTooltip(distance)
                    //             .addTo(this.state.map);
                    //     }
                    // });

                    //расчет длины пути для отображения в controlPanel
                    let pathLength = 0;
                    for (let i = 1; i < result.length; ++i) {
                        let length = this.distance(result[i], result[i-1]);
                        pathLength += length;
                    }
                    this.props.setPathLength(Math.round(pathLength).toString());
                }
            }
        }
    }

    distance(fromNode: Node, toNode: Node) {
        const earthRadius = 6378137;

        const fromNodeLatInRadians = fromNode.data.lat * Math.PI / 180;
        const fromNodeLonInRadians = fromNode.data.lon * Math.PI / 180;
        const toNodeLatInRadians = toNode.data.lat * Math.PI / 180;
        const toNodeLonInRadians = toNode.data.lon * Math.PI / 180;

        const haversineLat = Math.pow(Math.sin((toNodeLatInRadians - fromNodeLatInRadians)/2), 2);
        const haversineLon = Math.pow(Math.sin((toNodeLonInRadians - fromNodeLonInRadians)/2), 2);

        return 2 * earthRadius * Math.asin(Math.sqrt(haversineLat + Math.cos(fromNodeLatInRadians) * Math.cos(toNodeLatInRadians) * haversineLon));
    }

    dijkstraHeuristic(fromNode: Node, toNode: Node) {
        return 0;
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
    mapStateToProps,
    { setPathLength }
)(MapPanelInterface);