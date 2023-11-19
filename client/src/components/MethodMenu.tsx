import { Select } from "@mantine/core";

interface MethodMenuProps {
  (value: string | null): void;
}

const MethodMenu = ({ onChange }: { onChange: MethodMenuProps}) => {
  return (
    <Select
      label="Conversion Method"
      placeholder="Select conversion method"
      data={[
        'Luminance',
        'Average',
      ]}
      defaultValue="Luminance"
      allowDeselect={false}
      onChange={(value) => onChange(value)}
    />
  );
};

export default MethodMenu;
