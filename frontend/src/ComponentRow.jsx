/*
 * ComponentRow.jsx
 *
 * Component pour afficher une ligne d'informations sur un composant, 
 * y compris sa disponibilité, son statut de cycle de vie, et les détails du fabricant. 
 * Il propose aussi des boutons pour ouvrir des liens externes (détails produits, datasheet),
 * afficher les prix par quantité, ainsi que d'éventuels messages d'information.
 *
 * Props:
 *  - component: Objet contenant les détails du composant.
 *  - operator: String indiquant le type d'opération (par ex., 'DELETE').
 *  - onPinToggle: Fonction pour gérer l'épinglage/désépinglage du composant.
 *  - pinnedComponents: Tableau des composants actuellement épinglés.
 *  - apiPriority: Ordre de priorité des fournisseurs (Mouser, Digikey, etc.).
 *  - activeFilters: Filtres actifs (contient par ex. un searchQuery).
 *
 * États internes:
 *  - expanded: Boolean indiquant si les détails du composant sont dépliés.
 *  - hoveredFunction: Nom de la fonction survolée (pour le tooltip).
 *
 * Dépendances Backend:
 *  - OpenExternalLink: Fonction Wails pour ouvrir un lien externe.
 */

import './ComponentRow.css';
import React, { useState } from 'react';
import Button from './Button';
import { OpenExternalLink } from '../wailsjs/go/main/App';
import BookmarkIcon from "./assets/images/bookmark.svg";
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
import Mouser from "./assets/images/mouser.svg";
import Digikey from "./assets/images/digikey.svg";
import InfosIcon from "./assets/images/info.svg";
import MismatchmpnIcon from "./assets/images/mismatchingmpn.svg";
import ManmessageIcon from "./assets/images/manmessage.svg";
import OutofstockIcon from "./assets/images/outofstock.svg";
import LifecycleIcon from "./assets/images/lifecycle.svg";
import MoqIcon from "./assets/images/moq.svg";

const supplierIcons = {
    Mouser: Mouser,
    Digikey: Digikey,
};

