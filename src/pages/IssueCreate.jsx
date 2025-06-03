import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef } from "react";
import Combobox from "react-widgets/Combobox";
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

function IssueCreate({ token }) {
    const navigate = useNavigate();

    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("Road");

    const recaptchaRef = useRef();

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    async function formSubmit(e) {
        e.preventDefault();
        const { error } = await supabase
            .from("issues")
            .insert({
                issue_state: "open",
                issue_category: category,
                issue_subject: subject,
                issue_body: body,
            })
            .single();
        if (error) {
            console.log(category);
            console.log(error);
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
                    <option value="Road">Road</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Parks">Parks</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Property">Property</option>
                    <option value="Safety">Safety</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Animals">Animals</option>
                    <option value="Environment">Environment</option>
                    <option value="Governmental">Governmental</option>
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
                <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} />
            </form>
            <Link to="/">Register</Link>
        </div>
    );
}

export default IssueCreate;
