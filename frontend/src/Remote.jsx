import React, { useState } from 'react';
import DragDrop from './DragDrop';
import Switch from './Switch';
import { motion, AnimatePresence } from 'framer-motion'; // Importer les éléments nécessaires
import "./Remote.css";
import { BtnCompare, MaximizeWindow } from "../wailsjs/go/main/App";

function Remote({ setShowCompareView }) { // Receive toggle function as prop
    const [isTwoColumns, setIsTwoColumns] = useState(true);
    const [isValid1, setIsValid1] = useState(false);
    const [isValid2, setIsValid2] = useState(false);

    const handleSwitchToggle = (isChecked) => {
        setIsTwoColumns(isChecked);
        // Reset valid states if switching columns to avoid incorrect states
        if (!isChecked) {
            setIsValid2(false); // Reset second column validity
        }
    };

    const btnCompare = async () => {
        await BtnCompare(); // Wait for Go function to complete
        MaximizeWindow();
        setShowCompareView(); // Show CompareView after calculations are done
    };
    return (
        <>
            <div className='remote-container'>
                <div className='dnd-container'>
                    <AnimatePresence>
                        <DragDrop idx={1} setIsValid={setIsValid1} />
                        <Switch onToggle={handleSwitchToggle} btnCompare={btnCompare} isValid1={isValid1} isValid2={isValid2} />
                        {isTwoColumns && (
                            <motion.div
                                key="dragdrop-2"
                                initial={{ opacity: 0, width: '0px' }}
                                animate={{ opacity: 1, width: '230px' }}
                                exit={{ opacity: 0, width: '0px' }}
                                transition={{ duration: 0.5 }}
                            >
                                <DragDrop idx={2} setIsValid={setIsValid2} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </>
    );
}

export default Remote;
