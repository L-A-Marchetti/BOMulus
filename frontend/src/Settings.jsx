/*
 * Settings.jsx
 * 
 * Component for managing API keys and settings related to analysis.
 * Provides functionality to input and test API keys for Mouser and BOMulus,
 * configure the save state for analysis results, and set the number of days for refreshing analysis.
 *
 * Props: None
 *
 * States:
 * mouserApiKey: String representing the Mouser API key.
 * bomulusApiKey: String representing the BOMulus API key.
 * mouserApiStatus: String for displaying the status of the Mouser API key test.
 * bomulusApiStatus: String for displaying the status of the BOMulus API key test.
 * mouserError: String for storing any errors related to the Mouser API key.
 * bomulusError: String for storing any errors related to the BOMulus API key.
 * isTestingMouser: Boolean indicating if the Mouser API key is currently being tested.
 * isTestingBOMulus: Boolean indicating if the BOMulus API key is currently being tested.
 * analyzeSaveState: Boolean indicating if analysis results should be saved.
 * analysisRefreshDays: Number of days for refreshing analysis results.
 *
 * Backend Dependencies:
 * TestMouserAPIKey: Tests the provided Mouser API key.
 * TestBOMulusAPIKey: Tests the provided BOMulus API key.
 * GetSavedAPIKeys: Fetches saved API keys from storage.
 * SetAnalyzeSaveState: Saves the user's preference for saving analysis results.
 * GetAnalyzeSaveState: Retrieves the current state of saving analysis results.
 * GetAnalysisRefreshDays: Retrieves the number of days for refreshing analysis results.
 * SetAnalysisRefreshDays: Sets the number of days for refreshing analysis results.
 */

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ApiKeyInput from './ApiKeyInput'; // Importing the new component
import Mouser from "./assets/images/mouser.svg";
import Digikey from "./assets/images/digikey.svg";
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
    SetAnalysisRefreshDays 
} from '../wailsjs/go/main/App';
import './Settings.css'; // External CSS file

const ItemTypes = {
    API: 'api'
};

const supplierIcons = {
    Mouser: Mouser,
    Digikey: Digikey,
};

const DraggableItem = ({ api, index, moveItem }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.API,
        item: { index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: ItemTypes.API,
        hover(item) {
            if (item.index !== index) {
                moveItem(item.index, index);
                item.index = index;
            }
        }
    });

    return (
        <div 
            ref={(node) => drag(drop(node))} 
            className="priority-item" 
            style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'inherit',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: isDragging ? 0.5 : 1,
                cursor: isDragging ? 'grabbing' : 'grab'  // Curseur grab ajouté ici
            }}
        >
          <img src={supplierIcons[api]} alt={`${api} icon`} style={{width: '7px', height: 'auto'}}/>  {api}
        </div>
    );
    
};