function ComponentRow({ component, operator, onPinToggle, pinnedComponents, apiPriority, activeFilters, color }) {
    const [expanded, setExpanded] = useState(false);
    const [hoveredFunction, setHoveredFunction] = useState(null);

    // Fonction pour rendre les petits carrés de couleurs (labels)
    const renderFunctionColors = () => {
        const uniqueFunctions = new Set(
            component.designators.map(designator => designator.label.name)
        );

        return [...uniqueFunctions].map((functionName, index) => {
            if (functionName === "not assigned") return null;

            const color = component.designators.find(
                designator => designator.label.name === functionName
            )?.label.color || "#000";

            return (
                <div
                    key={index}
                    className="function-color-container"
                    onMouseEnter={() => setHoveredFunction(functionName)}
                    onMouseLeave={() => setHoveredFunction(null)}
                >
                    {/* Boîte colorée (taille gérée en CSS, couleur en inline) */}
                    <div
                        className="function-color-box"
                        style={{ backgroundColor: color }}
                    />
                    {/* Tooltip */}
                    {hoveredFunction === functionName && (
                        <div className="function-color-tooltip">
                            {functionName}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Surbrillance dynamique d'un designator selon sa fonction
    const highlightDesignator = (designator) => {
        if (hoveredFunction && designator.label.name === hoveredFunction) {
            return {
                backgroundColor: designator.label.color,
                color: '#fff'
            };
        }
        return {};
    };

    // Surligner un texte en fonction du searchQuery
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? <mark key={index}>{part}</mark> : part
        );
    }

    // Ouvrir un lien externe via la fonction Wails
    const openExternalLink = (link) => {
        OpenExternalLink(link);
    };

    // Vérifier si le composant est épinglé
    const isPinned = pinnedComponents && pinnedComponents.length > 0
        ? pinnedComponents.some(pinned => pinned.id === component.id)
        : false;

    // Vérifications pour avertissements
    const isOutOfStock = component.analyzed &&
        operator !== 'DELETE' &&
        component.availability?.every(avail => avail.value.trim() === "");

    const isLCSRisky = component.analyzed &&
        operator !== 'DELETE' &&
        component.lifecycle_status?.some(lcs =>
            lcs.value !== "" &&
            lcs.value !== "New Product" &&
            lcs.value !== "New at Mouser" &&
            lcs.value !== "Active"
        );

    const hasMessages = component.analyzed &&
        operator !== 'DELETE' &&
        component.info_messages?.some(msg => msg.trim() !== "");

    const hasMismatchMpn = component.analyzed &&
        component.mismatch_mpn === true;

    const hasMoq = component.calculated_price?.is_moq_not_reached;

    const isWarning = isOutOfStock || isLCSRisky || hasMessages || hasMismatchMpn || hasMoq;
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

    if (hasMoq) {
        messages.push('MOQ not reached');
    }

    // Rendu des détails du composant (quand on clique sur le bouton Infos)
    const renderComponentDetails = (comp) => (
        <tr>
            <td></td>
            <td colSpan="4" className="component-details-td">
                <div className="component-details-content">
                    {/* Détails du composant */}
                    <table className="component-details-table">
                        <tbody>
                            <tr>
                                {/* Colonne 1 : Image(s) */}
                                <td className="component-details-table-col-30">
                                    {apiPriority
                                        .map(api => {
                                            const imageDetails = comp.image_path?.find(detail => detail.supplier === api);
                                            return imageDetails ? (
                                                <img
                                                    key={api}
                                                    src={imageDetails.value}
                                                    alt={`${api} Component`}
                                                    className="component-image"
                                                />
                                            ) : null;
                                        })
                                        .find(el => el) || <p>Aucune image disponible</p>
                                    }
                                </td>

                                {/* Colonne 2 : Avail / Lifecycle / ROHS / Replacement */}
                                <td className="component-details-table-col-35">
                                    <p>
                                        <strong>Availability:</strong>
                                        {apiPriority.map(api => {
                                            const availability = comp.availability?.find(detail => detail.supplier === api);
                                            if (!availability) return null;
                                            return (
                                                <React.Fragment key={api}>
                                                    <img
                                                        className="supplier-icon"
                                                        src={supplierIcons[api]}
                                                        alt={`${api} icon`}
                                                    />
                                                    {availability.value === "" || availability.value === "0"
                                                        ? "Out of Stock"
                                                        : availability.value
                                                    }
                                                </React.Fragment>
                                            );
                                        }).reduce((prev, curr) => [prev, ' ', curr]) || ' N/A'}
                                    </p>

                                    <p>
                                        {apiPriority.map(api => {
                                            const lifecycle = comp.lifecycle_status?.find(detail => detail.supplier === api);
                                            return lifecycle ? (
                                                <React.Fragment key={api}>
                                                    <strong>
                                                        <img
                                                            className="supplier-icon"
                                                            src={supplierIcons[api]}
                                                            alt={`${api} icon`}
                                                        />
                                                        Lifecycle Status:
                                                    </strong>
                                                    &nbsp;{lifecycle.value}
                                                </React.Fragment>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>

                                    <p>
                                        {apiPriority.map(api => {
                                            const rohs = comp.rohs_status?.find(detail => detail.supplier === api);
                                            return rohs ? (
                                                <React.Fragment key={api}>
                                                    <strong>
                                                        <img
                                                            className="supplier-icon"
                                                            src={supplierIcons[api]}
                                                            alt={`${api} icon`}
                                                        />
                                                        ROHS Status:
                                                    </strong>
                                                    &nbsp;{rohs.value}
                                                </React.Fragment>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>

                                    <p>
                                        {apiPriority.map(api => {
                                            const replacement = comp.suggested_replacement?.find(detail => detail.supplier === api);
                                            if (replacement && replacement.value?.trim()) {
                                                return (
                                                    <React.Fragment key={api}>
                                                        <strong className="replacement-strong">
                                                            <img
                                                                className="supplier-icon"
                                                                src={supplierIcons[api]}
                                                                alt={`${api} icon`}
                                                            />
                                                            Suggested Replacement:
                                                        </strong>
                                                        {replacement.value}
                                                    </React.Fragment>
                                                );
                                            }
                                            return null;
                                        }).find(value => value) || (
                                                <>
                                                    <strong>Suggested Replacement:</strong> N/A
                                                </>
                                            )}
                                    </p>
                                </td>

                                {/* Colonne 3 : MPN, SupplierDesc, Manufacturer, Category */}
                                <td className="component-details-table-col-35">
                                    <p><strong>Manufacturer Part Number:</strong> {comp.mpn || 'N/A'}</p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const description = comp.supplier_description?.find(detail => detail.supplier === api);
                                            return description ? (
                                                <React.Fragment key={api}>
                                                    <strong>
                                                        <img
                                                            className="supplier-icon"
                                                            src={supplierIcons[api]}
                                                            alt={`${api} icon`}
                                                        />
                                                        Supplier Description:
                                                    </strong>
                                                    &nbsp;{description.value}
                                                </React.Fragment>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const manufacturer = comp.supplier_manufacturer?.find(detail => detail.supplier === api);
                                            return manufacturer ? (
                                                <React.Fragment key={api}>
                                                    <strong>
                                                        <img
                                                            className="supplier-icon"
                                                            src={supplierIcons[api]}
                                                            alt={`${api} icon`}
                                                        />
                                                        Supplier Manufacturer:
                                                    </strong>
                                                    &nbsp;{manufacturer.value}
                                                </React.Fragment>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                    <p>
                                        {apiPriority.map(api => {
                                            const category = comp.category?.find(detail => detail.supplier === api);
                                            return category ? (
                                                <React.Fragment key={api}>
                                                    <strong>
                                                        <img
                                                            className="supplier-icon"
                                                            src={supplierIcons[api]}
                                                            alt={`${api} icon`}
                                                        />
                                                        Category:
                                                    </strong>
                                                    &nbsp;{category.value}
                                                </React.Fragment>
                                            ) : null;
                                        }).find(value => value) || 'N/A'}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Boutons vers URLs externes (product details, datasheet) */}
                    <div className="external-links-buttons">
                        {apiPriority.map(api => {
                            const productDetails = comp.product_detail_url?.find(url => url.supplier === api);
                            if (productDetails) {
                                return (
                                    <Button key={api} onClick={() => openExternalLink(productDetails.value)}>
                                        <img
                                            className="supplier-icon"
                                            src={supplierIcons[api]}
                                            alt={`${api} icon`}
                                        />
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
                                        <img
                                            className="supplier-icon"
                                            src={supplierIcons[api]}
                                            alt={`${api} icon`}
                                        />
                                        Data Sheet ↝
                                    </Button>
                                );
                            }
                            return null;
                        }).find(el => el)}
                    </div>

                    {/* Paramètres détaillés */}
                    {comp.detailed_parameters && comp.detailed_parameters.length > 0 && (
                        <table className="detailed-parameters-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comp.detailed_parameters.map((param, index) => (
                                    <tr key={index}>
                                        <td>{param.parameter}</td>
                                        <td>{param.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Info Messages */}
                    <div className="info-messages-container">
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
                    <div className="price-breaks-container">
                        <strong>Price Breaks:</strong>
                        {comp.price_breaks && comp.price_breaks.length > 0 ? (
                            <div>
                                {comp.price_breaks.map((supplierPriceBreak, supplierIndex) => (
                                    <div className="supplier-price-break-container" key={supplierIndex}>
                                        <h4>Supplier: {supplierPriceBreak.supplier}</h4>
                                        {supplierPriceBreak.value && supplierPriceBreak.value.length > 0 ? (
                                            <table className="price-breaks-table">
                                                <thead>
                                                    <tr>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>Currency</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {supplierPriceBreak.value.map((priceBreak, priceIndex) => (
                                                        <tr key={priceIndex}>
                                                            <td>{priceBreak.Quantity}</td>
                                                            <td>{priceBreak.Price}</td>
                                                            <td>{priceBreak.Currency}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="no-price-breaks">
                                                No price breaks available for this supplier.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-price-breaks">No price available.</p>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );

    function darkenColor(hex, amount = 20) {
        const color = hex.replace("#", "");
        const num = parseInt(color, 16);

        // Extraire les composantes R, G, B
        const r = (num >> 16) & 0xff;
        const g = (num >> 8) & 0xff;
        const b = num & 0xff;

        // Calculer une réduction proportionnelle pour éviter un assombrissement excessif
        const factor = 1 - amount / 255;
        const newR = Math.max(0, Math.round(r * factor));
        const newG = Math.max(0, Math.round(g * factor));
        const newB = Math.max(0, Math.round(b * factor));

        return `rgb(${newR}, ${newG}, ${newB})`;
    }



    return (
        <>
            {/* Ligne principale */}
            <tr className={`grid-row ${operator.toLowerCase()} ${isWarning ? 'warning-border' : ''}`}>
                {/* Colonne Warning */}
                {/* Colonne Warning */}
                <td
                    rowSpan="2"
                    className="warning-td-left"

                >
                    {isWarning && (
                        <div className="warning-icons-container" title={messages.join(', ')}>
                            {isOutOfStock && (
                                <img
                                    className="warning-icon"
                                    src={OutofstockIcon}
                                    alt="Out of Stock"
                                />
                            )}
                            {isLCSRisky && (
                                <img
                                    className="warning-icon"
                                    src={LifecycleIcon}
                                    alt="Risky Lifecycle Status"
                                />
                            )}
                            {hasMessages && (
                                <img
                                    className="warning-icon"
                                    src={ManmessageIcon}
                                    alt="Manufacturer Message(s)"
                                />
                            )}
                            {hasMismatchMpn && (
                                <img
                                    className="warning-icon"
                                    src={MismatchmpnIcon}
                                    alt="Mismatching Manufacturer Part Number"
                                />
                            )}
                            {hasMoq && (
                                <img
                                    className="warning-icon"
                                    src={MoqIcon}
                                    alt="Mismatching Manufacturer Part Number"
                                />
                            )}
                        </div>
                    )}
                </td>


                {/* Colonne Best Price */}
                <td className="best-price-td" style={{ backgroundColor: darkenColor(color, 30) }}>
                    <div
                        className={
                            "best-price-container " +
                            (component.calculated_price?.is_moq_not_reached ? "moq-not-reached" : "")
                        }
                    >
                        {component.calculated_price?.best_price ? (
                            <>
                                <img
                                    src={supplierIcons[component.calculated_price.best_supplier]}
                                    alt={`${component.calculated_price.best_supplier} icon`}
                                    className="supplier-icon"
                                />
                                {component.calculated_price?.is_moq_not_reached ? (
                                    `< ${component.calculated_price.moq} | ${parseFloat(component.calculated_price.best_price).toFixed(2)} | ${parseFloat(component.calculated_price.best_unit_price).toFixed(2)}/u`
                                ) : (
                                    `${parseFloat(component.calculated_price.best_price).toFixed(2)} | ${parseFloat(component.calculated_price.best_unit_price).toFixed(2)}/u`
                                )}
                            </>
                        ) : (
                            "-"
                        )}
                    </div>
                </td>

                {/* Colonne MPN */}
                <td rowSpan="2" className="mpn-td" style={{ backgroundColor: color }}>
                    {highlightText(component.mpn, activeFilters.searchQuery)}
                </td>

                {/* Colonne Designators */}
                <td rowSpan="2" className="designators-td" style={{ backgroundColor: color }}>
                    {component.designators
                        .map((designator, index) => (
                            <span
                                key={index}
                                className="designator-span"
                                style={highlightDesignator(designator)}
                            >
                                {highlightText(designator.designator, activeFilters.searchQuery)}
                            </span>
                        ))
                        .reduce((prev, curr) => [prev, ', ', curr])}
                </td>

                {/* Colonne user_description */}
                <td rowSpan="2" className="description-td" style={{ backgroundColor: color }}>
                    {highlightText(component.user_description, activeFilters.searchQuery)}
                </td>

                {/* Colonne function colors */}
                <td rowSpan="2" className="function-colors-td">
                    {renderFunctionColors()}
                </td>

                {/* Colonne Pin */}
                <td rowSpan="2" className="pin-td" onClick={() => onPinToggle(component.id)}>
                    <img
                        className="bookmark-icon"
                        src={isPinned ? BookmarkFilledIcon : BookmarkIcon}
                        alt={isPinned ? "Pinned" : "Unpinned"}
                        width="30px"
                        height="30px"
                    />
                </td>

                {/* Colonne Info */}
                <td
                    rowSpan="2"
                    className="info-td"
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                    style={{ cursor: "pointer" }} // Ajoute un curseur pour signaler le clic
                >
                    {component.analyzed ? (
                        <img
                            className="info-icon"
                            src={InfosIcon}
                            alt="Infos"
                        />
                    ) : (
                        <span className="info-icon">?</span>
                    )}
                </td>
            </tr>

            {/* Ligne Quantité */}
            <tr>
                <td className="quantity-td" style={{ backgroundColor: color }}>
                    <div className="quantity-value">
                        {operator === 'UPDATE'
                            ? `${component.OldQuantity} → ${component.NewQuantity}`
                            : component.quantity
                        }
                    </div>
                </td>
            </tr>

            {/* Détails du Composant */}
            {expanded && renderComponentDetails(component)}
        </>
    );

}

export default ComponentRow;
