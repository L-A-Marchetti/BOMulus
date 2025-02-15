import { core } from '../../../wailsjs/go/models';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentDetails from './ComponentDetails';

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
  const CompareView = CompareViewStore();

  return (
    <>
      {components?.map((component) => (
        <>
          <tr style={{ backgroundColor: color }} key={component.id}>
            <td>
              {isUpdate
                ? `${component.OldQuantity} -> ${component.NewQuantity}`
                : component.quantity}
            </td>
            <td>{component.mpn}</td>
            <td>{component.designator}</td>
            <td>{component.user_description}</td>
            <td>
              {component.analyzed && (
                <button
                  onClick={() =>
                    CompareView.toggleComponentDetails(component.id)
                  }
                >
                  {CompareView.expandedComponents.includes(component.id)
                    ? 'Close'
                    : 'Open'}
                </button>
              )}
            </td>
            <td>Bookmark</td>
          </tr>
          {CompareView.expandedComponents.includes(component.id) && (
            <ComponentDetails component={component} />
          )}
        </>
      ))}
    </>
  );
}
