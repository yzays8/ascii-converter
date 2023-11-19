import { useState } from 'react';

import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { KeyedMutator } from 'swr';

import { AsciiArtData, END_POINT } from '../App';

const DragAndDropArea =
  ({ mutate, conversionMethod }: { mutate: KeyedMutator<AsciiArtData>, conversionMethod: string}) => {
  const [loading, setLoading] = useState(false);

  const handleImage = async (files: FileWithPath[]) => {
    setLoading(true);
    console.log('Accepted files', files);
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    const asciiArtData = await fetch(`${END_POINT}/ascii-art`, {
      method: 'POST',
      body: formData,
      headers: {
        'conversion-method': conversionMethod,
      },
    }).then((res) => res.json());
    mutate(asciiArtData);
    setLoading(false);
  };

  return (
    <Dropzone
      onDrop={(files) => handleImage(files)}
      onReject={(files) => console.log('Rejected files', files)}
      maxSize={3 * 1024 ** 2} // 3MiB
      maxFiles={1}
      accept={['image/png', 'image/jpeg', 'image/gif']}
      style={{
        minWidth: '85%',
        border: '2px dotted #a3a3a3',
        borderRadius: 10,
        marginBottom: '20px',
      }}
      loading={loading}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }} wrap='nowrap'>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-gray-6)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag a image here or click to select a file
          </Text>
          <Text size='sm' c="dimmed" inline mt={7}>
            The file size limitation is 3MiB
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

export default DragAndDropArea;
