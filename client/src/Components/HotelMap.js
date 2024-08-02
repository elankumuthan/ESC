import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState, useRef } from "react";
import Popover from './Popover'; // Import the Popover component
import '../Styles/HotelMap.css';
import '../Styles/LoadingSpinner.css'; // Import the loading spinner CSS

const libraries = ['places']; // Include libraries if needed

// Define the HotelMap component
const HotelMap = ({ hotels, hoveredHotelId, setHoveredHotelId }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAkEAiHZLnlGMPNLjLw-VwNkocnxQ2mTLs', // Replace with your API key
        libraries,
    });

    const [loading, setLoading] = useState(true);
    const [popover, setPopover] = useState({ visible: false, position: {}, content: '' });

    // Ref to the GoogleMap instance
    const mapRef = useRef(null);

    useEffect(() => {
        if (hotels && hotels.length > 0) {
            setLoading(false);
        }
    }, [hotels]);

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded || loading) {
        return (
            <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }

    const createMarkerIcon = (color, size) => {
        const svgMarker = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="2"/>
      </svg>`;
        return {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarker)}`,
            scaledSize: new window.google.maps.Size(size.width, size.height),
            anchor: new window.google.maps.Point(size.width / 2, size.height / 2)
        };
    };

    const handleMarkerMouseOver = (hotel) => {
        setHoveredHotelId(hotel.id);

        if (mapRef.current) {
            const projection = mapRef.current.getProjection();
            const latLng = new window.google.maps.LatLng(hotel.latitude, hotel.longitude);
            const pixel = projection.fromLatLngToPoint(latLng);

            // Adjust positioning logic
            const scale = Math.pow(2, mapRef.current.getZoom());
            const overlayProjection = new window.google.maps.Point(
                pixel.x * scale,
                pixel.y * scale
            );

            // Adjust position calculation
            const mapContainer = document.querySelector('.map-container');
            const mapRect = mapContainer.getBoundingClientRect();

            setPopover({
                visible: true,
                position: {
                    left: overlayProjection.x - mapRect.left - 50, // Center the popover horizontally
                    top: overlayProjection.y - mapRect.top - 100 // Adjust as needed
                },
                content: hotel.name
            });
        }
    };

    const handleMarkerMouseOut = () => {
        setHoveredHotelId(null);
        setPopover({ visible: false, position: {}, content: '' });
    };

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={
                    hotels.length > 0
                        ? { lat: parseFloat(hotels[0].latitude), lng: parseFloat(hotels[0].longitude) }
                        : { lat: 1.3521, lng: 103.8198 } // Default to Singapore if hotels list is empty or invalid
                }
                zoom={12} // Adjust zoom level
                options={{ disableDefaultUI: true }} // Disable default UI controls
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {hotels.map((hotel) => {
                    const lat = parseFloat(hotel.latitude);
                    const lng = parseFloat(hotel.longitude);

                    if (isNaN(lat) || isNaN(lng)) {
                        console.error(`Invalid coordinates for hotel ID: ${hotel.id}`);
                        return null;
                    }


                    const isLarge = hotel.id === hoveredHotelId;
                    const size = isLarge ? { width: 50, height: 50 } : { width: 25, height: 25 };

                    return (
                        <Marker
                            key={hotel.id}
                            position={{ lat, lng }}
                            title={hotel.name}
                            icon={createMarkerIcon(isLarge ? 'black' : 'white', size)}
                            zIndex={isLarge ? 1000 : 1}
                            onMouseOver={() => handleMarkerMouseOver(hotel)}
                            onMouseOut={handleMarkerMouseOut}
                        />
                    );
                })}
            </GoogleMap>
            {popover.visible && <Popover position={popover.position} content={popover.content} onClose={handleMarkerMouseOut} />}
        </div>
    );
};

export default HotelMap;
