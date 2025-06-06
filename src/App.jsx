import "./App.css";
import { useState, useEffect } from "react";
import { Register, Login, Home, IssueCreate, Preview, UserProfile, IssueFocus, PhoneRegister, Dashboard } from "./pages";
import { Routes, Route } from "react-router-dom";
import supabase from "./supabase-client";

const App = () => {
    const [supabase_user, setSupabaseUser] = useState();

    async function loadSupabaseUser() {
        const { data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            console.log(user_error);
            return;
        }
        setSupabaseUser(data.user);
        console.log(data.user)
    }

    useEffect(() => {
        loadSupabaseUser();
    }, []);

    return (
        <div>
            <Routes>
                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login token={supabase_user} loadSupabaseUser={loadSupabaseUser} />} />
                <Route path={"/"} element={<Preview token={supabase_user} loadSupabaseUser={loadSupabaseUser}/>} />
                <Route path={"/issues/:issue_id"} element={<IssueFocus token={supabase_user} />} />
                {supabase_user ? <Route path={"/phone-otp"} element={<PhoneRegister token={supabase_user} />} /> : ""}
                {supabase_user ? <Route path={"/homepage"} element={<Home token={supabase_user} />} /> : ""}
                {supabase_user ? <Route path={"/dashboard"} element={<Dashboard token={supabase_user} loadSupabaseUser={loadSupabaseUser} />} /> : ""}
                {supabase_user ? (
                    <Route
                        path={"/profile"}
                        element={<UserProfile token={supabase_user} setSupabaseUser={setSupabaseUser} />}
                    />
                ) : (
                    ""
                )}
                {supabase_user ? <Route path={"/issue-create"} element={<IssueCreate token={supabase_user} />} /> : ""}
            </Routes>
        </div>
    );
};

export default App;
