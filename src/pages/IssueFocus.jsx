import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import IssueFocusComp from "../components/IssueFocusComp";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleGenAI } from "@google/genai";
const recaptchaRef = createRef();

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function GeminiModel({ report_input, comment_input }) {
    const [response, setResponse] = useState();
    async function handleGemini() {
        let prompt_data = "Issue Subject: "
            .concat(report_input.issue_subject)
            .concat("Issue Body: ")
            .concat(report_input.issue_body)
            .concat("Issue Author: ");
        if (report_input?.users?.username) {
            prompt_data = prompt_data.concat(report_input.users.username);
        } else {
            prompt_data = prompt_data.concat("Anonymous User");
        }
        let comment_prompt_data;
        comment_input.map((comment) => {
            comment_prompt_data = comment_prompt_data
                .concat("Comment Author: ")
                .concat(comment_input.users.username)
                .concat("Comment Body: ")
                .concat(comment_input.comment_text);
        });

        const response_gemini = await ai.models.generateContent({
            model: "gemini-2.0-flash",
        contents: "You are a moderator of an incident reporting program for public complaints in Quezon City, Philippines, rate this input by its suspiciousness by 0.00 to 1.00 and format your response with and with rationale {1.00}"
                .concat(prompt_data)
                .concat("Comments starts now")
                .concat(comment_prompt_data),
        });
        setResponse(response_gemini);
    }
    return (
        <div style={{"overflow-wrap": "break-word"}}>
            <button onClick={handleGemini}>Click to unleash him</button>
            <p>{response ? response.text : ""}</p>
        </div>
    );
}
function Comment({ comment }) {
    if (comment?.users?.username) {
        return (
            <div>
                {comment.comment_text}
                <br />
                Commenter: {comment.users.username}
            </div>
        );
    } else {
        return (
            <div>
                {comment.comment_text}
                <br />
                Commenter: Anonymous User
            </div>
        );
    }
    return;
}

export default function IssueFocus({ token }) {
    const { issue_id } = useParams();
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [data, setData] = useState();
    const [comment_data, setCommentData] = useState();
    const table = [];

    useEffect(() => {
        async function getIssues() {
            const { data, error } = await supabase
                .from("issues")
                .select("*, users(username), barangay_lookup_table(barangay_name, district)")
                .eq("issue_id", parseInt(issue_id))
                .single();
            if (error) {
            } else {
                return data;
            }
        }
        async function getComments() {
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

        if (!data) getIssues().then(setData); // enforce run once
        if (!comment_data) getComments().then(setCommentData); // enforce run once
    }, [data, comment_data, issue_id]);
    if (data && comment_data) {
        return (
            <div>
                <Navbar token={token} activeTab={""} />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: "1.5rem",
                    }}
                >
                    <div
                        style={{
                            "grid-column": "span 2",
                            padding: "1rem",
                        }}
                    ></div>
                    <GeminiModel report_input={data} comment_input={comment_data} />
                    <IssueFocusComp report={data} comments={comment_data} issue_id={issue_id} />
                    <div
                        style={{
                            "grid-column": "span 2",
                            padding: "1rem",
                        }}
                    ></div>
                </div>
            </div>
        );
    }
}

// function loolIssueFocus({ token }) {
//     const { issue_id } = useParams();
//     const navigate = useNavigate();
//     const recaptchaRef = useRef();
//     const onSubmitWithReCAPTCHA = async () => {
//         const token = await recaptchaRef.current.executeAsync();
//         // apply to form data
//     };
//     const [data, setData] = useState();
//     const [comment_data, setCommentData] = useState();
//     const [comment, setComment] = useState();
//     const table = [];
//     async function formSubmit(e) {
//         e.preventDefault();
//         const { data, error: user_error } = await supabase.auth.getUser();
//         if (user_error) {
//             // console.log(user_error);
//             return;
//         }
//         const { error } = await supabase
//             .from("comments")
//             .insert({
//                 issue_id: parseInt(issue_id),
//                 comment_text: comment,
//                 user_id: data.user.id,
//             })
//             .single();
//         if (error) {
//             alert("Error posting comment, please try again later.");
//             console.log(error);
//         } else {
//             alert("Comment Sent");
//             window.location.reload();
//         }
//     }
//     useEffect(() => {
//         async function getIssues() {
//             const { data, error } = await supabase
//                 .from("issues")
//                 .select("*, users(username)")
//                 .eq("issue_id", parseInt(issue_id))
//                 .single();
//             if (error) {
//             } else {
//                 return data;
//             }
//         }
//         async function getComments() {
//             const { data, error } = await supabase
//                 .from("comments")
//                 .select("*, users(username)")
//                 .eq("issue_id", parseInt(issue_id));
//             if (error) {
//                 console.log(error);
//             } else {
//                 return data;
//             }
//         }

//         if (!data) getIssues().then(setData); // enforce run once
//         if (!comment_data) getComments().then(setCommentData); // enforce run once
//     }, [data, comment_data, issue_id]);
//     if (data && comment_data) {
//         return (
//             <div>
//             <Navbar token={token} activeTab={""}/>
//                 <h2>{data.issue_subject}</h2>
//                 {data.issue_body}
//                 <br />
//                 Category: {data.issue_category}
//                 <br />
//                 Status: {data.issue_state}
//                 <br />
//                 Author: {data?.users?.username ? data.users.username : "Anonymous User"}
//                 <br />
//                 <br />
//                 Comments
//                 <br />
//                 {comment_data.map((item, index) => {
//                     return <Comment comment={item} />;
//                 })}
//                 <br />
//                 <form onSubmit={formSubmit}>
//                     Comment:
//                     <br />
//                     <textarea
//                         name="Comment"
//                         type={"text"}
//                         value={comment}
//                         required
//                         placeholder="Comment"
//                         onChange={(event) => setComment(event.target.value)}
//                     />
//                     <button type="submit">Submit</button>
//                 </form>
//                 <Link to="/">
//                     <button>Issues</button>
//                 </Link>
//             </div>
//         );
//     } else {
//         return <div></div>;
//     }
// }

// // export default IssueFocus;
