import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ApiKeyInput from "./ApiKeyInput";
import MouserIcon from "./assets/images/mouser.svg";
import DigikeyIcon from "./assets/images/digikey.svg";
import {
    GetApiPriority,
    SetApiPriority,
    TestMouserAPIKey,
    TestDKCredentials,
    TestBOMulusAPIKey,
    GetSavedAPIKeys,
    SetAnalyzeSaveState,
    GetAnalyzeSaveState,
    GetAnalysisRefreshDays,
    SetAnalysisRefreshDays,
} from "../wailsjs/go/main/App";
import "./Settings.css";

const ItemTypes = { API: "api" };

const supplierIcons = {
    Mouser: MouserIcon,
    Digikey: DigikeyIcon,
};

const DraggableItem = ({ api, index, moveItem }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.API,
        item: { index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.API,
        hover(item) {
            if (item.index !== index) {
                moveItem(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="priority-item"
            style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ddd",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                opacity: isDragging ? 0.5 : 1,
                cursor: isDragging ? "grabbing" : "grab",
            }}
        >
            <img
                src={supplierIcons[api]}
                alt={`${api} icon`}
                style={{ width: "20px", marginRight: "10px" }}
            />
            {api}
        </div>
    );
};

function Settings() {
    const [apiPriority, setApiPriority] = useState([]);
    const [apiKeys, setApiKeys] = useState({
        mouser: "",
        dkClientID: "",
        dkSecret: "",
        bomulus: "",
    });
    const [statuses, setStatuses] = useState({
        mouser: "",
        dk: "",
        bomulus: "",
    });
    const [errors, setErrors] = useState({
        mouser: "",
        dk: "",
        bomulus: "",
    });
    const [isTesting, setIsTesting] = useState({
        mouser: false,
        dk: false,
        bomulus: false,
    });
    const [analyzeSaveState, setAnalyzeSaveState] = useState(false);
    const [analysisRefreshDays, setAnalysisRefreshDays] = useState(0);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        await Promise.all([
            loadSavedAPIKeys(),
            loadAnalyzeSaveState(),
            loadAnalysisRefreshDays(),
            loadApiPriority(),
        ]);
    };

    const loadApiPriority = async () => {
        try {
            const priority = await GetApiPriority();
            setApiPriority(priority || []);
        } catch (error) {
            console.error("Error loading API priority:", error);
        }
    };

    const handleApiPriorityChange = async (newPriority) => {
        setApiPriority(newPriority);
        try {
            await SetApiPriority(newPriority);
        } catch (error) {
            console.error("Error saving API priority:", error);
        }
    };

    const moveItem = (fromIndex, toIndex) => {
        const updated = Array.from(apiPriority);
        const [movedItem] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedItem);
        setApiPriority(updated);
        handleApiPriorityChange(updated);
    };

    const loadSavedAPIKeys = async () => {
        try {
            const saved = await GetSavedAPIKeys();
            setApiKeys({
                mouser: saved.mouser_api_key || "",
                dkClientID: saved.dk_client_id || "",
                dkSecret: saved.dk_secret || "",
                bomulus: saved.bomulus_api_key || "",
            });
        } catch (error) {
            console.error("Error loading saved API keys:", error);
        }
    };

    const loadAnalyzeSaveState = async () => {
        try {
            const state = await GetAnalyzeSaveState();
            setAnalyzeSaveState(state);
        } catch (error) {
            console.error("Error loading analyze save state:", error);
        }
    };

    const loadAnalysisRefreshDays = async () => {
        try {
            const days = await GetAnalysisRefreshDays();
            setAnalysisRefreshDays(days);
        } catch (error) {
            console.error("Error loading analysis refresh days:", error);
        }
    };

    const handleAnalyzeSaveStateChange = async (e) => {
        const newState = e.target.checked;
        setAnalyzeSaveState(newState);
        try {
            await SetAnalyzeSaveState(newState);
        } catch (error) {
            console.error("Error updating analyze save state:", error);
            setAnalyzeSaveState((prev) => !prev);
        }
    };

    const handleAnalysisRefreshDaysChange = async (e) => {
        const days = parseInt(e.target.value, 10);
        if (isNaN(days) || days < 0) return;
        setAnalysisRefreshDays(days);
        try {
            await SetAnalysisRefreshDays(days);
        } catch (error) {
            console.error("Error updating analysis refresh days:", error);
        }
    };

    const handleInputChange = (key, value) => {
        setApiKeys((prev) => ({ ...prev, [key]: value }));
        // Clear previous messages for this key
        setStatuses((prev) => ({ ...prev, [key]: "" }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const testMouser = async () => {
        setIsTesting((prev) => ({ ...prev, mouser: true }));
        setStatuses((prev) => ({ ...prev, mouser: "" }));
        setErrors((prev) => ({ ...prev, mouser: "" }));
        try {
            const valid = await TestMouserAPIKey(apiKeys.mouser);
            setStatuses((prev) => ({
                ...prev,
                mouser: valid ? "Valid Key" : "Invalid Key",
            }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, mouser: error.toString() }));
        } finally {
            setIsTesting((prev) => ({ ...prev, mouser: false }));
        }
    };

    const testDk = async () => {
        setIsTesting((prev) => ({ ...prev, dk: true }));
        setStatuses((prev) => ({ ...prev, dk: "" }));
        setErrors((prev) => ({ ...prev, dk: "" }));
        try {
            const valid = await TestDKCredentials(apiKeys.dkClientID, apiKeys.dkSecret);
            setStatuses((prev) => ({
                ...prev,
                dk: valid ? "Valid Credentials" : "Invalid Credentials",
            }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, dk: error.toString() }));
        } finally {
            setIsTesting((prev) => ({ ...prev, dk: false }));
        }
    };

    const testBomulus = async () => {
        setIsTesting((prev) => ({ ...prev, bomulus: true }));
        setStatuses((prev) => ({ ...prev, bomulus: "" }));
        setErrors((prev) => ({ ...prev, bomulus: "" }));
        try {
            const valid = await TestBOMulusAPIKey(apiKeys.bomulus);
            setStatuses((prev) => ({
                ...prev,
                bomulus: valid ? "Valid Key" : "Invalid Key",
            }));
        } catch (error) {
            setErrors((prev) => ({ ...prev, bomulus: error.toString() }));
        } finally {
            setIsTesting((prev) => ({ ...prev, bomulus: false }));
        }
    };

    return (
        <div className="settings-container">
            <section className="api-keys-section">
                <h2>API Keys</h2>
                <ApiKeyInput
                    id="mouserApiKey"
                    label="Mouser API Key"
                    value={apiKeys.mouser}
                    onChange={(e) => handleInputChange("mouser", e.target.value)}
                    onTest={testMouser}
                    isTesting={isTesting.mouser}
                    status={statuses.mouser}
                    error={errors.mouser}
                />
                <ApiKeyInput
                    id="dkCredentials"
                    label="DigiKey API Credentials"
                    value={apiKeys.dkClientID}
                    onChange={(e) => handleInputChange("dkClientID", e.target.value)}
                    clientSecret={apiKeys.dkSecret}
                    onClientSecretChange={(e) => handleInputChange("dkSecret", e.target.value)}
                    onTest={testDk}
                    isTesting={isTesting.dk}
                    status={statuses.dk}
                    error={errors.dk}
                    isCredentials={true}
                />
                <ApiKeyInput
                    id="bomulusApiKey"
                    label="BOMulus API Key"
                    value={apiKeys.bomulus}
                    onChange={(e) => handleInputChange("bomulus", e.target.value)}
                    onTest={testBomulus}
                    isTesting={isTesting.bomulus}
                    status={statuses.bomulus}
                    error={errors.bomulus}
                />
            </section>

            <section className="api-priority-section">
                <h2>API Priority</h2>
                <DndProvider backend={HTML5Backend}>
                    {apiPriority.map((api, index) => (
                        <DraggableItem key={api} api={api} index={index} moveItem={moveItem} />
                    ))}
                </DndProvider>
            </section>

            <section className="analysis-settings-section">
                <h2>Analysis Settings</h2>
                <div className="checkbox-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={analyzeSaveState}
                            onChange={handleAnalyzeSaveStateChange}
                        />
                        Save Analysis State
                    </label>
                </div>
                <div className="refresh-days-container">
                    <input
                        id="analysisRefreshDays"
                        type="number"
                        value={analysisRefreshDays}
                        onChange={handleAnalysisRefreshDaysChange}
                        min="0"
                        className="input-number"
                    />
                    <label htmlFor="analysisRefreshDays"> Days before refresh</label>
                </div>
            </section>
        </div>
    );
}

export default Settings;
