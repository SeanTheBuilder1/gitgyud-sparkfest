import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function Comment({ comment }) {
    if (comment?.users?.username) {
        return (
            <div>
                {comment.comment_text}
                {comment.users.username}
            </div>
        );
    } else {
        return (
            <div>
                {comment.comment_text}
                Anonymous User
            </div>
        );
    }
    return;
}

function UserProfile({ token }) {
    const { issue_id } = useParams();
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [data, setData] = useState();
    const [comment_data, setCommentData] = useState();
    const [comment, setComment] = useState();
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
    async function getComments() {
        const { data: user_data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            console.log(user_error);
            return "";
        }
        const { data, error } = await supabase
            .from("comments")
            .select("*, users(username)")
            .eq("issue_id", parseInt(issue_id));
        if (error) {
            console.log(error);
        } else {
            return data;
        }
    }
    async function formSubmit(e) {
        e.preventDefault();
        const { data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            // console.log(user_error);
            return;
        }
        const { error } = await supabase
            .from("comments")
            .insert({
                issue_id: parseInt(issue_id),
                comment_text: comment,
                user_id: data.user.id,
            })
            .single();
        if (error) {
            alert("Error posting comment, please try again later.");
            console.log(error);
        } else {
            alert("Comment Sent");
            window.location.reload();
        }
    }
    useEffect(() => {
        if (!data) getIssues().then(setData); // enforce run once
        if (!comment_data) getComments().then(setCommentData); // enforce run once
    }, [data, comment_data]);
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
                <br />
                {comment_data.map((item, index) => {
                    <Comment comment={item} />;
                })}
                <br />
                <form onSubmit={formSubmit}>
                    Comment:
                    <br />
                    <textarea
                        name="Comment"
                        type={"text"}
                        value={comment}
                        required
                        placeholder="Comment"
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default UserProfile;
