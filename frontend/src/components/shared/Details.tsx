import { core } from '../../../wailsjs/go/models';
import { OpenExternalLink } from '../../../wailsjs/go/main/App';

type Component = core.Component;

type DetailsProps = {
  component: Component;
  onCancel: () => void;
};

export default function Details({ component, onCancel }: DetailsProps) {
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
    <td colSpan={6}>
      <div className="relative rounded-lg shadow-sm">
        <button
          type="button"
          className="cursor-pointer z-50 absolute top-3 end-2.5 text-neutral-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
          onClick={onCancel}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-tiny text-left rtl:text-right text-neutral-500 dark:text-neutral-400">
            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-neutral-900 bg-white dark:text-white dark:bg-neutral-800">
              <div className="flex flex-col items-start justify-start gap-8">
                <div className="flex items-center justify-center gap-8">
                  <img
                    src={image}
                    alt="Component"
                    className="aspect-square max-w-20 rounded-lg"
                  />
                  <div className="">
                    {mpn}
                    <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                      {description}
                    </p>
                    <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                      {manufacturer}
                    </p>
                    <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                      {category}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-8">
                  <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    <strong>Availability:</strong> {availability}
                  </p>
                  <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    <strong>Lifecycle Status:</strong> {lifecycle}
                  </p>
                  <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    <strong>Compliance:</strong> {rohs}
                  </p>
                  <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                    <strong>Suggested Replacement:</strong> {replacement}
                  </p>
                </div>
                <div className="flex gap-8">
                  {details ? (
                    <p onClick={() => OpenExternalLink(details)}>
                      Product Details
                    </p>
                  ) : (
                    <></>
                  )}
                  {datasheet ? (
                    <p onClick={() => OpenExternalLink(datasheet)}>
                      Product Datasheet
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </caption>
            {component.detailed_parameters &&
              component.detailed_parameters.length > 0 && (
                <>
                  <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Parameter
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {component.detailed_parameters.map((param, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200"
                      >
                        <td className="px-6 py-1">{param.parameter}</td>
                        <td className="px-6 py-1">{param.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
          </table>
          <table className="w-full text-tiny text-left rtl:text-right text-neutral-500 dark:text-neutral-400">
            {priceBreaks ? (
              <>
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Currency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priceBreaks.map((priceBreak, priceIndex) => (
                    <tr
                      key={priceIndex}
                      className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200"
                    >
                      <td className="px-6 py-1">{priceBreak.Quantity}</td>
                      <td className="px-6 py-1">{priceBreak.Price}</td>
                      <td className="px-6 py-1">{priceBreak.Currency}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>No price available.</>
            )}
          </table>
        </div>
      </div>
    </td>
  );
}
