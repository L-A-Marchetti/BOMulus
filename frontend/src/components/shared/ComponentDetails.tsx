import { core } from '../../../wailsjs/go/models';

type Component = core.Component;

type ComponentDetailsProps = {
  component: Component;
};

export default function ComponentDetails({ component }: ComponentDetailsProps) {
  const bestSupplier = component.calculated_price.best_supplier;
  const image = component.image_path?.find(
    (img) => img.supplier === bestSupplier,
  )?.value;
  return (
    <tr>
      <td>
        <img src={image} alt="Component" />
      </td>
    </tr>
  );
}
