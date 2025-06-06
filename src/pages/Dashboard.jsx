import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import IssueList from "../components/IssueList";
import IssuePreview from "../components/IssuePreview";
import AuthPanel from "../components/AuthPanel";
import PostPanel from "../components/PostPanel";
import ReCAPTCHA from "react-google-recaptcha";
import FilterPanel from "../components/FilterPanel";
const recaptchaRef = createRef();

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

function Checkbox({ label, value, setCheckboxFilter }) {
    function handleCheck(label, value) {
        setCheckboxFilter((prev) => ({
            ...prev,
            [label]: value,
        }));
    }
    return (
        <>
            <br />
            {label}
            <input checked={value} onChange={(event) => handleCheck(label, event.target.checked)} type="checkbox" />
        </>
    );
}

function Dashboard({ token, loadSupabaseUser }) {
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [auth_open, setAuthOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [post_open, setPostOpen] = useState(false);
    const [data, setData] = useState();
    const [filter, setFilter] = useState({
        status: {
            open: true,
            closed: false,
            resolved: false,
        },
        category: {
            Infrastructure: true,
            Health: true,
            Sanitation: true,
            Safety: true,
            Transportation: true,
            Utilities: true,
            Environment: true,
            Government: true,
            Others: true,
        },
        district: 0,
        update_barangays: true,
        barangays: {},
    });
    const [selected_id, setSelectedId] = useState(0);
    const table = [];
    async function getIssues() {
        const { data, error } = await supabase.from("issues").select("*, users(username)").eq("issue_state", "open");
        if (error) {
        } else {
            return data;
        }
    }
    useEffect(() => {
        async function getData() {
            const district = parseInt(filter.district);
            let query = supabase.from("issues");
            if (district !== 0) {
                query = query
                    .select("*, users(username), barangay_lookup_table!inner(district, barangay_name)")
                    .eq("barangay_lookup_table.district", district);
                if (filter.update_barangays) {
                    const { data: barangay_data, error: barangay_error } = await supabase
                        .from("barangay_lookup_table")
                        .select("barangay_name, barangay_id")
                        .eq("district", district);
                    if (barangay_error) {
                        setFilter((prev) => ({
                            ...prev,
                            barangays: {},
                            update_barangays: false,
                        }));
                    } else {
                        const sorted_barangay = Object.fromEntries(
                            barangay_data
                                .sort((a, b) => (a.barangay_id > b.barangay_id ? 1 : -1))
                                .map((a) => [a.barangay_name, true]),
                        );
                        setFilter((prev) => ({
                            ...prev,
                            barangays: sorted_barangay,
                            update_barangays: false,
                        }));
                    }
                }
                let barangay_filter_list = [];
                Object.entries(filter.barangays).forEach(([key, value]) => {
                    if (value) {
                        barangay_filter_list.push(key);
                    }
                });
                query = query.in("barangay_lookup_table.barangay_name", barangay_filter_list);
            } else {
                query = query.select("*, users(username), barangay_lookup_table(district, barangay_name)");
            }
            query = query.eq("user_id", token.id);
            let issue_filter_list = [];
            if (filter.status.open) {
                issue_filter_list.push("open");
            }
            if (filter.status.closed) {
                issue_filter_list.push("closed");
            }
            if (filter.status.resolved) {
                issue_filter_list.push("resolved");
            }
            query = query.in("issue_state", issue_filter_list);
            let category_filter_list = [];
            Object.entries(filter.category).forEach(([key, value]) => {
                if (value) {
                    category_filter_list.push(key);
                }
            });
            query = query.in("issue_category", category_filter_list);

            const { data, error } = await query;
            if (error) {
                console.log(error);
            } else {
                setData(data);
            }
        }
        getData();
    }, [filter, token]);
    if (data) {
        return (
            <div>
                <Navbar token={token} activeTab={"dashboard"} />
                <div
                    style={{
                        "padding-top": "1.5rem",
                        "padding-bottom": "1.5rem",
                        "padding-left": "1rem",
                        "padding-right": "1rem",
                        "max-width": "100%",
                        "margin-left": "auto",
                        "margin-right": "auto",
                    }}
                >
                    <div
                        style={{
                            "justify-content": "space-between",
                            "align-items": "center",
                            display: "flex",
                            "box-sizing": "border-box",
                            border: "0 solid #e5e7eb",
                        }}
                    >
                        <big>
                            <strong>
                                <h1>Dashboard</h1>
                            </strong>
                        </big>
                        <span>
                            <button
                                onClick={() => {
                                    setPostOpen(true);
                                }}
                                style={{
                                    padding: "0.5rem",
                                    "background-color": "#000000",
                                    color: "#ffffff",
                                    "border-radius": "10%",
                                    display: "flex",
                                    "justify-content": "center",
                                    "align-items": "center",
                                }}
                            >
                                + Add Report
                            </button>
                        </span>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(12, 1fr)",
                            gap: "1.5rem",
                        }}
                    >
                        <FilterPanel filter={filter} setFilter={setFilter} />
                        <IssueList
                            reports={data}
                            selected_id={selected_id}
                            setSelectedId={setSelectedId}
                            list_label={"My Reports"}
                        />
                        <IssuePreview report={data.find((e) => e.issue_id === selected_id)} />
                    </div>
                </div>
                {auth_open && (
                    <AuthPanel
                        open={auth_open}
                        onOpenChange={setAuthOpen}
                        isLogin={isLogin}
                        loadSupabaseUser={loadSupabaseUser}
                    />
                )}

                {token
                    ? post_open && <PostPanel open={post_open} onOpenChange={setPostOpen} />
                    : post_open && (
                          <AuthPanel
                              open={post_open}
                              onOpenChange={setPostOpen}
                              isLogin={isLogin}
                              loadSupabaseUser={loadSupabaseUser}
                          />
                      )}
            </div>
        );
    }
}

export default Dashboard;
