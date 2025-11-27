import React from "react";
import withAuth from "../../components/protectedRoute/withAuth";

const GroupsPage = () => {
    return (
        <div style={{background: "#fff", padding: 16, borderRadius: 8}}>
            <h2>Groups</h2>
            <p>This is a placeholder Groups page. Add grouping UI or drag-and-drop here.</p>
        </div>
    );
};

export default withAuth(GroupsPage);
