import { useState } from "react";

import { Group } from "@mantine/core";

import DragAndDropArea from "./DragAndDropArea";
import MethodMenu from "./MethodMenu";
import { KeyedMutator } from "swr";
import { AsciiArtData } from "../App";

const ImageProcessingGroup = ({ mutate }: { mutate: KeyedMutator<AsciiArtData> }) => {
  const [conversionMethod, setConversionMethod] = useState("Luminance");

  const handleChange = (value: string | null) => {
    if (value === null) return;
    setConversionMethod(value);
    console.log(value);
  };

  return (
    <Group justify='center' grow wrap='nowrap'>
      <DragAndDropArea mutate={mutate} conversionMethod={conversionMethod} />
      <MethodMenu onChange={handleChange}/>
    </Group>
  );
};

export default ImageProcessingGroup;
