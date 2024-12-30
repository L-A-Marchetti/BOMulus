import React from 'react';
import './Stats.css';

function Stats({ statsData, componentsAll, calculationResult, boards }) {
    function chooseColorForFunction(funcName, componentsAll) {
        const matchingDesignators = componentsAll.flatMap(comp => comp.designators || [])
            .filter(d => d.label?.name === funcName);

        if (matchingDesignators.length > 0) {
            console.log(`Found matching designators for ${funcName}:`, matchingDesignators);
            return matchingDesignators[0].label.color; // Prend la couleur du premier trouvé
        }

        console.log(`No matching designators for ${funcName}, using default color`);
        return '#007BFF'; // Couleur par défaut
    }

    if (!statsData || !calculationResult) {
        // Affiche un placeholder ou un message si les données ne sont pas disponibles
        return <div className="stats-wrapper">Loading data...</div>;
    }

    const oldPriceUnit = calculationResult.OldPrice && boards > 0
        ? calculationResult.OldPrice / boards
        : null; // Calcul du prix unitaire de la V1

    const { coverage, mouserCount, digikeyCount, unprocuredCount, inStockCount, outOfStockCount, insufficientCount, total } = statsData;

    // Donut coverage
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

    // Calcule la répartition des prix par fonction
    const functionPriceMap = computePriceByFunction(componentsAll);

    const sumAllPrices = Object.values(functionPriceMap).reduce((acc, val) => acc + val, 0);
    const distribution = Object.entries(functionPriceMap).map(([func, price]) => ({
        func,
        price,
        pct: sumAllPrices > 0 ? (price / sumAllPrices) * 100 : 0
    }));

    // Construire le conic-gradient pour le 3ème donut
    let currentAngle = 0;
    const segments = distribution.map(item => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + item.pct;
        currentAngle = endAngle;

        // Utilise la couleur dynamique
        const color = chooseColorForFunction(item.func, componentsAll);
        return `${color} ${startAngle}% ${endAngle}%`;
    }).join(', ');

    const functionDonutBg = `conic-gradient(${segments}, #565656 ${currentAngle}% 100%)`;

    function computePriceByFunction(componentsAll) {
        const functionPriceMap = {};

        componentsAll.forEach(comp => {
            const bestUnitPriceStr = comp?.calculated_price?.best_unit_price;
            if (!bestUnitPriceStr) return;

            const bestUnitPrice = parseFloat(bestUnitPriceStr);
            if (isNaN(bestUnitPrice)) return;

            let qty = comp.quantity;
            if (comp.operator === 'UPDATE' && comp.NewQuantity) {
                qty = comp.NewQuantity;
            }

            const totalCompPrice = bestUnitPrice * qty;

            if (!comp.designators || comp.designators.length === 0) return;

            const pricePerDesignator = totalCompPrice / comp.designators.length;

            comp.designators.forEach(d => {
                const funcLabel = d.label?.name.trim() || "";
                if (!funcLabel) return;
                if (!functionPriceMap[funcLabel]) {
                    functionPriceMap[funcLabel] = 0;
                }
                functionPriceMap[funcLabel] += pricePerDesignator;
            });
        });

        return functionPriceMap;
    }

    return (
        <div className="stats-wrapper">
            <div className="stats-main-content">
                <div className="stats-section">
                    <h4 className="section-title">v2 Stats</h4>
                    <div className="donut-row">
                        <div className="donut-container">
                            <div className="donut" style={{ background: coverageBg }}>
                                <p>{Math.round(coverage)}%</p>
                            </div>
                            <div className="stats-labels">
                                <h5>BOM COVERAGE</h5>
                                <p style={{ color: '#007BFF' }}>Mouser: {mouserCount}</p>
                                <p style={{ color: '#FF2100' }}>Digikey: {digikeyCount}</p>
                                <p style={{ color: '#acacac' }}>Unprocured: {unprocuredCount}</p>
                            </div>
                        </div>
                        <div className="donut-container">
                            <div className="donut" style={{ background: availabilityBg }}>
                                <p>{Math.round(inStockPct)}%</p>
                            </div>
                            <div className="stats-labels">
                                <h5>AVAILABILITY</h5>
                                <p style={{ color: '#86b384' }}>In stock: {inStockCount}</p>
                                <p style={{ color: '#cc7481' }}>Out of stock: {outOfStockCount}</p>
                                <p style={{ color: '#ffac00' }}>Insufficient: {insufficientCount}</p>
                            </div>
                        </div>
                        <div className="donut-container">
                            <div className="donut" style={{ background: functionDonutBg }}>
                                <p>100%</p>
                            </div>
                            <div className="stats-labels">
                                <h5>PRICE BY FUNCTION</h5>
                                {distribution.map(item => (
                                    <p key={item.func} style={{ color: chooseColorForFunction(item.func, componentsAll) }}>
                                        {item.func}: ${item.price.toFixed(2)} ({item.pct.toFixed(1)}%)
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="evolution-section">
                    <h4 className="section-title">V1 → V2 Evolution</h4>
                    <div className="evolution-container">
                        <p>Price Diff per Unit</p>
                        <div className="centered-progress-container">
                            {calculationResult ? (
                                <>
                                    <div className="progress-info">
                                        {/* Prix unitaire V1 à gauche */}
                                        <p className="progress-price-left">
                                            {oldPriceUnit !== null ? `$${oldPriceUnit.toFixed(2)}` : 'N/A'}
                                        </p>
                                        {/* Barre de progression */}
                                        <div className="centered-progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    left: calculationResult.unitPriceDiff < 0
                                                        ? '50%'
                                                        : `${50 - (calculationResult.unitPriceDiff / calculationResult.unitPrice) * 100}%`,
                                                    width: `${Math.abs(calculationResult.unitPriceDiff / calculationResult.unitPrice) * 100}%`,
                                                    backgroundColor: calculationResult.unitPriceDiff < 0 ? '#86b384' : '#CC7481',
                                                }}
                                            ></div>
                                        </div>
                                        {/* Prix unitaire V2 à droite */}
                                        <p className="progress-price-right">
                                            {calculationResult.unitPrice !== null ? `$${calculationResult.unitPrice.toFixed(2)}` : 'N/A'}
                                        </p>
                                    </div>
                                    {/* Texte sous la barre */}
                                    <p className="progress-diff-text" style={{ color: calculationResult.unitPriceDiff < 0 ? '#86b384' : '#CC7481' }}>
                                        {calculationResult.unitPriceDiff < 0 ? 'Gain' : 'Loss'}: {calculationResult.unitPriceDiff.toFixed(2)} {calculationResult.currency || 'USD'}
                                        ({((Math.abs(calculationResult.unitPriceDiff) / calculationResult.unitPrice) * 100).toFixed(2)}%)
                                    </p>

                                </>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#aaa' }}>Loading data...</p>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Stats;
