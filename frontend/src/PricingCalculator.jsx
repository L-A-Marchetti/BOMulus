import React, { useState } from 'react';
import Button from './Button';
import { PriceCalculator } from '../wailsjs/go/main/App';

function PricingCalculator() {
    const [quantity, setQuantity] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setQuantity(value);
            setError('');
        }
    };

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

    const formatPrice = (price, currency) => {
        return currency === "USD" ? `$${price.toFixed(2)}` : `${price.toFixed(2)} €`;
    };

    return (
        <div style={{ padding: '10px'}}>
            <h4 style={{
                margin: 0,
                padding: '10px',
                fontFamily: 'Poppins, sans-serif',
            }}>Price Calculator</h4>
            <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Quantity"
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                    borderColor: error ? 'red' : 'initial',
                }}
            />
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <Button style={{ width: '100%'}} onClick={handleCalculate} disabled={!quantity}>
                Calculate
            </Button>
            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h5>Result:</h5>
                    <p>Order price for [{result.quantity}] piece(s): {formatPrice(result.orderPrice, result.currency)}</p>
                    <p>Unit price: {formatPrice(result.unitPrice, result.currency)}</p>
                    <p>Unit price diff: {formatPrice(result.unitPriceDiff, result.currency)}</p>
                    {result.minimumQuantities.length > 0 && (
                        <div>
                            <p>Minimum quantities not reached:</p>
                            <ul>
                                {result.minimumQuantities.map((minQty, index) => (
                                    <li key={index}>{minQty}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PricingCalculator;
