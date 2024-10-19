import React, { useState } from 'react';
import Button from './Button';
import { OpenExternalLink } from '../wailsjs/go/main/App';
import ButtonAction from './ButtonAction';

function ComponentRow({ component, operator, onPinToggle, pinnedComponents }) {
    const [expanded, setExpanded] = useState(false);

    const openExternalLink = (link) => {
        OpenExternalLink(link);
    };

    const isPinned = pinnedComponents && pinnedComponents.length > 0
        ? pinnedComponents.some(pinned => pinned.id === component.id)
        : false;

    const isOutOfStock = component.analyzed && operator !== 'DELETE' && component.availability === "";
    const isLCSRisky = component.analyzed && operator !== 'DELETE' && component.lifecycle_status !== "" && component.lifecycle_status !== "New Product" && component.lifecycle_status !== "New at Mouser";
    const hasMessages = component.analyzed && operator !== 'DELETE' && component.info_messages !== null;
    const hasMismatchMpn = component.analyzed && operator !== 'DELETE' && component.mismatch_mpn && component.mismatch_mpn !== null;
    const isWarning = isOutOfStock || isLCSRisky || hasMessages || hasMismatchMpn;

    const messages = [];

    if (isOutOfStock) {
        messages.push('Out Of Stock');
    }

    if (isLCSRisky) {
        messages.push('Risky Lifecycle Status');
    }

    if (hasMessages) {
        messages.push('Manufacturer Message(s)');
    }

    if (hasMismatchMpn) {
        messages.push('Mismatching Manufacturer Part Number');
    }

    const renderComponentDetails = (comp) => (
        <tr>
            <td style={{ backgroundColor: 'rgb(68, 68, 68)' }} colSpan="4">
                <div style={{ backgroundColor: 'rgb(39, 39, 39)', color: '#fff', padding: '10px' }}>

                    <tr>
                        <td style={{ width: '30%', verticalAlign: 'top', padding: '10px' }}>
                            <img src={comp.image_path} alt="Component" style={{ maxWidth: '100%' }} />
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                            <p><strong>Availability:</strong> {comp.availability || 'N/A'}</p>
                            <p><strong>Lifecycle Status:</strong> {comp.lifecycle_status || 'N/A'}</p>
                            <p><strong>ROHS Status:</strong> {comp.rohs_status || 'N/A'}</p>
                            <p><strong>Suggested Replacement:</strong> {comp.suggested_replacement || 'N/A'}</p>
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                            <p><strong>Manufacturer Part Number:</strong> {comp.mpn || 'N/A'}</p>
                            <p><strong>Supplier Description:</strong> {comp.supplier_description || 'N/A'}</p>
                            <p><strong>Supplier Manufacturer:</strong> {comp.supplier_manufacturer || 'N/A'}</p>
                            <p><strong>Category:</strong> {comp.category || 'N/A'}</p>
                        </td>
                    </tr>


                    {/* Boutons pour les URLs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {comp.product_detail_url && (
                            <Button onClick={() => openExternalLink(comp.product_detail_url)}>
                                Product Details ↝
                            </Button>
                        )}
                        {comp.datasheet_url && (
                            <Button onClick={() => openExternalLink(comp.datasheet_url)}>
                                Data Sheet ↝
                            </Button>
                        )}
                    </div>

                    {/* Info Messages */}
                    <div>
                        <strong>Info Messages:</strong>
                        {comp.info_messages && comp.info_messages.length > 0 ? (
                            <ul>
                                {comp.info_messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucune information disponible.</p>
                        )}
                    </div>

                    {/* Price Breaks */}
                    <div>
                        <strong>Price Breaks:</strong>
                        {comp.price_breaks && comp.price_breaks.length > 0 ? (
                            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Quantity</th>
                                        <th style={tableHeaderStyle}>Price</th>
                                        <th style={tableHeaderStyle}>Currency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comp.price_breaks.map((priceBreak, index) => (
                                        <tr key={index}>
                                            <td style={tableCellStyle}>{priceBreak.Quantity}</td>
                                            <td style={tableCellStyle}>{priceBreak.Price}</td>
                                            <td style={tableCellStyle}>{priceBreak.Currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucun prix disponible.</p>
                        )}
                    </div>
                </div>
            </td>
        </tr>

    );

    return (
        <>
            {isWarning && (
                <td colSpan="4" style={{ backgroundColor: '#fff98f', color: 'black', textAlign: 'center' }}>
                    {messages.join(', ')}
                </td>
            )}
            <tr className={`grid-row ${operator.toLowerCase()}`} style={isWarning ? { border: '4px solid #fff98f' } : {}}>
                <td>{operator === 'UPDATE' ? `${component.OldQuantity} → ${component.NewQuantity}` : component.quantity}</td>
                <td>{component.mpn}</td>
                <td>{component.designator}</td>
                <td>{component.user_description}</td>
                <td style={{ backgroundColor: 'rgb(39,39,39)' }}>
                    {!component.analyzed && (
                        <>
                            <div style={{ display: 'flex' }}>
                                <ButtonAction onClick={() => onPinToggle(component.id)} style={{ marginLeft: '10px' }}>
                                    {isPinned ? '→' : '←'}
                                </ButtonAction>
                                <ButtonAction onClick={() => setExpanded(!expanded)}>&ensp;</ButtonAction>
                            </div>
                        </>
                    )}
                    {component.analyzed && (
                        <>
                            <div style={{ display: 'flex' }}>
                                <ButtonAction onClick={() => onPinToggle(component.id)} style={{ marginLeft: '10px' }}>
                                    {isPinned ? '→' : '←'}
                                </ButtonAction>
                                <ButtonAction onClick={() => setExpanded(!expanded)}>{expanded ? '˅' : '>'}</ButtonAction>
                            </div>
                        </>
                    )}
                </td>
            </tr>

            {component.analyzed && expanded && renderComponentDetails(component)}

            {/* Afficher les détails de MismatchMpn si ils existent */}
            {hasMismatchMpn && expanded && component.mismatch_mpn.map((mismatchComponent, index) => (
                renderComponentDetails(mismatchComponent)
            ))}
        </>
    );
}

const tableHeaderStyle = {
    backgroundColor: '#444',
    padding: '5px',
    textAlign: 'left',
    border: '1px solid #555'
};

const tableCellStyle = {
    padding: '5px',
    border: '1px solid #555'
};

export default ComponentRow;
