/*
 * PricingCalculator.jsx
 * 
 * A component for calculating prices based on quantity input.
 *
 * Props: None
 *
 * States:
 * quantity: String representing the user input quantity.
 * result: Object containing the calculation results.
 * error: String containing any error messages.
 *
 * Sub-components:
 * Button: Reusable button component for triggering calculation.
 *
 * Backend Dependencies:
 * PriceCalculator: Function from Wails backend to calculate prices.
 */

import React, { useState } from 'react';
import Button from './Button';
import { PriceCalculator } from '../wailsjs/go/main/App';
import './PricingCalculator.css';

// Main PricingCalculator component
function PricingCalculator() {
    const [quantity, setQuantity] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Handles quantity input changes
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setQuantity(value);
            setError('');
        }
    };

    // Triggers price calculation
    const handleCalculate = async () => {
        if (quantity === '') {
            setError('Please enter a quantity');
            return;
        }

        const numQuantity = parseInt(quantity, 10);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            setError('Please enter a valid positive number');
            return;
        }

        try {
            const calculatedPrice = await PriceCalculator(numQuantity);
            setResult(calculatedPrice);
            setError('');
        } catch (error) {
            console.error("Error calculating price:", error);
            setError('An error occurred while calculating the price');
            setResult(null);
        }
    };

    // Formats price based on currency
    const formatPrice = (price, currency) => {
        return currency === "USD" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} €`;
    };

    return (
        <div className="pricing-calculator">
            <h4 className="calculator-title">Price Calculator</h4>
            <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Quantity"
                className={`quantity-input ${error ? 'error' : ''}`}
            />
            {error && <p className="error-message">{error}</p>}
            <Button className="calculate-button" onClick={handleCalculate} disabled={!quantity}>
                Calculate
            </Button>
            {result && <CalculationResult result={result} formatPrice={formatPrice} />}
        </div>
    );
}

// Sub-component for displaying calculation results
function CalculationResult({ result, formatPrice }) {
    return (
        <div className="calculation-result">
            <h5>Result:</h5>
            <p>Order price for [{result.quantity}] piece(s): {formatPrice(result.orderPrice, result.currency)}</p>
            <p>Unit price: {formatPrice(result.unitPrice, result.currency)}</p>
            <p>Unit price diff: {formatPrice(result.unitPriceDiff, result.currency)}</p>
            {result.minimumQuantities.length > 0 && (
                <MinimumQuantities minimumQuantities={result.minimumQuantities} />
            )}
        </div>
    );
}

// Sub-component for displaying minimum quantities not reached
function MinimumQuantities({ minimumQuantities }) {
    return (
        <div>
            <p>Minimum quantities not reached:</p>
            <ul>
                {minimumQuantities.map((minQty, index) => (
                    <li key={index}>{minQty}</li>
                ))}
            </ul>
        </div>
    );
}

export default PricingCalculator;
