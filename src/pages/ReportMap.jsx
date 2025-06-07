import FilterPanel from "../components/FilterPanel";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import "../App.css"
import { useState } from "react";

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
<gmp-map
      center="43.4142989,-124.2301242"
      zoom="4"
      map-id="DEMO_MAP_ID"
      style={{height: "400px"}}
    >
      <gmp-advanced-marker
        position="37.4220656,-122.0840897"
        title="Mountain View, CA"
      ></gmp-advanced-marker>
      <gmp-advanced-marker
        position="47.648994,-122.3503845"
        title="Seattle, WA"
      ></gmp-advanced-marker>
    </gmp-map>


    <script
      src="https://maps.googleapis.com/maps/api/js?key=KEY&libraries=maps,marker&v=beta"
      defer
    ></script>

</div>

       // <div>
        //     <Navbar token={token} activeTab={"map"} setOpen={setAuthOpen} setIsLogin={setIsLogin} />
        //     <div
        //         style={{
        //             display: "grid",
        //             gridTemplateColumns: "repeat(12, 1fr)",
        //             gap: "1.5rem",
        //         }}
        //     >
        //         <FilterPanel filter={filter} setFilter={setFilter} />
        //     </div>
        //     {auth_open && (
        //         <AuthPanel
        //             open={auth_open}
        //             onOpenChange={setAuthOpen}
        //             isLogin={isLogin}
        //             loadSupabaseUser={loadSupabaseUser}
        //         />
        //     )}
        // </div>
    );
}
