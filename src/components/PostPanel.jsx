import { GoogleGenAI } from "@google/genai";
import { createRef, useEffect, useRef, useState } from "react";
import supabase from "../supabase-client";
import "./authpanel.css";
const recaptchaRef = createRef();

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function Selection({ items, item, setItem }) {}

export default function PostPanel({ open, onOpenChange, token }) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [category, setCategory] = useState("Infrastructure");
    const [district, setDistrict] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [barangay, setBarangay] = useState(1);
    const [files, setFiles] = useState();

    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    async function formSubmit(e) {
        async function GeminiModel(report_input) {
            let prompt_data = "Issue Subject: "
                .concat(report_input.issue_subject)
                .concat("Issue Body: ")
                .concat(report_input.issue_body)
                .concat("Issue Author: ");

            const response_gemini = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents:
                    "You are a moderator of an incident reporting program for public complaints in Quezon City, Philippines, rate this input by its suspiciousness or profanity (profanity scores more than suspiciousness) by 0.00 as least sus to 1.00 to the most sus and format your response like this and only like this {1.00} and then your rationale\\".concat(
                        prompt_data,
                    ),
            });
            const number = parseFloat(response_gemini.text.match(/-?\d+(\.\d+)?/)[0]);
            console.log(response_gemini.text);
            console.log(number);
            return number > 0.8;
        }
        e.preventDefault();
        const { data, error: user_error } = await supabase.auth.getUser();
        if (user_error) {
            console.log(user_error);
            return;
        }
        var full_path;
        var public_url;

        const initial_data = {
            issue_subject: subject,
            issue_body: body,
        };
        const is_sus = await GeminiModel(initial_data);
        if (is_sus) {
            alert("Your entry has been flagged as suspicious, the moderators have been notified");
        }
        console.log(is_sus);
        if (files) {
            const avatarFile = files[0];
            const filename = crypto.randomUUID().concat(".jpg");
            const { data: file_data, error: file_error } = await supabase.storage
                .from("commentimages")
                .upload(filename, avatarFile, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (file_error) {
                alert("Error uploading file\n", file_error);
                return;
            } else {
                full_path = file_data.path;
                const { data: url_data } = supabase.storage.from("commentimages").getPublicUrl(full_path);
                if (url_data) {
                    public_url = url_data.publicUrl;
                } else {
                    alert("Unable to get public URL");
                    return;
                }
            }
        }

        const { error } = await supabase
            .from("issues")
            .insert({
                issue_state: "open",
                issue_category: category,
                issue_subject: subject,
                issue_body: body,
                barangay_id: barangay,
                user_id: anon ? null : data.user.id,
                image_public_url: public_url,
                image_full_path: full_path,
                sus: is_sus,
            })
            .single();
        if (error) {
            alert("Error posting issue, please try again later.");
            console.log(error);
        } else {
            alert("Post Successful");
            onOpenChange(false);
        }
    }
    useEffect(() => {
        async function getData() {
            const { data: barangay_data, error: barangay_error } = await supabase
                .from("barangay_lookup_table")
                .select("barangay_name, barangay_id")
                .eq("district", parseInt(district));
            if (barangay_error) {
                setBarangays([]);
            } else {
                const sorted_barangay = barangay_data
                    .sort((a, b) => (a.barangay_id > b.barangay_id ? 1 : -1))
                    .map((a) => [a.barangay_name, a.barangay_id]);
                setBarangays(sorted_barangay);
                setBarangay(sorted_barangay[0][1]);
            }
        }
        getData();
    }, [district]);

    // async function loginFormSubmit(e) {
    //     e.preventDefault();
    //     try {
    //         const { data, error } = await supabase.auth.signInWithPassword({
    //             email: loginData.email,
    //             password: loginData.password,
    //         });
    //         if (error) throw error;
    //         console.log(data);
    //         loadSupabaseUser();
    //         if (!data.user.phone_confirmed_at) {
    //             // navigate("/phone-otp");
    //         } else {
    //         }
    //         onOpenChange(false);
    //     } catch (error) {
    //         alert(error);
    //     }
    // }

    // async function registerFormSubmit(e) {
    //     e.preventDefault();
    //     try {
    //         const { data, error } = await supabase.auth.signUp({
    //             email: registerData.email,
    //             password: registerData.password,
    //             options: {
    //                 data: {
    //                     username: registerData.name,
    //                 },
    //             },
    //         });
    //         if (error) throw error;
    //         console.log(data);
    //         alert("Check your email address and login for the first time afterwards");
    //         onOpenChange(false);
    //     } catch (error) {
    //         alert(error);
    //     }
    // }

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                {/* {step === "auth" && ( */}
                <>
                    <div className="modal-header">
                        <h2 className="modal-title">Create Report</h2>
                        {/* <p className="modal-description"></p> */}
                    </div>
                    <div className="modal-content">
                        <div className="tabs">
                            {/* <div className={`tab-content ${activeTab === true ? "active" : ""}`}> */}
                            <form onSubmit={formSubmit} className="form">
                                <div className="form-group">
                                    <label htmlFor="post-subject" className="form-label">
                                        Subject
                                    </label>
                                    <input
                                        id="post-subject"
                                        type="text"
                                        className="form-input"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="post-body" className="form-label">
                                        Body
                                    </label>
                                    <textarea
                                        id="login-body"
                                        type="text"
                                        className="form-input"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="tabs-list">
                                        <label htmlFor="post-category" className="form-label">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            style={{ cursor: "pointer" }}
                                            onChange={(event) => setCategory(event.target.value)}
                                            name="Category"
                                            id="post-category"
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
                                        <label htmlFor="post-district" className="form-label">
                                            District
                                        </label>

                                        <select
                                            value={district}
                                            style={{ cursor: "pointer" }}
                                            onChange={(event) => setDistrict(event.target.value)}
                                            name="District"
                                            id="post-district"
                                        >
                                            <option value={1}>District 1</option>
                                            <option value={2}>District 2</option>
                                            <option value={3}>District 3</option>
                                            <option value={4}>District 4</option>
                                            <option value={5}>District 5</option>
                                            <option value={6}>District 6</option>
                                            <option value={0}>None</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="tabs-list">
                                        <label htmlFor="post-barangay" className="form-label">
                                            Barangay
                                        </label>
                                        <select
                                            style={{ cursor: "pointer" }}
                                            value={barangay}
                                            onChange={(event) => setBarangay(event.target.value)}
                                            name="Barangay"
                                            id="post-barangay"
                                        >
                                            {barangays.map(([barangay_name, barangay_id]) => {
                                                return (
                                                    <option key={barangay_id} value={barangay_id}>
                                                        {barangay_name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <label htmlFor="post-barangay" className="form-label">
                                            <span>Post as an Anonymous User</span>
                                        </label>
                                        <input
                                            value={anon}
                                            onChange={(event) => setAnon(event.target.checked)}
                                            type="checkbox"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setFiles(e.target.files)}
                                    style={{ paddingBottom: "0.9rem", paddingTop: "0.0rem" }}
                                    className="button"
                                ></input>
                                <label htmlFor="data-privacy" className="form-label">
                                    I understand and consent to the provision of my information.
                                </label>
                                <input type="checkbox"></input>
                                <button type="submit" className="button button-primary button-full">
                                    Post
                                </button>
                            </form>
                            {/* </div> */}

                            {/* <div className={`tab-content ${activeTab === false ? "active" : ""}`}>
                                <form onSubmit={registerFormSubmit} className="form">
                                    <div className="form-group">
                                        <label htmlFor="signup-email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id="signup-email"
                                            type="email"
                                            className="form-input"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="name"
                                            className="form-input"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="signup-password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="signup-password"
                                            type="password"
                                            className="form-input"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirm-password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            className="form-input"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="button button-primary button-full">
                                        Continue
                                    </button>
                                </form>
                            </div> */}
                        </div>

                        <div className="modal-footer">
                            <button className="button button-ghost button-full" onClick={() => onOpenChange(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
                {/*}*/}

                {/* {step === "details" && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Complete Your Profile</h2>
                            <p className="modal-description">Tell us a bit more about yourself</p>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleDetailsSubmit} className="form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        className="form-input"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="form-input"
                                        placeholder="+63 917 123 4567"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                    />
                                    <p className="form-hint">
                                        Phone verification required to post reports. You can add this later.
                                    </p>
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="button button-outline"
                                        onClick={() => setStep("auth")}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        {registerData.phone ? "Verify Phone" : "Complete Signup"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Verify Your Phone</h2>
                            <p className="modal-description">We've sent a verification code to {registerData.phone}</p>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleOtpSubmit} className="form">
                                <div className="form-group">
                                    <label htmlFor="otp" className="form-label">
                                        Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        className="form-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="form-hint">For demo purposes, use: 123456</p>
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="button button-outline"
                                        onClick={() => setStep("details")}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        Verify & Complete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )} */}
            </div>
        </div>
    );
}
