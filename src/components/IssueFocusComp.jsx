import { useState } from "react";
import "./issuepreview.css";
import supabase from "../supabase-client";

function Comment({ comment }) {
    if (comment?.users?.username) {
        return (
            <>
                <div
                    style={{
                        "background-color": "#f9f9f9",
                        "border-radius": "6px",
                        padding: "15px",
                        "margin-bottom": "5px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <div className="meta-item">
                        <span className="meta-label">{comment.users.username}</span>
                        <span className="meta-value">
                            <p style={{ "text-wrap": "wrap", "overflow-wrap": "break-word" }}>{comment.comment_text}</p>
                        </span>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    style={{
                        "background-color": "#f9f9f9",
                        "border-radius": "6px",
                        padding: "15px",
                        "margin-bottom": "5px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <div className="meta-item">
                        <span className="meta-label">Anonymous User</span>
                        <span className="meta-value">
                            <p style={{ "text-wrap": "wrap", "overflow-wrap": "break-word" }}>{comment.comment_text}</p>
                        </span>
                    </div>
                </div>
            </>
        );
    }
    return;
}

export default function IssueFocusComp({ report, comments, isAdmin, issue_id }) {
    const [volunteersNeeded, setVolunteersNeeded] = useState(report?.volunteersNeeded || false);
    const [comment, setComment] = useState("");
    const handleVolunteerToggle = () => {
        if (isAdmin) {
            setVolunteersNeeded(!volunteersNeeded);
        }
    };
    async function handlePost(e) {
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
    if (!report) {
    }

    const getStateClass = (status) => {
        switch (status) {
            case "open":
                return "status-open";
            case "resolved":
                return "status-resolved";
            case "closed":
                return "status-closed";
            default:
                return "status-open";
        }
    };
    const getStateFormal = (status) => {
        switch (status) {
            case "open":
                return "Open";
            case "resolved":
                return "Resolved";
            case "closed":
                return "Closed";
            default:
                return "ERROR";
        }
    };
    return (
        <div
            style={{
                "grid-column": "span 6",
                padding: "1rem",
            }}
        >
            {report ? (
                <div className="report-detail">
                    <div className="detail-header">
                        <h3>{report.issue_subject}</h3>
                        <span className={`detail-status ${getStateClass(report.issue_state)}`}>
                            {getStateFormal(report.issue_state)}
                        </span>
                    </div>

                    {/* <div className="detail-location">
                <span className="location-icon">📍</span>
                {report.location}
            </div> */}

                    {/* {report.images && report.images.length > 0 && (
                <div className="detail-images">
                    {report.images.map((image, index) => (
                        <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Report image ${index + 1}`}
                            className="detail-image"
                        />
                    ))}
                </div>
            )} */}

                    <div className="detail-section">
                        <h4>Description</h4>
                        <p style={{ "text-wrap": "wrap", "overflow-wrap": "break-word" }}>{report.issue_body}</p>
                    </div>
                    {report.image_public_url ? (
                        <img
                            style={{
                                width: "20rem",
                                "object-fit": "scale-down",
                            }}
                            src={report.image_public_url}
                        />
                    ) : (
                        ""
                    )}
                    <div className="detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Reported by:</span>
                            <span className="meta-value">
                                {report?.users ? report.users.username : "Anonymous User"}
                            </span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Time:</span>
                            <span className="meta-value">{report.created_at}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">District:</span>
                            <span className="meta-value">
                                {report?.barangay_lookup_table
                                    ? report.barangay_lookup_table.district
                                    : "District Unknown"}
                            </span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Barangay:</span>
                            <span className="meta-value">
                                {report?.barangay_lookup_table
                                    ? report.barangay_lookup_table.barangay_name
                                    : "Unspecified Barangay"}
                            </span>
                        </div>
                    </div>

                    {/* {isAdmin ? (
                    <div className="volunteer-toggle">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={volunteersNeeded}
                                onChange={handleVolunteerToggle}
                                className="toggle-checkbox"
                            />
                            <span className="toggle-text">This issue needs community volunteers</span>
                        </label>
                    </div>
                ) : volunteersNeeded ? (
                    <button className="action-button volunteer-button">Volunteer ({report.volunteersCount})</button>
                ) : null} */}
                </div>
            ) : (
                <div className="report-detail empty">Select a report to view details</div>
            )}
            <br />
            <div className="report-detail">
                <div className="detail-header">
                    <h3>Comments</h3>
                </div>
                <div></div>
                {Object.entries(comments).map(([key, value]) => (
                    <Comment comment={value} />
                ))}
                <div style={{ display: "flex" }}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "0.625rem",
                            border: "1px solid #d1d5db",
                            "border-radius": "0.375rem",
                            "font-size": "0.875rem",
                            transition: "border-color 0.2s ease",
                        }}
                    ></textarea>
                </div>
                <div style={{ display: "flex" }} className="detail-actions">
                    <form onSubmit={handlePost}>
                        <button type="submit" className="action-button comment-button">
                            Send Comment
                        </button>
                    </form>

                    {/* {isAdmin ? (
                    <div className="volunteer-toggle">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={volunteersNeeded}
                                onChange={handleVolunteerToggle}
                                className="toggle-checkbox"
                            />
                            <span className="toggle-text">This issue needs community volunteers</span>
                        </label>
                    </div>
                ) : volunteersNeeded ? (
                    <button className="action-button volunteer-button">Volunteer ({report.volunteersCount})</button>
                ) : null} */}
                </div>
            </div>
        </div>
    );
}
