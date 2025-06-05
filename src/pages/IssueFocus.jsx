import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function UserProfile({ token }) {
    const { issue_id } = useParams();
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [data, setData] = useState();
    const table = [];
    async function getIssues() {
        const { data: user_data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            console.log(user_error);
            return "";
        }
        const { data, error } = await supabase
            .from("issues")
            .select("*, users(username)")
            .eq("issue_id", parseInt(issue_id))
            .single();
        if (error) {
        } else {
            return data;
        }
    }
    useEffect(() => {
        if (!data) getIssues().then(setData); // enforce run once
    }, [data]);
    if (data) {
        return (
            <div>
                <h1>Open Issues</h1>
                <h2>{data.issue_subject}</h2>
                {data.issue_body}
                <br />
                {data.issue_category}
                <br />
                {data.issue_state}
                <br />
                {data?.users?.username ? data.users.username : "Anonymous User"}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default UserProfile;
