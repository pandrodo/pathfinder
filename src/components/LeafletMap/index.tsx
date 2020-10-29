import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import L from 'leaflet';
import G, {Graph, Node} from 'ngraph.graph';
import {aStar, aGreedy, nba, PathFinder}  from 'ngraph.path';

import './style.css';

import kirovRoads from '../../assets/kirov-roads.json';
import {addNewPoint} from "../../store/users/actions";
import {setAvailablePathfinders} from "../../store/map/actions";
import {AppState} from "../../store";

const LeafletMap = () => {
    interface NodeData {
        lat: number;
        lon: number;
    }

    interface PathFinders {
        [key: string]: PathFinder<NodeData> | null;
    }

    const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);
    const [leafletRouteGroupLayer, setLeafletRouteGroupLayer] = useState<L.LayerGroup | null>(null);
    const [leafletMarkerGroupLayer, setLeafletMarkerGroupLayer] = useState<L.LayerGroup | null>(null);
    const [graph, setGraph] = useState<Graph | null>(null);
    const [pathfinders, setPathfinders] = useState<PathFinders>({
        'aGreedy': null,
        'aStar': null,
        'dijkstra': null,
        'nba': null
    });

    const inputForm = useSelector((state: AppState) => state.inputForm);
    const userName = useSelector((state: AppState) => state.userPanel.user.username);
    const points = useSelector((state: AppState) => state.userPanel.points);
    const selectingPointOnMap = useSelector((state: AppState) => state.userPanel.selectingPointOnMap);

    const dispatch = useDispatch();

    // Prepare distance and heuristics functions
    const distance = (fromNode: Node, toNode: Node): number => {
        const earthRadius = 6378137;

        const fromNodeLatInRadians = fromNode.data.lat * Math.PI / 180;
        const fromNodeLonInRadians = fromNode.data.lon * Math.PI / 180;
        const toNodeLatInRadians = toNode.data.lat * Math.PI / 180;
        const toNodeLonInRadians = toNode.data.lon * Math.PI / 180;

        const haversineLat = Math.pow(Math.sin((toNodeLatInRadians - fromNodeLatInRadians)/2), 2);
        const haversineLon = Math.pow(Math.sin((toNodeLonInRadians - fromNodeLonInRadians)/2), 2);
        const haversine = haversineLat + Math.cos(fromNodeLatInRadians) * Math.cos(toNodeLatInRadians) * haversineLon;

        return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
    }

    useEffect(() => {
        // Prepare leaflet map and grouped layers for markers and path
        const lMap = L.map('map', {
            center: [58.6026, 49.66664],
            zoom: 16,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ],
        });

        setLeafletMarkerGroupLayer(L.layerGroup().addTo(lMap));
        setLeafletRouteGroupLayer(L.layerGroup().addTo(lMap));
        setLeafletMap(lMap);

        // Fill graph with data from file
        const graph = G();
        kirovRoads.elements.forEach(element => {
            if (element.type === 'node') {
                graph.addNode(element.id, { lat: element.lat, lon: element.lon });
            }
            else {
                const nodes = element.nodes;
                for (let i = 1; i < nodes.length; ++i) {
                    graph.addLink(nodes[i], nodes[i-1]);
                }
            }
        });
        setGraph(graph);

        // Prepare pathfinders
        const aGreedyPathfinder: PathFinder<NodeData> = aGreedy(graph, {distance: distance, heuristic: distance});
        const aStarPathfinder: PathFinder<NodeData> = aStar(graph, {distance: distance, heuristic: distance});
        const dijkstraPathfinder: PathFinder<NodeData> = aStar(graph, {distance: distance, heuristic: () => 0});
        const nbaPathfinder: PathFinder<NodeData> = nba(graph, {distance: distance, heuristic: distance});
        const pathfinders = {
            'aGreedy': aGreedyPathfinder,
            'aStar': aStarPathfinder,
            'dijkstra': dijkstraPathfinder,
            'nba': nbaPathfinder
        };
        setPathfinders(pathfinders);

        // Put list of available pathfinders to redux store
        const availablePathfinders = [];
        for (const key of Object.keys(pathfinders)) {
            availablePathfinders.push(key);
        }
        dispatch(setAvailablePathfinders(availablePathfinders));

        // On component unmount
        return () => {
            lMap?.remove();
            graph?.clear();
        };
    }, [dispatch]);

    const cleanPathGroupLayer = useCallback(() => {
        if (leafletRouteGroupLayer) {
            leafletRouteGroupLayer.eachLayer(layer => {
               layer.remove();
            });
        }
    }, [leafletRouteGroupLayer]);

    useEffect(() => {
        cleanPathGroupLayer();

        if (leafletMarkerGroupLayer && graph) {
            // Clean marker group layer
            leafletMarkerGroupLayer.eachLayer(layer => {
                layer.remove();
            });

            // Fill marker group layer with user points
            points.forEach(point => {
                const node = graph.getNode(parseInt(point.nodeId));
                if (node) {
                    L.marker([node.data.lat, node.data.lon])
                        .bindTooltip(point.name, {
                            permanent: false
                        })
                        .addTo(leafletMarkerGroupLayer);
                }
            });
        }
    }, [graph, leafletMarkerGroupLayer, cleanPathGroupLayer, points]);

    useEffect(() => {
        cleanPathGroupLayer();

        // Get new route and fill route group layer
        if (inputForm.startPoint !== inputForm.endPoint) {
            const routeID = inputForm.algorithm + '-' + inputForm.startPoint + '-' + inputForm.endPoint;
            const reverseRouteID = inputForm.algorithm + '-' + inputForm.endPoint + '-' + inputForm.startPoint;
            const storedRoute = localStorage.getItem(routeID) || localStorage.getItem(reverseRouteID);
            let route: Array<L.LatLng> = [];

            if (storedRoute) {
                route = JSON.parse(storedRoute);
            } else {
                const path = pathfinders[inputForm.algorithm]?.find(parseInt(inputForm.startPoint), parseInt(inputForm.endPoint));
                if (path) {
                    route = path.map(element => {
                        return new L.LatLng(element.data.lat, element.data.lon);
                    });
                    localStorage.setItem(routeID, JSON.stringify(route));
                }
            }

            if (leafletRouteGroupLayer && route.length > 0) {
                leafletRouteGroupLayer.addLayer(L.polyline(route, {
                    color: 'red',
                    interactive: false
                }));
            }
        }
    }, [leafletRouteGroupLayer, pathfinders, cleanPathGroupLayer, inputForm]);

    const leafletMapClickHandler = useCallback((event: L.LeafletMouseEvent) => {
        const newPoint = {id: '', links: [], data: {lat: event.latlng.lat, lon: event.latlng.lng }};
        const currentNearestNode = {id: '', distance: Infinity};

        graph?.forEachNode((currentNode) => {
            const d = distance(newPoint, currentNode);
            if (d < currentNearestNode.distance) {
                currentNearestNode.id = currentNode.id.toString();
                currentNearestNode.distance = d;
            }
            return false;
        });
        const newPointName = prompt('Введите название для выбранной точки');
        if (newPointName) {
            dispatch(addNewPoint(userName, currentNearestNode.id, newPointName));
        }
    }, [dispatch, graph, userName]);

    useEffect(() => {
        if (leafletMap) {
            if (selectingPointOnMap) {
                leafletMap.on('click', leafletMapClickHandler);
            } else {
                leafletMap.off('click', leafletMapClickHandler);
            }
        }
    }, [leafletMap, leafletMapClickHandler, selectingPointOnMap]);

    return (
        <div id='map'/>
    );
}

export default LeafletMap;