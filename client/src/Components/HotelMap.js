import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import '../Styles/HotelMap.css';

const libraries = ['places']; // Include libraries if needed

const HotelMap = ({ hotels, hoveredHotelId }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAkEAiHZLnlGMPNLjLw-VwNkocnxQ2mTLs', // Replace with your API key
        libraries,
    });

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading...</div>;

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

    if (!hotels || hotels.length === 0) {
        return <div>No hotels available</div>;
    }

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 1.3521, lng: 103.8198 }} // Center map on Singapore
                zoom={12} // Adjust zoom level
                options={{ disableDefaultUI: true }} // Disable default UI controls
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
                        />
                    );
                })}
            </GoogleMap>
        </div>
    );
};

export default HotelMap;