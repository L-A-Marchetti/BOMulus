import React, { useState, useEffect } from 'react';
import { UpdateDesignator, GetComponents, UpdateBMLSDesignators } from '../wailsjs/go/main/App';

/**
 * FunctionManager.jsx
 *
 * Gère la répartition des designators dans des fonctions (labels).
 * Permet la création d'une nouvelle fonction (nom + couleur),
 * le déplacement (assigned/available) et la sauvegarde via UpdateDesignator.
 */
function FunctionManager({ onClose, componentsAll, onRefreshComponents }) {
    // Tous les designators, extraits de componentsAll
    const [designators, setDesignators] = useState([]);

    // Liste de fonctions existantes (simples noms) + Map (nom => couleur)
    const [functions, setFunctions] = useState([]);
    const [colorMap, setColorMap] = useState({});

    // Sélection courante & création
    const [selectedFunction, setSelectedFunction] = useState('');
    const [newFunctionName, setNewFunctionName] = useState('');
    const [newFunctionColor, setNewFunctionColor] = useState('#ff0000');

    // Listes assigned / available
    const [assignedDesignators, setAssignedDesignators] = useState([]);
    const [availableDesignators, setAvailableDesignators] = useState([]);

    // ------------------------------------------------------------------
    // 1) Charger designators depuis componentsAll
    // ------------------------------------------------------------------
    useEffect(() => {
        console.log("ComponentsAll updated in FunctionManager:", componentsAll);
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentsAll]);

    useEffect(() => {
        return () => {
            setDesignators([]);
            setFunctions([]);
            setColorMap({});
            setSelectedFunction('');
            setAssignedDesignators([]);
            setAvailableDesignators([]);
        };
    }, []);

    // ------------------------------------------------------------------
    //  Dédupliquer + extraire la liste de fonctions
    // ------------------------------------------------------------------
    const loadData = (components = componentsAll) => {
        console.log("Loading data for FunctionManager with components:", components);
        let allDesignators = [];
        for (const c of components) {
            if (c.designators && c.designators.length > 0) {
                allDesignators = allDesignators.concat(c.designators);
                console.log("Designators for", allDesignators);
            }
        }

        console.log("All designators:", allDesignators);


        setDesignators(allDesignators);

        // 2) Construire un ensemble de noms + un map { fonctionName: color }
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


    // ------------------------------------------------------------------
    // 2) handleFunctionSelection
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // 3) Création d'une fonction
    // ------------------------------------------------------------------
    const handleCreateFunction = () => {
        const fn = newFunctionName.trim();
        if (!fn) return;

        if (!functions.includes(fn)) {
            setFunctions([...functions, fn]);
        }
        setColorMap(prev => ({ ...prev, [fn]: newFunctionColor }));

        setNewFunctionName('');
        setNewFunctionColor('#ff0000');
        handleFunctionSelection(fn);
    };

    // ------------------------------------------------------------------
    // 4) Move to assigned
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // 5) Move to available
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // 6) handleSave
    // ------------------------------------------------------------------
    const handleSave = async () => {
        const updatedDesignators = [...assignedDesignators, ...availableDesignators];

        for (const d of updatedDesignators) {
            const original = designators.find(x => x.designator === d.designator);
            const hasChanged =
                (original?.label?.name !== d.label?.name) ||
                (original?.label?.color !== d.label?.color);

            if (hasChanged) {
                console.log("Will update", d.designator, "label:", d.label.name, d.label.color);
                await UpdateDesignator(d.designator, d.label.name, d.label.color);
            }
        }

        await UpdateBMLSDesignators();

        alert("Designators updated successfully!");

        const updatedComponents = await GetComponents();
        console.log(">>> [FunctionManager] updatedComponents after UpdateDesignator:", updatedComponents);

        onRefreshComponents(updatedComponents);
        loadData(updatedComponents);
        onClose();
    };

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    return (
        <div style={{ padding: '20px', maxWidth: '600px', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
            <h2>Function Manager</h2>

            {/* Choix fonction existante ou création */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <span>Select a function: </span>
                    <select
                        value={selectedFunction}
                        onChange={(e) => handleFunctionSelection(e.target.value)}
                        style={{ padding: '5px' }}
                    >
                        <option value="">No function selected</option>
                        {functions.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="text"
                        value={newFunctionName}
                        onChange={(e) => setNewFunctionName(e.target.value)}
                        placeholder="New function name"
                        style={{ padding: '5px' }}
                    />
                    <input
                        type="color"
                        value={newFunctionColor}
                        onChange={(e) => setNewFunctionColor(e.target.value)}
                        style={{ width: '40px', height: '30px', padding: 0, border: 'none' }}
                    />
                    <button onClick={handleCreateFunction} style={{ padding: '5px 10px' }}>
                        Create Function
                    </button>
                </div>
            </div>

            {/* 2 colonnes : available / assigned */}
            {selectedFunction && (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>
                            Available Designators (not in "{selectedFunction}")
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px' }}>
                            {availableDesignators
                                .sort((a, b) => a.designator.localeCompare(b.designator)) // Tri alphabétique
                                .map((d, idx) => (
                                    <div key={`${d.designator}-${idx}`} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>
                                            {d.designator} ({d.label?.name ? d.label.name : 'No function'})
                                        </span>
                                        <button
                                            onClick={() => moveToAssigned(d)}
                                            style={{ padding: '2px 5px', fontSize: '12px' }}
                                        >
                                            →
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>
                            Assigned to "{selectedFunction}"
                        </h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px' }}>
                            {assignedDesignators
                                .sort((a, b) => a.designator.localeCompare(b.designator)) // Tri alphabétique
                                .map((d, idx) => (
                                    <div key={`${d.designator}-${idx}`} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{d.designator}</span>
                                        <button
                                            onClick={() => moveToAvailable(d)}
                                            style={{ padding: '2px 5px', fontSize: '12px' }}
                                        >
                                            ←
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    disabled={!selectedFunction}
                >
                    Update Designators
                </button>
            </div>
        </div>
    );
}

export default FunctionManager;
