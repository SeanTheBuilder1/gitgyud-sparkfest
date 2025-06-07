import FilterPanel from "../components/FilterPanel";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import "../App.css";
import { useState } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

export default function ReportMap({ token, loadSupabaseUser }) {
    const [filter, setFilter] = useState({
        status: {
            open: true,
            closed: false,
            resolved: false,
        },
        category: {
            Infrastructure: true,
            Health: true,
            Sanitation: true,
            Safety: true,
            Transportation: true,
            Utilities: true,
            Environment: true,
            Government: true,
            Others: true,
        },
        district: 0,
        update_barangays: true,
        barangays: {},
    });
    const [auth_open, setAuthOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div>
            <Navbar token={token} activeTab={"map"} setOpen={setAuthOpen} setIsLogin={setIsLogin} />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gap: "1.5rem",
                }}
            >
                <FilterPanel filter={filter} setFilter={setFilter} />
                <div
                    style={{
                        "grid-column": "span 10",
                        padding: "1rem",
                    }}
                >
                    <Map
                        style={{ width: "70vw", height: "70vh" }}
                        defaultZoom={13}
                        defaultCenter={{ lat: 14.6625, lng: 121.035 }}
                        onCameraChanged={(ev) =>
                            console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
                        }
                    ></Map>
                </div>
            </div>
            {auth_open && (
                <AuthPanel
                    open={auth_open}
                    onOpenChange={setAuthOpen}
                    isLogin={isLogin}
                    loadSupabaseUser={loadSupabaseUser}
                />
            )}
        </div>
    );
}
