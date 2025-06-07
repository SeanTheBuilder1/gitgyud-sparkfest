"use client";
import "./issuelist.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function IssueAndVolunteerList({ reports, onReportClick, volunteers, selected_id, setSelectedId }) {
    const [activeTab, setActiveTab] = useState(true);
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
        }
    }, [reports, selected_id]);
    return (
        <div
            style={{
                "grid-column": "span 6",
                padding: "1rem",
            }}
        >
            <div className="tabs-list">
                <button
                    className={`tab-trigger ${activeTab === true ? "active" : ""}`}
                    onClick={() => setActiveTab(true)}
                >
                    My Reports
                </button>
                <button
                    className={`tab-trigger ${activeTab === false ? "active" : ""}`}
                    onClick={() => setActiveTab(false)}
                >
                    My Volunteering
                </button>
            </div>
            {activeTab ? (
                <div>
                    <div className="reports-list">
                        <strong>
                            <h2>{activeTab ? "My Reports" : "Volunteering"}</h2>
                        </strong>

                        {reports?.length !== 0 ? (
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
                                            {report.sus ? (
                                                <span className={`report-status status-closed`}>Suspicious</span>
                                            ) : (
                                                ""
                                            )}
                                            {report.volunteering ? (
                                                <span className={`report-status status-resolved`}>Volunteering</span>
                                            ) : (
                                                ""
                                            )}
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-reports">No reports found</div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="reports-list">
                        <strong>
                            <h2>{activeTab ? "My Reports" : "Volunteering"}</h2>
                        </strong>

                        {volunteers?.length === 0 ? (
                            <div className="reports-container">
                                {reports.map((volunteer, index) => (
                                    <div
                                        key={volunteer.issue.issue_id}
                                        className={`report-card`}
                                        onClick={() => setSelectedId(volunteer.issue.issue_id)}
                                    >
                                        <div className="report-header">
                                            <span className="report-number">{index + 1}</span>
                                            <Link to={"/issues/".concat(volunteer.issue.issue_id)}>
                                                <h3 className="report-title subject-link">
                                                    {volunteer.issue.issue_subject}
                                                </h3>
                                            </Link>
                                            <span
                                                className={`report-status ${getStateClass(volunteer.issue.issue_state)}`}
                                            >
                                                {getStateFormal(volunteer.issue.issue_state)}{" "}
                                            </span>
                                        </div>

                                        <div className="report-content">
                                            <p className="report-type-location">
                                                {volunteer.issue.issue_category} •{" "}
                                                {volunteer?.barangay_lookup_table
                                                    ? volunteer.barangay_lookup_table.barangay_name
                                                    : "Unspecified Barangay"}
                                            </p>
                                            <p className="report-description">
                                                {volunteer?.users ? volunteer.users.username : "Anonymous User"}
                                            </p>

                                            <div className="report-meta">
                                                <span className="report-timestamp">{volunteer.created_at}</span>
                                                <span className="report-district">
                                                    District{" "}
                                                    {volunteer?.barangay_lookup_table
                                                        ? volunteer.barangay_lookup_table.district
                                                        : "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-reports">No volunteering work yet</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
