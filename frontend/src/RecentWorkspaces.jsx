import React, { useState, useEffect } from "react";
import { GetRecentWorkspaces, SetActiveWorkspace, DeleteWorkspace } from "../wailsjs/go/main/App";
import ListIcon from "./assets/images/list.svg";
import Modal from "./Modal";
import Button from "./Button";
function RecentWorkspaces({ handleToggleCompareView }) {
    const [recentWorkspaces, setRecentWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

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

    const handleWorkspaceClick = async (workspace) => {
        try {
            await SetActiveWorkspace(workspace.workspace_infos.path);
            handleToggleCompareView();
        } catch (error) {
            console.error("Error setting active workspace:", error);
        }
    };

    const openDeleteModal = (workspace) => {
        setWorkspaceToDelete(workspace);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setWorkspaceToDelete(null);
        setIsModalOpen(false);
    };

    const handleWorkspaceDelete = async () => {
        if (!workspaceToDelete) return;

        try {
            await DeleteWorkspace(workspaceToDelete.workspace_infos.path);
        } catch (error) {
            console.error("Error deleting workspace:", error);
        }
        setWorkspaceToDelete(null);
        setIsModalOpen(false);
        loadRecentWorkspaces();
    };

    return (
        <>
            {recentWorkspaces.map((workspace, index) => (
                <div
                    key={index}
                    className="workspace-item light"
                    onClick={() => handleWorkspaceClick(workspace)}
                >
                    {/* Bouton de suppression */}
                    <button
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Empêche de déclencher le clic du bouton principal
                            openDeleteModal(workspace);
                        }}
                    >
                        x
                    </button>
                    {/* Icône et nom */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                        <div className="icon"><img src={ListIcon} alt="List Icon" className="icon" /></div>
                        <span style={{ textAlign: "center", wordBreak: "break-word" }}>{workspace.workspace_infos.name}</span>
                    </div>
                </div>
            ))}
            {/* Modal de confirmation */}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <div>
                        <h3>Confirmation de suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer le projet <strong>{workspaceToDelete?.workspace_infos.name}</strong> ?</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                            <Button onClick={closeModal} className="modal-button">
                                Annuler
                            </Button>
                            <Button
                                onClick={handleWorkspaceDelete}
                                style={{ backgroundColor: "#cc7481", color: "white" }}
                                className="modal-button"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );

}

export default RecentWorkspaces;
