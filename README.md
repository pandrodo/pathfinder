# Pathfinder

React Redux application that uses various algorithms (such as Dijkstra, A*, nba) for shortest path search. Written in
TypeScript. Just check [demo](https://pathfinder-demo-80702.herokuapp.com/).

## Map

The main component of the application uses [Leaflet map](https://leafletjs.com/) for an interaction with users.

## Road graph

As the main source of data for the road graph application uses [OpenStreetMap](https://www.openstreetmap.org/) through 
[Overpass Turbo](https://overpass-turbo.eu/).

### Example of the Overpass Turbo query

```
[out:json];
way["highway"~"motorway|motorway_link|trunk|trunk_link|primary|primary_link|secondary|secondary_link|tertiary|
     tertiary_link|unclassified|unclassified_link|residential|residential_link|service|service_link|living_street|pedestrian|
     road"](area:3154535695);
(._;>;);
out skel;
```

## Algorithms

[ngraph.path](https://github.com/anvaka/ngraph.path) is a light and fast library that provides Dijkstra, A* and nba 
algorithms for solving the shortest path problem in graphs.