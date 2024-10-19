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
        ? pinnedComponents.some(pinned => pinned.Id === component.Id)
        : false;

    const isOutOfStock = component.Analyzed && operator !== 'DELETE' && component.Availability === "";
    const isLCSRisky = component.Analyzed && operator !== 'DELETE' && component.LifecycleStatus !== "" && component.LifecycleStatus !== "New Product" && component.LifecycleStatus !== "New at Mouser";
    const hasMessages = component.Analyzed && operator !== 'DELETE' && component.InfoMessages !== null;
    const hasMismatchMpn = component.Analyzed && operator !== 'DELETE' && component.MismatchMpn && component.MismatchMpn !== null;
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
                            <img src={comp.ImagePath} alt="Component" style={{ maxWidth: '100%' }} />
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                            <p><strong>Availability:</strong> {comp.Availability || 'N/A'}</p>
                            <p><strong>Lifecycle Status:</strong> {comp.LifecycleStatus || 'N/A'}</p>
                            <p><strong>ROHS Status:</strong> {comp.ROHSStatus || 'N/A'}</p>
                            <p><strong>Suggested Replacement:</strong> {comp.SuggestedReplacement || 'N/A'}</p>
                        </td>
                        <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                            <p><strong>Manufacturer Part Number:</strong> {comp.Mpn || 'N/A'}</p>
                            <p><strong>Supplier Description:</strong> {comp.SupplierDescription || 'N/A'}</p>
                            <p><strong>Supplier Manufacturer:</strong> {comp.SupplierManufacturer || 'N/A'}</p>
                            <p><strong>Category:</strong> {comp.Category || 'N/A'}</p>
                        </td>
                    </tr>


                    {/* Boutons pour les URLs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {comp.ProductDetailUrl && (
                            <Button onClick={() => openExternalLink(comp.ProductDetailUrl)}>
                                Product Details ↝
                            </Button>
                        )}
                        {comp.DataSheetUrl && (
                            <Button onClick={() => openExternalLink(comp.DataSheetUrl)}>
                                Data Sheet ↝
                            </Button>
                        )}
                    </div>

                    {/* Info Messages */}
                    <div>
                        <strong>Info Messages:</strong>
                        {comp.InfoMessages && comp.InfoMessages.length > 0 ? (
                            <ul>
                                {comp.InfoMessages.map((message, index) => (
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
                        {comp.PriceBreaks && comp.PriceBreaks.length > 0 ? (
                            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Quantity</th>
                                        <th style={tableHeaderStyle}>Price</th>
                                        <th style={tableHeaderStyle}>Currency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comp.PriceBreaks.map((priceBreak, index) => (
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
                                <ButtonAction onClick={() => onPinToggle(component.Id)} style={{ marginLeft: '10px' }}>
                                    {isPinned ? '→' : '←'}
                                </ButtonAction>
                                <ButtonAction onClick={() => setExpanded(!expanded)}>&ensp;</ButtonAction>
                            </div>
                        </>
                    )}
                    {component.analyzed && (
                        <>
                            <div style={{ display: 'flex' }}>
                                <ButtonAction onClick={() => onPinToggle(component.Id)} style={{ marginLeft: '10px' }}>
                                    {isPinned ? '→' : '←'}
                                </ButtonAction>
                                <ButtonAction onClick={() => setExpanded(!expanded)}>{expanded ? '˅' : '>'}</ButtonAction>
                            </div>
                        </>
                    )}
                </td>
            </tr>

            {component.Analyzed && expanded && renderComponentDetails(component)}

            {/* Afficher les détails de MismatchMpn si ils existent */}
            {hasMismatchMpn && expanded && component.MismatchMpn.map((mismatchComponent, index) => (
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
