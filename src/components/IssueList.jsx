"use client";
import "./issuelist.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function IssueList({ reports, onReportClick }) {
    const [selected_id, setSelectedId] = useState(0);
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
    useEffect(() => {
        if (selected_id == 0) {
            return;
        }
        if (!reports.find((e) => e.issue_id === selected_id)) {
            setSelectedId(0);
            console.log("hello", selected_id, Object.entries(reports));
        }
    }, [reports, selected_id]);
    return (
        <div className="reports-list">
            <h2>My Reports</h2>

            {reports.length === 0 ? (
                <div className="no-reports">No reports found</div>
            ) : (
                <div className="reports-container">
                    {reports.map((report, index) => (
                        <div
                            key={report.issue_id}
                            className={`report-card ${selected_id === report.issue_id ? "selected" : ""}`}
                            onClick={() => setSelectedId(report.issue_id)}
                        >
                            <div className="report-header">
                                <span className="report-number">{index + 1}</span>
                                <Link to={"/issues/".concat(report.issue_id)}>
                                    <h3 className="report-title subject-link">{report.issue_subject}</h3>
                                </Link>
                                <span className={`report-status ${getStateClass(report.issue_state)}`}>
                                    {getStateFormal(report.issue_state)}{" "}
                                </span>
                            </div>

                            <div className="report-content">
                                <p className="report-type-location">
                                    {report.issue_category} •{" "}
                                    {report?.barangay_lookup_table
                                        ? report.barangay_lookup_table.barangay_name
                                        : "Unspecified Barangay"}
                                </p>
                                <p className="report-description">
                                    {report?.users ? report.users.username : "Anonymous User"}
                                </p>

                                <div className="report-meta">
                                    <span className="report-timestamp">{report.created_at}</span>
                                    <span className="report-district">
                                        District{" "}
                                        {report?.barangay_lookup_table
                                            ? report.barangay_lookup_table.district
                                            : "Unknown"}
                                    </span>
                                    {/* <span className="report-comments">Comments: {report.commentsCount}</span> */}
                                </div>

                                {/* {report.volunteersNeeded && (
                  <div className="volunteers-needed">Volunteers Needed ({report.volunteersCount})</div>
                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
