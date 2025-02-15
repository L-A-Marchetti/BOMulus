import { core } from '../../../wailsjs/go/models';
import { OpenExternalLink } from '../../../wailsjs/go/main/App';

type Component = core.Component;

type ComponentDetailsProps = {
  component: Component;
};

export default function ComponentDetails({ component }: ComponentDetailsProps) {
  const bestSupplier = component.calculated_price.best_supplier;
  const image = component.image_path?.find(
    (img) => img.supplier === bestSupplier,
  )?.value;
  const mpn = component.mpn || 'N/A';
  const description =
    component.supplier_description?.find(
      (desc) => desc.supplier === bestSupplier,
    )?.value || 'N/A';
  const manufacturer =
    component.supplier_manufacturer?.find(
      (man) => man.supplier === bestSupplier,
    )?.value || 'N/A';
  const category =
    component.category?.find((cat) => cat.supplier === bestSupplier)?.value ||
    'N/A';
  const availability =
    component.availability?.find((stock) => stock.supplier === bestSupplier)
      ?.value || 'N/A';
  const lifecycle =
    component.lifecycle_status?.find((life) => life.supplier === bestSupplier)
      ?.value ||
    component.lifecycle_status?.find((life) => life.value)?.value ||
    'N/A';
  const rohs =
    component.rohs_status?.find((r) => r.supplier === bestSupplier)?.value ||
    component.rohs_status?.find((r) => r.value)?.value ||
    'N/A';
  const replacement =
    component.suggested_replacement?.find(
      (rep) => rep.supplier === bestSupplier,
    )?.value ||
    component.suggested_replacement?.find((rep) => rep.value)?.value ||
    'N/A';
  const details =
    component.product_detail_url?.find((det) => det.supplier === bestSupplier)
      ?.value || component.product_detail_url?.find((det) => det.value)?.value;
  const datasheet =
    component.datasheet_url?.find((data) => data.supplier === bestSupplier)
      ?.value || component.datasheet_url?.find((data) => data.value)?.value;
  const priceBreaks = component.price_breaks?.find(
    (prices) => prices.supplier === bestSupplier,
  )?.value;
  return (
    <>
      <tr>
        <td>
          <img src={image} alt="Component" />
        </td>
        <td>
          <p>
            <strong>Manufacturer Part Number:</strong> {mpn}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Manufacturer:</strong> {manufacturer}
          </p>
          <p>
            <strong>Category:</strong> {category}
          </p>
        </td>
        <td>
          <p>
            <strong>Availability:</strong> {availability}
          </p>
          <p>
            <strong>Lifecycle Status:</strong> {lifecycle}
          </p>
          <p>
            <strong>ROHS Status:</strong> {rohs}
          </p>
          <p>
            <strong>Suggested Replacement:</strong> {replacement}
          </p>
        </td>
        <td>
          {details ? (
            <p onClick={() => OpenExternalLink(details)}>Product Details</p>
          ) : (
            <></>
          )}
          {datasheet ? (
            <p onClick={() => OpenExternalLink(datasheet)}>Product Datasheet</p>
          ) : (
            <></>
          )}
        </td>
      </tr>
      {component.detailed_parameters &&
        component.detailed_parameters.length > 0 && (
          <>
            <tr>
              <br />
            </tr>
            <tr>
              <td></td>
              <td>
                <strong>Parameter</strong>
              </td>
              <td>
                <strong>Value</strong>
              </td>
            </tr>
            {component.detailed_parameters.map((param, index) => (
              <tr key={index}>
                <td></td>
                <td>{param.parameter}</td>
                <td>{param.value}</td>
              </tr>
            ))}
          </>
        )}
      {priceBreaks ? (
        <>
          <tr>
            <br />
          </tr>
          <tr>
            <td></td>
            <td>
              <strong>Quantity</strong>
            </td>
            <td>
              <strong>Price</strong>
            </td>
            <td>
              <strong>Currency</strong>
            </td>
          </tr>
          {priceBreaks.map((priceBreak, priceIndex) => (
            <tr key={priceIndex}>
              <td></td>
              <td>{priceBreak.Quantity}</td>
              <td>{priceBreak.Price}</td>
              <td>{priceBreak.Currency}</td>
            </tr>
          ))}
        </>
      ) : (
        <>No price available.</>
      )}
    </>
  );
}
