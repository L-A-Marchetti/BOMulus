import React from 'react';
import './Stats.css';

function Stats({ statsData }) {
    const { coverage, mouserCount, unprocuredCount, inStockCount, outOfStockCount, insufficientCount, total } = statsData;

    // Donut coverage
    // coverage% un gradient, le reste gris
    const coverageBg = `conic-gradient(#8e84b3 0% ${coverage}%, #565656 ${coverage}% 100%)`;

    // Donut availability
    const inStockPct = total > 0 ? (inStockCount / total) * 100 : 0;
    const outOfStockPct = total > 0 ? (outOfStockCount / total) * 100 : 0;
    const insufficientPct = total > 0 ? (insufficientCount / total) * 100 : 0;

    const availabilityBg = `conic-gradient(
    #86b384 0% ${inStockPct}%,
    #cc7481 ${inStockPct}% ${inStockPct + outOfStockPct}%,
    #86b384 ${inStockPct + outOfStockPct}% ${inStockPct + outOfStockPct + insufficientPct}%,
    #565656 ${inStockPct + outOfStockPct + insufficientPct}% 100%
  )`;

    return (
        <div className="stats-container">
            <div className="donut-container">
                <div className="donut" style={{ background: coverageBg }}><p>{Math.round(coverage)}%</p></div>
                <div className="stats-labels">
                    <h5>BOM COVERAGE</h5>
                    <p style={{ color: '#8e84b3' }}>Mouser: {mouserCount}</p>
                    <p style={{ color: '#acacac' }}>Unprocured: {unprocuredCount}</p>
                </div>
            </div>

            <div className="donut-container">
                <div className="donut" style={{ background: availabilityBg }}><p>{Math.round(inStockPct)}%</p></div>
                <div className="stats-labels">
                    <h5>AVAILABILITY</h5>
                    <p style={{ color: '#86b384' }}>In stock: {inStockCount}</p>
                    <p style={{ color: '#cc7481' }}>Out of stock: {outOfStockCount}</p>
                    <p style={{ color: '#ffac00' }}>Insufficient: {insufficientCount}</p>
                </div>
            </div>
        </div>
    );
}

export default Stats;
