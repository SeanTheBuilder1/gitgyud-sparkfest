import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

const category_lookup = [
    { id: 0, name: "Road" },
    { id: 1, name: "Sanitation" },
    { id: 2, name: "Parks" },
    { id: 3, name: "Utilities" },
    { id: 4, name: "Neighbor" },
    { id: 5, name: "Property" },
    { id: 6, name: "Safety" },
    { id: 7, name: "Transportation" },
    { id: 8, name: "Animals" },
    { id: 9, name: "Environment" },
    { id: 10, name: "Governmental" },
    { id: 11, name: "Others" },
];

function TableRow(item) {
    const item_id = item.issue_id;
    if (item?.users?.username) {
        return (
            <tr>
                <td>
                    <Link to={"/issues/".concat(item_id)}>{item.issue_subject}</Link>
                </td>
                <td>{item.issue_body}</td>
                <td>{item.users.username}</td>
                <td>{item.issue_state}</td>
                <td>{item.issue_category}</td>
            </tr>
        );
    } else {
        return (
            <tr>
                <td>
                    <Link to={"/issues/".concat(item_id)}>{item.issue_subject}</Link>
                </td>
                <td>{item.issue_body}</td>
                <td>Anonymous User</td>
                <td>{item.issue_state}</td>
                <td>{item.issue_category}</td>
            </tr>
        );
    }
}

function Preview({ token }) {
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [data, setData] = useState();
    const table = [];
    async function getIssues() {
        const { data, error } = await supabase.from("issues").select("*, users(username)").eq("issue_state", "open");
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
                <table>
                    <thead>
                        <tr>
                            <th>Issue Subject</th>
                            <th>Issue Body</th>
                            <th>Author</th>
                            <th>Issue State</th>
                            <th>Issue Category</th>
                        </tr>
                    </thead>
                    <tbody>{data.map((item, index) => TableRow(item))}</tbody>
                </table>
                {token ? (
                    <div>
                        <Link to="/profile">
                            <button>Profile</button>
                        </Link>
                        <Link to="/issue-create">
                            <button>Post Issue</button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}

export default Preview;
