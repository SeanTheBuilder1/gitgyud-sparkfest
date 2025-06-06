import supabase from "../supabase-client";
import {  useNavigate } from "react-router";

async function HandleLogout(navigate) {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert(error);
        console.log(error);
    } else {
        alert("Logged out\n");
        window.location.reload();
    }
}

export default HandleLogout;