import React from 'react';
import './Stats.css';

function Stats({ statsData, componentsAll }) {

    function chooseColorForFunction(funcName) {
        const colorMap = {
            Power: '#86b384',
            USB: '#cc7481',
            Audio: '#ffac00',
            // etc.
        };
        return colorMap[funcName] || '#007BFF';
    }


    const { coverage, mouserCount, digikeyCount, unprocuredCount, inStockCount, outOfStockCount, insufficientCount, total } = statsData;



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


    // === Nouveau : calcul de la répartition de prix par fonction ===
    const functionPriceMap = computePriceByFunction(componentsAll);

    // Convertir en tableau pour faciliter le conic-gradient
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
        // Choisir une couleur par fonction : soit un map, soit au hasard
        const color = chooseColorForFunction(item.func);
        return `${color} ${startAngle}% ${endAngle}%`;
    }).join(', ');

    const functionDonutBg = `conic-gradient(${segments}, #565656 ${currentAngle}% 100%)`;


    // Calcule la répartition du prix par fonction
    function computePriceByFunction(componentsAll) {
        const functionPriceMap = {};

        componentsAll.forEach(comp => {
            // Récupérer la “best_unit_price” (string) et convertir en float
            const bestUnitPriceStr = comp?.calculated_price?.best_unit_price;
            if (!bestUnitPriceStr) return;  // Composant non analysé ou pas de prix

            const bestUnitPrice = parseFloat(bestUnitPriceStr);
            if (isNaN(bestUnitPrice)) return;

            // Déterminer la quantité effective
            let qty = comp.quantity;
            if (comp.operator === 'UPDATE' && comp.NewQuantity) {
                qty = comp.NewQuantity;
            }

            const totalCompPrice = bestUnitPrice * qty;

            // S’il n’y a pas de designators, on ignore
            if (!comp.designators || comp.designators.length === 0) return;

            // Répartir ce totalCompPrice sur les designators
            const pricePerDesignator = totalCompPrice / comp.designators.length;

            comp.designators.forEach(d => {
                const funcLabel = d.label?.trim() || "";
                if (!funcLabel) return; // designator sans fonction
                if (!functionPriceMap[funcLabel]) {
                    functionPriceMap[funcLabel] = 0;
                }
                functionPriceMap[funcLabel] += pricePerDesignator;
            });
        });

        return functionPriceMap;
    }


    return (
        <div className="stats-container">
            {/* 1er donut : BOM COVERAGE */}
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

            {/* 2ème donut : AVAILABILITY */}
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

            {/* 3ème donut : PRICE BY FUNCTION */}
            <div className="donut-container">
                <div className="donut" style={{ background: functionDonutBg }}>
                    <p>100%</p>{/* ou un autre texte, ou rien */}
                </div>
                <div className="stats-labels">
                    <h5>PRICE BY FUNCTION</h5>
                    {distribution.map(item => (
                        <p key={item.func} style={{ color: chooseColorForFunction(item.func) }}>
                            {item.func}: ${item.price.toFixed(2)} ({item.pct.toFixed(1)}%)
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default Stats;
