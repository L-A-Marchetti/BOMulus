/*
 * ComponentRow.jsx
 * 
 * Component for displaying a row of component information, including availability,
 * lifecycle status, and manufacturer details. It also provides buttons to open external links
 * for product details and datasheets, as well as displaying price breaks and info messages.
 *
 * Props:
 * component: Object containing details about the component.
 * operator: String indicating the operation type (e.g., 'DELETE').
 * onPinToggle: Function to handle pinning/unpinning the component.
 * pinnedComponents: Array of currently pinned components.
 *
 * States:
 * expanded: Boolean indicating whether the component details are expanded.
 *
 * Backend Dependencies:
 * OpenExternalLink: Function from Wails backend to open external links.
 */

import React, { useState } from 'react';
import Button from './Button';
import { OpenExternalLink } from '../wailsjs/go/main/App';
import BookmarkIcon from "./assets/images/bookmark.svg";
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
import Mouser from "./assets/images/mouser.svg";
import Digikey from "./assets/images/digikey.svg";
import InfosIcon from "./assets/images/info.svg";

const supplierIcons = {
    Mouser: Mouser,
    Digikey: Digikey,
};

function ComponentRow({ component, operator, onPinToggle, pinnedComponents, apiPriority }) {
    const [expanded, setExpanded] = useState(false);

    // Opens an external link
    const openExternalLink = (link) => {
        OpenExternalLink(link);
    };

    // Checks if the component is pinned
    const isPinned = pinnedComponents && pinnedComponents.length > 0
        ? pinnedComponents.some(pinned => pinned.id === component.id)
        : false;

    // Checks various conditions to determine if there are warnings
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

    // Renders detailed information about the component
    const renderComponentDetails = (comp) => (
        <tr>
            <td style={{ backgroundColor: 'rgb(68, 68, 68)' }} colSpan="4">
                <div style={{ backgroundColor: 'rgb(39, 39, 39)', color: '#fff', padding: '10px' }}>
                    {/* Component Details */}
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '30%', verticalAlign: 'top', padding: '10px' }}>
                                    {apiPriority.map(api => {
                                        const imageDetails = comp.image_path?.find(detail => detail.supplier === api);
                                        return imageDetails ? (
                                            <img
                                                key={api}
                                                src={imageDetails.value}
                                                alt={`${api} Component`}
                                                style={{ maxWidth: '120px' }}
                                            />
                                        ) : null;
                                    }).find(el => el) || <p>No Image Available</p>}
                                </td>
                                <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                                    <p>
                                        {apiPriority.map(api => {
                                            const availability = comp.availability?.find(detail => detail.supplier === api);
                                            return availability ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Availability: </strong>

                                                    {availability.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const lifecycle = comp.lifecycle_status?.find(detail => detail.supplier === api);
                                            return lifecycle ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Lifecycle Status: </strong>
                                                    {lifecycle.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const rohs = comp.rohs_status?.find(detail => detail.supplier === api);
                                            return rohs ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />ROHS Status: </strong>
                                                    {rohs.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const replacement = comp.suggested_replacement?.find(detail => detail.supplier === api);
                                            return replacement ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Suggested Replacement: </strong>
                                                    {replacement.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                </td>
                                <td style={{ width: '35%', verticalAlign: 'top', padding: '10px' }}>
                                    <p><strong>Manufacturer Part Number:</strong> {comp.mpn || 'N/A'}</p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const description = comp.supplier_description?.find(detail => detail.supplier === api);
                                            return description ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Supplier Description: </strong>
                                                    {description.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const manufacturer = comp.supplier_manufacturer?.find(detail => detail.supplier === api);
                                            return manufacturer ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Supplier Manufacturer: </strong>
                                                    {manufacturer.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const category = comp.category?.find(detail => detail.supplier === api);
                                            return category ? (
                                                <>
                                                    <strong><img
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                        style={{ marginRight: '7px', width: '7px', height: 'auto' }}
                                                    />Category: </strong>
                                                    {category.value}
                                                </>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    {/* Buttons for URLs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        {apiPriority.map(api => {
                            const productDetails = comp.product_detail_url?.find(url => url.supplier === api);
                            if (productDetails) {
                                return (
                                    <Button key={api} onClick={() => openExternalLink(productDetails.value)}>
                                        <img src={supplierIcons[api]} alt={`${api} icon`} style={{ marginRight: '7px', width: '7px', height: 'auto' }} />
                                        Product Details ↝
                                    </Button>
                                );
                            }
                            return null;
                        }).find(el => el)}


                        {apiPriority.map(api => {
                            const dataSheet = comp.datasheet_url?.find(url => url.supplier === api);
                            if (dataSheet) {
                                return (
                                    <Button key={api} onClick={() => openExternalLink(dataSheet.value)}>
                                        <img src={supplierIcons[api]} alt={`${api} icon`} style={{ marginRight: '7px', width: '7px', height: 'auto' }} />
                                        Data Sheet ↝
                                    </Button>
                                );
                            }
                            return null;
                        }).find(el => el)}
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
                            <p>No information available.</p>
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
                            <p>No price available.</p>
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
                {!isPinned && (
                    <>
                        <td>{component.designator}</td>
                        <td>{component.user_description}</td>
                    </>
                )}
                <td style={{ backgroundColor: 'rgb(39,39,39)' }}>
                    {!component.analyzed && (
                        <>
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => onPinToggle(component.id)} style={{ marginLeft: '10px' }}>
                                    <img
                                        src={isPinned ? BookmarkFilledIcon : BookmarkIcon}
                                        alt={isPinned ? "Pinned" : "Unpinned"}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                </Button>
                                <Button onClick={() => setExpanded(!expanded)}>&ensp;</Button>
                            </div>
                        </>
                    )}
                    {component.analyzed && (
                        <>
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => onPinToggle(component.id)} style={{ marginLeft: '10px' }}>
                                    <img
                                        src={isPinned ? BookmarkFilledIcon : BookmarkIcon}
                                        alt={isPinned ? "Pinned" : "Unpinned"}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                </Button>
                                <Button onClick={() => setExpanded(!expanded)}>{ }
                                    <img
                                        src={InfosIcon}
                                        alt={"Infos"}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                </Button>
                            </div>
                        </>
                    )}
                </td>
            </tr>

            {component.analyzed && expanded && renderComponentDetails(component)}

            {/* Display mismatch MPN details if they exist */}
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
