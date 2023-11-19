import { Button, Group } from '@mantine/core';
import { KeyedMutator } from 'swr';

import { AsciiArtData, END_POINT } from '../App';

const ControlButtons = ({ data, mutate }: { data: AsciiArtData | undefined, mutate: KeyedMutator<AsciiArtData>}) => {
  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.ascii_art.join('')).catch((err) => console.error(err));
  };

  const handleClear = async () => {
    const clear = await fetch(`${END_POINT}/ascii-art`, {
      method: 'DELETE',
    }).then((res) => res.json());
    mutate(clear);
  }

  return (
    <Group justify="center">
      <Button
        onClick={() => handleCopy()}
        disabled={!data}
      >
        Copy to clipboard
      </Button>
      <Button
        onClick={() => handleClear()}
        disabled={!data}
      >
        Clear
      </Button>
    </Group>
  );
};

export default ControlButtons;
