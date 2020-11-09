# Pathfinder

React application that uses various algorithms (such as Dijkstra, A*, nba) for shortest path search.

## Map

Main component of the application uses [Leaflet map](https://leafletjs.com/) for interaction with users.

## Road graph

Source of data for the road graph is [OpenStreetMap](https://www.openstreetmap.org/) through 
[Overpass Turbo](https://overpass-turbo.eu/).

### Example of Overpass Turbo query

```
[out:json];
 way["highway"~"motorway|motorway_link|trunk|trunk_link|primary|primary_link|secondary|secondary_link|tertiary|
      tertiary_link|unclassified|unclassified_link|residential|residential_link|service|service_link|living_street|pedestrian|
      road"](area:3154535695);
 (._;>;);
 out skel;
```

## Algorithm realization

[ngraph.path](https://github.com/anvaka/ngraph.path) is a light and fast library that provides Dijkstra, A* and nba 
algorithms for path finding in graphs.
