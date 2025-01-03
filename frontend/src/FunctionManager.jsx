import React, { useState, useEffect } from 'react';
import { UpdateDesignator, GetComponents, UpdateBMLSDesignators } from '../wailsjs/go/main/App';
import './FunctionManager.css';

function FunctionManager({ onClose, componentsAll, onRefreshComponents }) {
    const [designators, setDesignators] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [colorMap, setColorMap] = useState({});

    const [selectedFunction, setSelectedFunction] = useState('');
    const [newFunctionName, setNewFunctionName] = useState('');
    const [newFunctionColor, setNewFunctionColor] = useState('#ff0000');

    const [assignedDesignators, setAssignedDesignators] = useState([]);
    const [availableDesignators, setAvailableDesignators] = useState([]);

    // ----------------------------------------------------------
    // 1) Charger designators depuis componentsAll
    // ----------------------------------------------------------
    useEffect(() => {
        loadData(componentsAll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentsAll]);

    const loadData = (components = []) => {
        let allDesignators = [];
        for (const c of components) {
            if (c.designators && c.designators.length > 0) {
                allDesignators = [...allDesignators, ...c.designators];
            }
        }

        setDesignators(allDesignators);

        // Extraire la liste unique de fonctions existantes
        const tempColorMap = {};
        const uniqueNames = new Set();
        allDesignators.forEach(d => {
            if (d.label && d.label.name) {
                const fName = d.label.name.trim();
                if (fName) {
                    uniqueNames.add(fName);
                    tempColorMap[fName] = d.label.color || '#000000';
                }
            }
        });

        setFunctions(Array.from(uniqueNames));
        setColorMap(tempColorMap);
    };

    // ----------------------------------------------------------
    // 2) Sélection fonction existante
    // ----------------------------------------------------------
    const handleFunctionSelection = (funcName) => {
        setSelectedFunction(funcName);
        updateListsForFunction(funcName);
    };

    const updateListsForFunction = (funcName) => {
        const assigned = designators.filter(d => d.label?.name === funcName);
        const available = designators.filter(d => d.label?.name !== funcName);
        setAssignedDesignators(assigned);
        setAvailableDesignators(available);
    };

    // ----------------------------------------------------------
    // 3) Création d'une fonction
    // ----------------------------------------------------------
    const handleCreateFunction = () => {
        const fn = newFunctionName.trim();
        if (!fn) return;

        if (!functions.includes(fn)) {
            setFunctions([...functions, fn]);
        }
        setColorMap(prev => ({ ...prev, [fn]: newFunctionColor }));

        setNewFunctionName('');
        setNewFunctionColor('#ff0000');
        // On sélectionne directement la nouvelle fonction
        handleFunctionSelection(fn);
    };

    // ----------------------------------------------------------
    // 4) Déplacement assigned/available
    // ----------------------------------------------------------
    const moveToAssigned = (designator) => {
        setAvailableDesignators(
            availableDesignators.filter(d => d.designator !== designator.designator)
        );
        const updatedLabel = {
            name: selectedFunction,
            color: colorMap[selectedFunction] || '#000000'
        };
        setAssignedDesignators([
            ...assignedDesignators,
            { ...designator, label: updatedLabel }
        ]);
    };

    const moveToAvailable = (designator) => {
        setAssignedDesignators(
            assignedDesignators.filter(d => d.designator !== designator.designator)
        );
        const emptyLabel = { name: '', color: '' };
        setAvailableDesignators([
            ...availableDesignators,
            { ...designator, label: emptyLabel }
        ]);
    };

    // ----------------------------------------------------------
    // 5) handleSave
    // ----------------------------------------------------------
    const handleSave = async () => {
        const updatedDesignators = [...assignedDesignators, ...availableDesignators];
        for (const d of updatedDesignators) {
            const original = designators.find(x => x.designator === d.designator);
            const hasChanged =
                (original?.label?.name !== d.label?.name) ||
                (original?.label?.color !== d.label?.color);

            if (hasChanged) {
                await UpdateDesignator(d.designator, d.label.name, d.label.color);
            }
        }

        await UpdateBMLSDesignators();

        const updatedComponents = await GetComponents();
        onRefreshComponents(updatedComponents);
        loadData(updatedComponents);
        onClose();
    };

    // ----------------------------------------------------------
    // Render
    // ----------------------------------------------------------
    return (
        <div className="function-manager">
            <h2 className="function-manager-title">Function Manager</h2>

            {/* Bloc pour choisir une fonction existante */}
            <div className="function-config">
                <div className="function-choose">
                    <label htmlFor="selectFunction">Select an existing function</label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                            id="selectFunction"
                            value={selectedFunction}
                            onChange={(e) => handleFunctionSelection(e.target.value)}
                        >
                            <option value="">> Functions</option>
                            {functions.map(f => {
                                const color = colorMap[f] || '#ffffff';
                                return (
                                    <option
                                        key={f}
                                        value={f}
                                        style={{ color: color }} // voir remarque ci-dessus
                                    >
                                        ■ {f}
                                    </option>
                                );
                            })}
                        </select>

                        {/* Petit carré de couleur si on a choisi une fonction */}
                        {selectedFunction && (
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: colorMap[selectedFunction] || '#ffffff'
                                }}
                            />
                        )}
                    </div>
                </div>


                {/* Bloc pour créer une nouvelle fonction */}
                <div className="function-create">
                    <span>Create a new function:</span>
                    <div className="create-function-row">
                        <input
                            type="text"
                            value={newFunctionName}
                            onChange={(e) => setNewFunctionName(e.target.value)}
                            placeholder="Function name"
                        />

                        {/* Le wrapper .color-picker-wrapper */}
                        <div className="color-picker-wrapper">
                            <input
                                type="color"
                                value={newFunctionColor}
                                onChange={(e) => setNewFunctionColor(e.target.value)}
                            />
                        </div>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: newFunctionColor
                            }}
                        />

                        <button onClick={handleCreateFunction}>Create</button>
                    </div>



                </div>
            </div>

            {/* 2 colonnes : available / assigned */}
            {selectedFunction && (
                <div className="columns">
                    <div className="column">
                        <h3>Available Designators (not in "{selectedFunction}")</h3>
                        <div className="designator-list">
                            {availableDesignators
                                .sort((a, b) => a.designator.localeCompare(b.designator))
                                .map((d, idx) => (
                                    <div key={`${d.designator}-${idx}`} className="designator-item">
                                        <span>
                                            {d.designator} (
                                            {d.label?.name
                                                ? <>
                                                    {/* Petit carré coloré + nom */}
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '10px',
                                                        height: '10px',
                                                        backgroundColor: d.label?.color || '#ffffff',
                                                        marginRight: '5px'
                                                    }} />
                                                    {d.label.name}
                                                </>
                                                : 'No function'
                                            }
                                            )
                                        </span>

                                        <button onClick={() => moveToAssigned(d)}>&rarr;</button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="column">
                        <h3>Assigned to "{selectedFunction}"</h3>
                        <div className="designator-list">
                            {assignedDesignators
                                .sort((a, b) => a.designator.localeCompare(b.designator))
                                .map((d, idx) => (
                                    <div key={`${d.designator}-${idx}`} className="designator-item">
                                        <span>{d.designator}</span>
                                        <button onClick={() => moveToAvailable(d)}>&larr;</button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="button-row">
                {/* Bouton de sauvegarde */}
                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={!selectedFunction}
                >
                    Update Designators
                </button>
                {/* Eventuel bouton Cancel/Close */}

            </div>
        </div>
    );
}

export default FunctionManager;
