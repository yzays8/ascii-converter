import { AsciiArtData } from '../App';
import '../App.css';

const AsciiArtDisplay = ({ scale, data }: {scale: number, data: AsciiArtData}) => {
  return (
    <pre
      style={{
        transform: `scale(${scale}, 1)`,
        transformOrigin: '0%',
      }}
    >
      {data.ascii_art.join('')}
    </pre>
  );
};

export default AsciiArtDisplay;
