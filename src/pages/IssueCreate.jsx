import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function IssueCreate({ token }) {
    const navigate = useNavigate();

    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [category, setCategory] = useState("Road");

    const recaptchaRef = useRef();

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    async function formSubmit(e) {
        e.preventDefault();
        const { data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            console.log(user_error);
            return;
        }
        const { error } = await supabase
            .from("issues")
            .insert({
                issue_state: "open",
                issue_category: category,
                issue_subject: subject,
                issue_body: body,
                user_id: anon ? null : data.user.id,
            })
            .single();
        if (error) {
            alert("Error posting issue, please try again later.");
            console.log(error);
        } else {
            alert("Post Successful");
            navigate("/");
        }
    }
    return (
        <div>
            <h1>Issue Form</h1>
            <form onSubmit={formSubmit}>
                <input
                    name="Subject"
                    type={"text"}
                    value={subject}
                    required
                    placeholder="Subject"
                    onChange={(event) => setSubject(event.target.value)}
                />
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    name="Category"
                    id="category"
                >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Health">Health</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Safety">Safety</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Environment">Environment</option>
                    <option value="Government">Governmental</option>
                    <option value="Others">Others</option>
                </select>
                <br />
                <textarea
                    name="Body"
                    type={"text"}
                    value={body}
                    required
                    placeholder="Body"
                    onChange={(event) => setBody(event.target.value)}
                />
                <br />
                <button type="submit">Submit Issue</button>
                <input value={anon} onChange={(event) => setAnon(event.target.checked)} type="checkbox" />
                Post as Anonymous User
                <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} />
            </form>
            <Link to="/">
                <button>Cancel</button>
            </Link>
        </div>
    );
}

export default IssueCreate;
