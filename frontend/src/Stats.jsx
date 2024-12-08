import React from 'react';
import './Stats.css';

function Stats({ statsData }) {
    const { coverage, mouserCount, unprocuredCount, inStockCount, outOfStockCount, insufficientCount, total } = statsData;

    // Donut coverage
    // coverage% un gradient, le reste gris
    const coverageBg = `conic-gradient(#a250ff 0% ${coverage}%, #565656 ${coverage}% 100%)`;

    // Donut availability
    const inStockPct = total > 0 ? (inStockCount / total) * 100 : 0;
    const outOfStockPct = total > 0 ? (outOfStockCount / total) * 100 : 0;
    const insufficientPct = total > 0 ? (insufficientCount / total) * 100 : 0;

    const availabilityBg = `conic-gradient(
    #00ff00 0% ${inStockPct}%,
    #ff0000 ${inStockPct}% ${inStockPct + outOfStockPct}%,
    #ffac00 ${inStockPct + outOfStockPct}% ${inStockPct + outOfStockPct + insufficientPct}%,
    #565656 ${inStockPct + outOfStockPct + insufficientPct}% 100%
  )`;

    return (
        <div className="stats-container">
            <div className="donut-container">
                <div className="donut" style={{ background: coverageBg }}></div>
                <div className="stats-labels">
                    <h5>BOM COVERAGE: {Math.round(coverage)}%</h5>
                    <p style={{ color: '#a250ff' }}>Mouser: {mouserCount}</p>
                    <p style={{ color: '#acacac' }}>Unprocured: {unprocuredCount}</p>
                </div>
            </div>

            <div className="donut-container">
                <div className="donut" style={{ background: availabilityBg }}></div>
                <div className="stats-labels">
                    <h5>AVAILABILITY</h5>
                    <p style={{ color: '#00ff00' }}>In stock: {inStockCount}</p>
                    <p style={{ color: '#ff0000' }}>Out of stock: {outOfStockCount}</p>
                    <p style={{ color: '#ffac00' }}>Insufficient: {insufficientCount}</p>
                </div>
            </div>
        </div>
    );
}

export default Stats;
