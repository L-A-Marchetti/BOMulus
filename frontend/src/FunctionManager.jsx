import React, { useState, useEffect } from 'react';
import { UpdateDesignator, GetComponents } from '../wailsjs/go/main/App';

function FunctionManager({ onClose, componentsAll, onRefreshComponents }) {
    const [designators, setDesignators] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState('');
    const [newFunctionName, setNewFunctionName] = useState('');

    const [assignedDesignators, setAssignedDesignators] = useState([]);
    const [availableDesignators, setAvailableDesignators] = useState([]);


    useEffect(() => {
        console.log("ComponentsAll updated in FunctionManager:", componentsAll);
        loadData();
    }, [componentsAll]);

    useEffect(() => {
        return () => {
            // Réinitialisez les états locaux pour éviter des données obsolètes
            setDesignators([]);
            setFunctions([]);
            setSelectedFunction('');
            setAssignedDesignators([]);
            setAvailableDesignators([]);
        };
    }, []);



    const loadData = (components = componentsAll) => {
        let allDesignators = [];
        for (const c of components) {
            if (c.designators && c.designators.length > 0) {
                allDesignators = allDesignators.concat(c.designators);
            }
        }

        setDesignators(allDesignators);

        const uniqueLabels = new Set();
        allDesignators.forEach(d => {
            if (d.label && d.label.trim() !== '') {
                uniqueLabels.add(d.label);
            }
        });
        setFunctions(Array.from(uniqueLabels));
    };


    const handleFunctionSelection = (funcName) => {
        setSelectedFunction(funcName);
        updateListsForFunction(funcName);
    };

    const handleCreateFunction = () => {
        const fn = newFunctionName.trim();
        if (!fn) return;
        if (!functions.includes(fn)) {
            setFunctions([...functions, fn]);
        }
        setNewFunctionName('');
        handleFunctionSelection(fn);
    };

    const updateListsForFunction = (funcName) => {
        // Comparer avec d.label au lieu de d.Label
        const assigned = designators.filter(d => d.label === funcName);
        const available = designators.filter(d => d.label !== funcName);
        setAssignedDesignators(assigned);
        setAvailableDesignators(available);
    };

    const moveToAssigned = (designator) => {
        // Mettre à jour le label du designator
        setAvailableDesignators(availableDesignators.filter(d => d.designator !== designator.designator));
        setAssignedDesignators([...assignedDesignators, { ...designator, label: selectedFunction }]);
    };

    const moveToAvailable = (designator) => {
        setAssignedDesignators(assignedDesignators.filter(d => d.designator !== designator.designator));
        setAvailableDesignators([...availableDesignators, { ...designator, label: '' }]);
    };

    const handleSave = async () => {
        const updatedDesignators = [...assignedDesignators, ...availableDesignators];

        for (const d of updatedDesignators) {
            const original = designators.find(x => x.designator === d.designator);
            if (original && original.label !== d.label) {
                await UpdateDesignator(d.designator, d.label || '');
            }
        }

        alert("Designators updated successfully!");

        // Récupérer la nouvelle liste de composants mise à jour
        const updatedComponents = await GetComponents();

        // Appeler le callback du parent avec ces nouveaux composants
        onRefreshComponents(updatedComponents);

        // Rafraîchir les données localement
        loadData(updatedComponents);

        onClose();
    };






    return (
        <div style={{ padding: '20px', maxWidth: '600px', color: 'white', fontFamily: 'Poppins, sans-serif' }}>
            <h2>Function Manager</h2>

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
                <div>
                    <input
                        type="text"
                        value={newFunctionName}
                        onChange={(e) => setNewFunctionName(e.target.value)}
                        placeholder="New function name"
                        style={{ padding: '5px', marginRight: '10px' }}
                    />
                    <button onClick={handleCreateFunction} style={{ padding: '5px 10px' }}>
                        Create Function
                    </button>
                </div>
            </div>

            {selectedFunction && (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Available Designators (not in "{selectedFunction}")</h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px' }}>
                            {availableDesignators.map(d => (
                                <div key={d.designator} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{d.designator} ({d.label || 'No function'})</span>
                                    <button onClick={() => moveToAssigned(d)} style={{ padding: '2px 5px', fontSize: '12px' }}>→</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Assigned to "{selectedFunction}"</h3>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px' }}>
                            {assignedDesignators.map(d => (
                                <div key={d.designator} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{d.designator}</span>
                                    <button onClick={() => moveToAvailable(d)} style={{ padding: '2px 5px', fontSize: '12px' }}>←</button>
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