function Settings() {
    const [apiPriority, setApiPriority] = useState([]);
    const [mouserApiKey, setMouserApiKey] = useState('');
    const [dkClientID, setDkClientID] = useState('');
    const [dkSecret, setDkSecret] = useState('');
    const [bomulusApiKey, setBomulusApiKey] = useState('');
    const [mouserApiStatus, setMouserApiStatus] = useState('');
    const [dkApiStatus, setDkApiStatus] = useState('');
    const [bomulusApiStatus, setBomulusApiStatus] = useState('');
    const [mouserError, setMouserError] = useState('');
    const [dkError, setDkError] = useState('');
    const [bomulusError, setBomulusError] = useState('');
    const [isTestingMouser, setIsTestingMouser] = useState(false);
    const [isTestingDk, setIsTestingDk] = useState(false);
    const [isTestingBOMulus, setIsTestingBOMulus] = useState(false);
    const [analyzeSaveState, setAnalyzeSaveState] = useState(false);
    const [analysisRefreshDays, setAnalysisRefreshDays] = useState(0);

    // Load saved keys and settings on component mount
    useEffect(() => {
        loadSavedAPIKeys();
        loadAnalyzeSaveState();
        loadAnalysisRefreshDays();
        loadApiPriority();
    }, []);

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
        const updatedPriority = Array.from(apiPriority);
        const [movedItem] = updatedPriority.splice(fromIndex, 1);
        updatedPriority.splice(toIndex, 0, movedItem);
        setApiPriority(updatedPriority);
        handleApiPriorityChange(updatedPriority);
    };

    // Load number of days for refreshing analysis results
    const loadAnalysisRefreshDays = async () => {
        try {
            const days = await GetAnalysisRefreshDays();
            setAnalysisRefreshDays(days);
        } catch (error) {
            console.error("Error loading reanalysis days:", error);
        }
    };

    // Handle changes to analysis refresh days input
    const handleAnalysisRefreshDaysChange = async (e) => {
        const newDays = parseInt(e.target.value, 10);
        if (isNaN(newDays) || newDays < 0) return;
        
        setAnalysisRefreshDays(newDays);
        try {
            await SetAnalysisRefreshDays(newDays);
        } catch (error) {
            console.error("Error setting reanalysis days:", error);
            // Revert state if there's an error
            setAnalysisRefreshDays(prevDays => prevDays);
        }
    };

    // Load saved API keys from storage
    const loadSavedAPIKeys = async () => {
        try {
            const savedKeys = await GetSavedAPIKeys();
            setMouserApiKey(savedKeys.mouser_api_key || '');
            setBomulusApiKey(savedKeys.bomulus_api_key || '');
            setDkClientID(savedKeys.dk_client_id || '');
            setDkSecret(savedKeys.dk_secret || '');
        } catch (error) {
            console.error("Error loading saved API keys:", error);
        }
    };

    // Load analyze save state from storage
    const loadAnalyzeSaveState = async () => {
        try {
            const state = await GetAnalyzeSaveState();
            setAnalyzeSaveState(state);
        } catch (error) {
            console.error("Error loading analyze save state:", error);
        }
    };

    // Handle changes to analyze save state checkbox
    const handleAnalyzeSaveStateChange = async (e) => {
        const newState = e.target.checked;
        setAnalyzeSaveState(newState);
        try {
            await SetAnalyzeSaveState(newState);
        } catch (error) {
            console.error("Error setting analyze save state:", error);
            // Revert state if there's an error
            setAnalyzeSaveState(!newState);
        }
    };

    // Handle changes to Mouser API key input
    const handleMouserApiKeyChange = (e) => {
        setMouserApiKey(e.target.value);
        setMouserApiStatus('');
        setMouserError('');
    };

    // Handle changes to Digikey API client ID
    const handleDkClientIDChange = (e) => {
        setDkClientID(e.target.value);
        setDkApiStatus('');
        setDkError('');
    };

    // Handle changes to Digikey API secret
    const handleDkSecretChange = (e) => {
        setDkSecret(e.target.value);
        setDkApiStatus('');
        setDkError('');
    };

    // Handle changes to BOMulus API key input
    const handleBomulusApiKeyChange = (e) => {
        setBomulusApiKey(e.target.value);
        setBomulusApiStatus('');
        setBomulusError('');
    };

    // Test Mouser API key validity
    const testMouserApiKey = async () => {
        setIsTestingMouser(true);
        try {
            const result = await TestMouserAPIKey(mouserApiKey);
            if (result) {
                setMouserApiStatus('API key is valid');
                setMouserError('');
            } else {
                setMouserApiStatus('API key is invalid');
                setMouserError('');
            }
        } catch (error) {
            console.error("Error testing Mouser API key:", error);
            setMouserApiStatus('');
            setMouserError(error.toString());
        } finally {
            setIsTestingMouser(false);
        }
    };

    // Test Digikey API credentials validity
    const testDKCredentials = async () => {
        setIsTestingDk(true);
        try {
            const result = await TestDKCredentials(dkClientID, dkSecret);
            if (result) {
                setDkApiStatus('API credentials are valid');
                setDkError('');
            } else {
                setDkApiStatus('API credentials are invalid');
                setDkError('');
            }
        } catch (error) {
            console.error("Error testing Digikey API credentials:", error);
            setDkApiStatus('');
            setDkError(error.toString());
        } finally {
            setIsTestingDk(false);
        }
    };

    // Test BOMulus API key validity
    const testBomulusApiKey = async () => {
        setIsTestingBOMulus(true);
        try {
            const result = await TestBOMulusAPIKey(bomulusApiKey);
            if (result) {
                setBomulusApiStatus('API key is valid');
                setBomulusError('');
            } else {
                setBomulusApiStatus('API key is invalid');
                setBomulusError('');
            }
        } catch (error) {
            console.error("Error testing BOMulus API key:", error);
            setBomulusApiStatus('');
            setBomulusError(error.toString());
        } finally {
            setIsTestingBOMulus(false);
        }
    };

   return (
         <div className="settings-container">
             
             <ApiKeyInput 
                 id="mouserApiKey"
                 label="Mouser API Key"
                 value={mouserApiKey}
                 onChange={handleMouserApiKeyChange}
                 onTest={testMouserApiKey}
                 isTesting={isTestingMouser}
                 status={mouserApiStatus}
                 error={mouserError}
             />

             <ApiKeyInput
                 id="dkCredentials"
                 label="DigiKey API Credentials"
                 value={dkClientID}
                 onChange={handleDkClientIDChange}
                 clientSecret={dkSecret}
                 onClientSecretChange={handleDkSecretChange}
                 onTest={testDKCredentials}
                 isTesting={isTestingDk}
                 status={dkApiStatus}
                 error={dkError}
                 isCredentials={true} // Activate credentials configuration
             />

             <ApiKeyInput 
                 id="bomulusApiKey"
                 label="BOMulus API Key"
                 value={bomulusApiKey}
                 onChange={handleBomulusApiKeyChange}
                 onTest={testBomulusApiKey}
                 isTesting={isTestingBOMulus}
                 status={bomulusApiStatus}
                 error={bomulusError}
             />

            <h3>API Priority</h3>
            <DndProvider backend={HTML5Backend}>
                {apiPriority.map((api, index) => (
                    <DraggableItem
                        key={api}
                        api={api}
                        index={index}
                        moveItem={moveItem}
                    />
                ))}
            </DndProvider>

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
                 <label htmlFor="analysisRefreshDays"> Days Analysis Refresh</label>
             </div>
         </div>
     );
}

export default Settings;
