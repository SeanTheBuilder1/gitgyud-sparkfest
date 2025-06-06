import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import IssueList from "../components/IssueList";
import ReCAPTCHA from "react-google-recaptcha";
import FilterPanel from "../components/FilterPanel";
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

function Preview({ token }) {
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
        // apply to form data
    };
    const [data, setData] = useState();
    const [district, setDistrict] = useState(0);
    const [filter, setFilter] = useState({
        status: {
            open: true,
            closed: false,
            resolved: false,
        },
        category: {
            Road: true,
            Sanitation: true,
            Parks: true,
            Utilities: true,
            Neighbor: true,
            Property: true,
            Safety: true,
            Transportation: true,
            Animals: true,
            Environment: true,
            Governmental: true,
            Others: true,
        },
        district: 0,
        update_barangays: true,
        barangays: {},
    });
    const [open_filter, setOpenFilter] = useState(true);
    const [closed_filter, setClosedFilter] = useState(false);
    const [resolved_filter, setResolvedFilter] = useState(false);
    const [category_filter, setCategoryFilter] = useState({});
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
            } else {
                query = query.select("*, users(username), barangay_lookup_table(district, barangay_name)");
                let barangay_filter_list = [];
                Object.entries(filter.barangays).forEach(([key, value]) => {
                    if (value) {
                        barangay_filter_list.push(key);
                    }
                });
                query = query.in("barangay_lookup_table.barangay_name", barangay_filter_list);
            }
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
    }, [filter]);
    if (data) {
        return (
            <div>
                <Navbar token={token} activeTab={"community"} />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: "1.5rem",
                    }}
                >
                    <FilterPanel filter={filter} setFilter={setFilter} />
                    <div
                        style={{
                            "grid-column": "span 6",
                            padding: "1rem",
                        }}
                    >
                        <IssueList reports={data} />
                        {/* <table>
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
                        </table> */}
                    </div>

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

                {/* <select
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    name="District"
                    id="district"
                >
                    <option value={0}>All Districts</option>
                    <option value={1}>District 1</option>
                    <option value={2}>District 2</option>
                    <option value={3}>District 3</option>
                    <option value={4}>District 4</option>
                    <option value={5}>District 5</option>
                    <option value={6}>District 6</option>
                </select>
                <br />
                Open
                <input
                    checked={open_filter}
                    onChange={(event) => setOpenFilter(event.target.checked)}
                    type="checkbox"
                />
                <br />
                Closed
                <input
                    checked={closed_filter}
                    onChange={(event) => setClosedFilter(event.target.checked)}
                    type="checkbox"
                />
                <br />
                Resolved
                <input
                    checked={resolved_filter}
                    onChange={(event) => setResolvedFilter(event.target.checked)}
                    type="checkbox"
                />
                {Object.entries(category_filter).map(([key, value]) => (
                    <Checkbox label={key} value={value} setCheckboxFilter={setCategoryFilter} />
                ))} */}
            </div>
        );
    }
}

export default Preview;
