// RecentWorkspaces.js
import React, { useState, useEffect } from 'react';
import { GetRecentWorkspaces } from '../wailsjs/go/main/App';
import Button from './Button';

function RecentWorkspaces() {
    const [recentWorkspaces, setRecentWorkspaces] = useState([]);

    useEffect(() => {
        loadRecentWorkspaces();
    }, []);

    const loadRecentWorkspaces = async () => {
        try {
            const workspaces = await GetRecentWorkspaces();
            setRecentWorkspaces(workspaces);
        } catch (error) {
            console.error("Failed to load recent workspaces:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div>
            {recentWorkspaces.map((workspace, index) => (
                <Button>☰ {workspace.workspace_infos.name}</Button>
            ))}
        </div>
    );
}

export default RecentWorkspaces;
