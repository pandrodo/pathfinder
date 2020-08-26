import React from 'react';
import { connect } from 'react-redux';

import createGraph, {Graph, Link, Node, NodeId} from 'ngraph.graph';

import aStarPathSearch from "../lib/a-star";
import aGreedy from "../lib/a-greedy-star";

import L, {LatLngBounds, Layer, LayerGroup, LeafletMouseEvent} from 'leaflet';
import { Map, LatLngExpression } from "leaflet";

import { AppState } from "../store";
import { ControlPanelState } from "../store/controlPanel/types";
import { setStartPoint, setEndPoint, setPathLength } from "../store/controlPanel/actions";
import { alertClear } from "../store/alerts/actions";
import { UserPanelState } from "../store/users/types";
import { addNewPointEnd, addNewPoint, getPoints } from "../store/users/actions";

import kirovRoads from '../assets/kirov-roads.json';

interface MapPanelInterfaceProps {
    controlPanel: ControlPanelState;
    userPanel: UserPanelState;
    setPathLength: typeof setPathLength;
    setStartPoint: typeof setStartPoint;
    setEndPoint: typeof setEndPoint;
    alertClear: typeof alertClear;
    addNewPointEnd: typeof addNewPointEnd;
    addNewPoint: typeof addNewPoint;
    getPoints: typeof getPoints;
}

interface MapPanelInterfaceState {
    graph: Graph;
    graphLayer: LayerGroup;
    markerLayer: LayerGroup;
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

interface Route {
    start: string;
    end: string;
    algorithm: string;
    data: LatLngExpression[];
    pathLength: number;
}

class MapPanelInterface extends React.Component<MapPanelInterfaceProps, MapPanelInterfaceState> {
    constructor(props: MapPanelInterfaceProps, state: MapPanelInterfaceState) {
        super(props, state);

        this.handleMapClick = this.handleMapClick.bind(this);
    }

    handleMapClick(e: LeafletMouseEvent) {
        if(this.props.userPanel.addingNewPoint) {
            this.props.addNewPointEnd();

            let nearestNodeId: { id: string, distance: number } = { id: '', distance: 9999999999999 };
            const newPoint: Node = { id: 'newPointId', links: [], data: { lat: e.latlng.lat, lon: e.latlng.lng} };

            kirovRoads.elements.forEach(element => {
                if (element.type === 'node') {
                    let currentNode: Node = { id: element.id, links: [], data: { lat: element.lat, lon: element.lon }};
                    let distance = this.distance(newPoint, currentNode);
                    if (distance < nearestNodeId.distance) {
                        nearestNodeId = { id: element.id, distance: distance };
                    }
                }
            });

            const name = prompt('Введите название для выбранной точки');
            if (name) {
                this.props.addNewPoint(this.props.userPanel.user.username, nearestNodeId.id, name);
                this.props.getPoints(this.props.userPanel.user.username);
                window.location.reload();
            }

            this.props.alertClear();
        }
    }

    //componentDidMount вызывается один раз при инициализации компонента
    componentDidMount(): void {
        //Проверка наличия записи в localStorage
        const storedRoutes = localStorage.getItem('routes');
        if (!storedRoutes) {
            const routes: Route[] = [];
            localStorage.setItem('routes', JSON.stringify(routes));
        }

        let map = L.map('map', {
            center: [58.6026, 49.66664],
            zoom: 16,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ],
        });

        map.on('click', this.handleMapClick);

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

        let markerLayer = L.layerGroup().addTo(map);

        this.props.userPanel.user.points.forEach(point => {
            const node = graph.getNode(point.nodeId);
            if (node) {
                L.marker([node.data.lat, node.data.lon])
                    .bindTooltip(point.name, {
                        permanent: false
                    })
                    .addTo(markerLayer);
            }
        });

        this.setState({ markerLayer: markerLayer });

        this.setState({ graph: graph });
    };

