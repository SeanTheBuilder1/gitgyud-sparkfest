import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function TableRow({ item }) {
    const item_id = item.issue_id;
    async function deleteItem() {
        const response = await supabase.from("issues").delete().eq("issue_id", item_id);
        if (response.status != 204) {
            alert("Error deleting issue");
            return;
        }
        alert("Deleting issue successful");
        window.location.reload();
    }
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
                <td>
                    <button onClick={deleteItem}>Delete</button>
                </td>
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
                <td>
                    <button onClick={deleteItem}>Delete</button>
                </td>
            </tr>
        );
    }
}

function UserProfile({ token, setSupabaseUser }) {
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
            .eq("user_id", user_data.user.id);
        if (error) {
        } else {
            return data;
        }
    }
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert(error);
            console.log(error);
        } else {
            alert("Logged out\n");
            setSupabaseUser();
            navigate("/");
        }
    }

    useEffect(() => {
        if (!data) getIssues().then(setData); // enforce run once
        console.log(data);
    }, [data]);
    if (data) {
        return (
            <div>
                <h1>{token.user_metadata.username}'s Profile</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Issue Subject</th>
                            <th>Issue Body</th>
                            <th>Author</th>
                            <th>Issue State</th>
                            <th>Issue Category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <TableRow item={item} />
                        ))}
                    </tbody>
                </table>
                {token ? (
                    <div>
                        <Link to="/issue-create">
                            <button>Post Issue</button>
                        </Link>
                        <button onClick={handleLogout}>Logout</button>
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
    } else {
        return <div></div>;
    }
}

export default UserProfile;
