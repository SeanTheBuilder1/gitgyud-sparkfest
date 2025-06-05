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
    const [open_filter, setOpenFilter] = useState(true);
    const [closed_filter, setClosedFilter] = useState(false);
    const [resolved_filter, setResolvedFilter] = useState(false);
    const [category_filter, setCategoryFilter] = useState({
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
    });
    const table = [];
    async function getIssues() {
        const { data, error } = await supabase.from("issues").select("*, users(username)").eq("issue_state", "open");
        if (error) {
        } else {
            return data;
        }
    }
    useEffect(() => {
        async function getData(district_value, open_filter, closed_filter, resolved_filter) {
            const district = parseInt(district_value);
            let query = supabase.from("issues").select("*, users(username), barangay_lookup_table!inner(district)");
            if (district !== 0) {
                query = query.eq("barangay_lookup_table.district", district);
            }
            let issue_filter_list = [];
            if (open_filter) {
                issue_filter_list.push("open");
            }
            if (closed_filter) {
                issue_filter_list.push("closed");
            }
            if (resolved_filter) {
                issue_filter_list.push("resolved");
            }
            query = query.in("issue_state", issue_filter_list);
            let category_filter_list = [];
            Object.entries(category_filter).forEach(([key, value]) => {
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
        getData(district, open_filter, closed_filter, resolved_filter);
    }, [district, open_filter, closed_filter, resolved_filter, category_filter]);
    if (data) {
        return (
            <div>
                <h1>Open Issues</h1>
                <select
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
                ))}
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
