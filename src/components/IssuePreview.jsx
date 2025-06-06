import { useState } from "react";
import "./issuepreview.css";

export default function IssuePreview({ report, isAdmin }) {
    const [volunteersNeeded, setVolunteersNeeded] = useState(report?.volunteersNeeded || false);

    const handleVolunteerToggle = () => {
        if (isAdmin) {
            setVolunteersNeeded(!volunteersNeeded);
        }
    };

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
            "grid-column": "span 4",
            padding: "1rem",
        }}
    >
        {report ? (
        <div className="report-detail">
            <h2>Report Details</h2>

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
                <p style={{"text-wrap": "wrap"}}>{report.issue_body}</p>
            </div>

            <div className="detail-meta">
                <div className="meta-item">
                    <span className="meta-label">Reported by:</span>
                    <span className="meta-value">{report?.users ? report.users.username : "Anonymous User"}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Time:</span>
                    <span className="meta-value">{report.created_at}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">District:</span>
                    <span className="meta-value">
                        {report?.barangay_lookup_table ? report.barangay_lookup_table.district : "District Unknown"}
                    </span>
                </div>
                {/* <div className="meta-item">
                    <span className="meta-label">Comments:</span>
                    <span className="meta-value">{report.commentsCount}</span>
                </div> */}
            </div>

            <div className="detail-actions">
                <button className="action-button comment-button">View Comments</button>

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
        ) : (<div className="report-detail empty">Select a report to view details</div>)}
    </div>);
}
