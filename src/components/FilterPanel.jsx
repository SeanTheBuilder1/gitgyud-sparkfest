import { useState } from "react";
import "./filterpanel.css";

function FilterPanel({ activeTab = "dashboard", filter, setFilter }) {
    function handleStatusCheck(label, value) {
        setFilter((prev) => ({
            ...prev,
            status: {
                ...prev.status,
                [label]: value,
            },
        }));
        console.log(filter);
    }
    function handleCategoryCheck(label, value) {
        setFilter((prev) => ({
            ...prev,
            category: {
                ...prev.category,
                [label]: value,
            },
        }));
    }
    function handleBarangayCheck(label, value) {
        setFilter((prev) => ({
            ...prev,

            barangays: { ...prev.barangays, [label]: value },
        }));
    }
    function handleDistrictSelect(value) {
        setFilter((prev) => ({
            ...prev,
            district: value,
            update_barangays: true,
        }));
        
    }
    function handleUnselectAll(){
        setFilter((prev) => ({
            ...prev,
            barangays:  Object.fromEntries(Object.entries(prev.barangays).map(([key])=>[key, false])),
        }));
        console.log(filter.barangays);
    }
    function handleSelectAll(){
        setFilter((prev) => ({
            ...prev,
            barangays:  Object.fromEntries(Object.entries(prev.barangays).map(([key])=>[key, true])),
        }));
    }
    return (
        <div className="filter-panel">
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span>Filter</span>
                    </div>
                </div>
                <div className="card-content">
                    <div className="filter-section">
                        {/* Status */}
                        <div>
                            <label className="label">Status</label>
                            <div className="checkbox-group">
                                <label key={"open_checkbox"} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filter.status.open}
                                        onChange={(event) => handleStatusCheck("open", event.target.checked)}
                                    />
                                    <span>{"Open"}</span>
                                </label>
                                <label key={"closed_checkbox"} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filter.status.closed}
                                        onChange={(event) => handleStatusCheck("closed", event.target.checked)}
                                    />
                                    <span>{"Closed"}</span>
                                </label>
                                <label key={"resolved_checkbox"} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filter.status.resolved}
                                        onChange={(event) => handleStatusCheck("resolved", event.target.checked)}
                                    />
                                    <span>{"Resolved"}</span>
                                </label> 
                            </div>
                        </div>

                        <br />
                        <hr />
                        <br />

                        {/* Volunteers */}
                        {activeTab === "reports" && (
                            <>
                                <div>
                                    <label className="label">Volunteers</label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>Volunteers Needed</span>
                                        </label>
                                    </div>
                                </div>
                                <hr />
                            </>
                        )}

                        {/* Category */}
                        <div>
                            <label className="label">Category</label>
                            <div className="checkbox-group">
                                {Object.entries(filter.category).map(([key, value]) => (
                                    <label key={key} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(event) => handleCategoryCheck(key, event.target.checked)}
                                        />
                                        <span>{key}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <br />
                        <hr />
                        <br />

                        {/* Districts */}
                        <div>
                            <div style={{display:"grid"}}>
                                <select
                                    value={filter.district}
                                    onChange={(event) => handleDistrictSelect(event.target.value)}
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
                                    <br/>
                                {Object.values(filter.barangays).every((value) => !value) && filter.district !== 0 ? 
                             <button onClick={handleSelectAll}>Select All</button>
                            
                            :
                                <button onClick={handleUnselectAll}>Unselect All</button>
                            }
                                
                            </div>
                            
                            {parseInt(filter.district) !== 0 ? (
                                <div className="checkbox-group">
                                    {Object.entries(filter.barangays).map(([key, value]) => (
                                        <label key={key} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(event) => handleBarangayCheck(key, event.target.checked)}
                                            />
                                            <span>{key}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                ""
                            )}
                            {/* <label className="label">Districts</label>
                            <div className="checkbox-group">
                                {Object.entries(districts).map(([district, barangays]) => (
                                    <div key={district}>
                                        <div className="collapsible-trigger" onClick={() => toggleDistrict(district)}>
                                            {expandedDistricts.includes(district) ? ">" : "v"}
                                            <input type="checkbox" />
                                            <span>{district}</span>
                                        </div>
                                        {expandedDistricts.includes(district) && (
                                            <div className="collapsible-content">
                                                {barangays.map((barangay) => (
                                                    <label key={barangay} className="checkbox-label nested">
                                                        <input type="checkbox" />
                                                        <span>{barangay}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div> */}
                        </div>

                        <hr />

                        {/* Date */}
                        {/* <div>
                            <label className="label">Date</label>
                            <div className="checkbox-group">
                                {["Last 24 hours", "Last Week", "Last Month", "Last Year"].map((label) => (
                                    <label key={label} className="checkbox-label">
                                        <input type="checkbox" />
                                        <span>{label}</span>
                                    </label>
                                ))}
                                <div className="date-input">
                                    <label className="sub-label">Specific Date</label>
                                    <input
                                        type="date"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;
