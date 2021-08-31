import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "./Map.css";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = ({ lng, lat }) => {
    useEffect(() => {
        setTimeout(() => {
            const map = new mapboxgl.Map({
                attributionControl: false,
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [lng, lat],
                zoom: 13
            });
            let marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
            let nav = new mapboxgl.NavigationControl();
            map.addControl(nav, "top-left");
            let scale = new mapboxgl.ScaleControl({
                maxWidth: 80,
                unit: "imperial"
            });
            map.addControl(scale);

            scale.setUnit("metric");
        }, 500);
    }, [lng, lat]);

    return <div id="map" />;
};

export default Map;
