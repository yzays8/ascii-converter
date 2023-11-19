import { useState, useEffect, useRef } from 'react'

import { MantineProvider, Box } from '@mantine/core';
import useSWR from 'swr';
import '@mantine/core/styles.css';

import ImageProcessingGroup from './components/ImageProcessingGroup';
import AsciiArtDisplay from './components/AsciiArtDisplay';
import ControlButtons from './components/ControlButtons';
import './App.css'

export const END_POINT = 'http://localhost:4000';

export interface AsciiArtData {
  ascii_art: string[];
}

interface Canvas {
  getContext(contextType: '2d'): CanvasRenderingContext2D | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function App() {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const { data, mutate } = useSWR<AsciiArtData>(`${END_POINT}/ascii-art`, fetcher);

  useEffect(() => {
    const canvas = canvasRef.current as Canvas | null;
    if (!canvas) return;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const text = 'a';
    ctx.font = "1px monospace"
    const textMetrics = ctx.measureText(text);

    const width = textMetrics.width;
    const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const scale = height / width;
    setScale(scale);
  }, []);

  return (
    <>
      {/* This is for measuring the width and height of a character in the monospace font */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <MantineProvider>
        <Box>
          <ImageProcessingGroup mutate={mutate} />
          <ControlButtons data={data} mutate={mutate} />
          <div id="art">
            { data && data.ascii_art && <AsciiArtDisplay scale={scale} data={data} />}
          </div>
        </Box>
      </MantineProvider>
    </>
  )
}

export default App
