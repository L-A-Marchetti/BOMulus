import { core } from '../../../wailsjs/go/models';

type Component = core.Component;

type ComponentRowProps = {
  components: Component[] | undefined;
  isUpdate: boolean;
  color: string;
};

export default function ComponentRow({
  components,
  isUpdate,
  color,
}: ComponentRowProps) {
  return (
    <>
      {components?.map((component) => (
        <tr style={{ backgroundColor: color }}>
          <td>
            {isUpdate
              ? component.OldQuantity + '->' + component.NewQuantity
              : component.quantity}
          </td>
          <td>{component.mpn}</td>
          <td>{component.designator}</td>
          <td>{component.user_description}</td>
          <td>v</td>
        </tr>
      ))}
    </>
  );
}
