import React, { memo } from "react";
import { FaLocationDot } from "react-icons/fa6";
import GoogleMapReact from "google-map-react";
const MarkComponent = ({ icon }) => <div>{icon}</div>;
const Map = ({ coords, address }) => {
    return (
        <div className="   h-[600px] w-full relative">
            <div className="absolute top-[8px] left-[60px] z-50 max-w-[200px] bg-white shadow-md p-4 text-xs">
                {address}
            </div>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
                defaultCenter={coords}
                defaultZoom={17}
                center={coords}
            >
                <MarkComponent
                    lat={coords?.lat}
                    lng={coords?.lng}
                    icon={<FaLocationDot color="red" size={24} />}
                    text={address}
                />
            </GoogleMapReact>
        </div>
    );
};

export default memo(Map);