    //componentDidUpdate вызывается при каждом изменении props/state компонента
    componentDidUpdate(prevProps: MapPanelInterfaceProps, prevState: MapPanelInterfaceState): void {
        //Проверка наличия записи в localStorage
        const storedRoutes = localStorage.getItem('routes');
        if (!storedRoutes) {
            const routes: Route[] = [];
            localStorage.setItem('routes', JSON.stringify(routes));
        }

        if(JSON.stringify(prevProps.userPanel.user.points) !== JSON.stringify(this.props.userPanel.user.points)) {
            if(this.state.markerLayer) {
                this.state.map.removeLayer(this.state.markerLayer);
            }

            let markerLayer = L.layerGroup().addTo(this.state.map);

            this.props.userPanel.user.points.forEach(point => {
                const node = this.state.graph.getNode(point.nodeId);
                if (node) {
                    L.marker([node.data.lat, node.data.lon])
                        .bindTooltip(point.name, {
                            permanent: false
                        })
                        .addTo(markerLayer);
                }
            });

            if(this.props.userPanel.user.points[0]) {
                this.props.setStartPoint(this.props.userPanel.user.points[0].nodeId);
                this.props.setEndPoint(this.props.userPanel.user.points[0].nodeId);
            }

            this.setState({markerLayer: markerLayer});
        }
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

                        if (this.state.graphLayer) {
                            this.state.map.removeLayer(this.state.graphLayer);
                        }

                        let lines: any = [];

                        if (this.props.controlPanel.startPoint !== this.props.controlPanel.endPoint) {
                            this.state.graph.forEachNode((node: Node): boolean => {
                                if (bounds.contains([node.data.lat, node.data.lon])) {
                                    node.links.forEach((link: Link): void => {
                                        if (link.fromId === node.id) {
                                            //рисуем только те ребра (link), которые ведут к ноду
                                            let toNode = this.state.graph.getNode(link.toId);
                                            if (toNode) {
                                                let distance = Math.round(this.distance(node, toNode)).toString();
                                                let line = L.polyline([[node.data.lat, node.data.lon], [toNode.data.lat, toNode.data.lon]], {
                                                    color: 'green'
                                                }).bindTooltip(distance, {
                                                    permanent: false
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

                            if (prevState.graphLayer !== graphLayer) {
                                this.setState({graphLayer: graphLayer});
                            }
                        }
                    }
                }

                //расчет непосредственно маршрута
                if(prevProps.controlPanel.startPoint !== this.props.controlPanel.startPoint ||
                    prevProps.controlPanel.endPoint !== this.props.controlPanel.endPoint ||
                    prevProps.controlPanel.algorithm !== this.props.controlPanel.algorithm) {

                    let path: LatLngExpression[];
                    let pathLength: number;

                    const storedRoutes = localStorage.getItem('routes');
                    if (storedRoutes) {
                        let routes: Route[] = JSON.parse(storedRoutes);

                        const foundRoute = routes.find(route =>
                            (route.start === this.props.controlPanel.startPoint && route.end === this.props.controlPanel.endPoint && route.algorithm === this.props.controlPanel.algorithm) ||
                            (route.start === this.props.controlPanel.endPoint && route.end === this.props.controlPanel.startPoint &&  route.algorithm === this.props.controlPanel.algorithm)
                        )

                        if (foundRoute) {
                            path = foundRoute.data;
                            pathLength = foundRoute.pathLength;
                        } else {
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

                            const result = pathfinder.find(this.props.controlPanel.startPoint, this.props.controlPanel.endPoint);

                            path = result.map(element => {
                                return [element.data.lat, element.data.lon]
                            });

                            //Расчет длины пути для отображения в controlPanel
                            pathLength = 0;
                            for (let i = 1; i < result.length; ++i) {
                                let length = this.distance(result[i], result[i-1]);
                                pathLength += length;
                            }

                            //Запись рассчитанного маршрута в localStorage
                            const newRoute: Route = {
                                start: this.props.controlPanel.startPoint,
                                end: this.props.controlPanel.endPoint,
                                algorithm: this.props.controlPanel.algorithm,
                                data: path,
                                pathLength: pathLength
                            }
                            routes.push(newRoute);
                            localStorage.setItem('routes', JSON.stringify(routes));
                        }

                        //Отрисовка маршрута
                        if(this.state.polyline) {
                            this.state.map.removeLayer(this.state.polyline);
                        }

                        let polyline = L.polyline(path, {
                            color: 'red',
                            interactive: false
                        })
                            .addTo(this.state.map);


                        if(prevState.polyline !== polyline) {
                            this.setState({ polyline: polyline });
                        }

                        // Вывод длины пути
                        this.props.setPathLength(Math.round(pathLength).toString());
                    }
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
    controlPanel: state.controlPanel,
    userPanel: state.userPanel,
});

export default connect(
    mapStateToProps,
    { setStartPoint, setEndPoint, setPathLength, alertClear, addNewPointEnd, addNewPoint, getPoints }
)(MapPanelInterface);