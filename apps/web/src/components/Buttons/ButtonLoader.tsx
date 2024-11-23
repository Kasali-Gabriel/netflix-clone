import { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface LoaderProps {
  size?: number;
}

const Loader = ({ size = 30 }: LoaderProps) => {
  const override: CSSProperties = {
    display: 'block',
    margin: '0 auto',
  };

  return (
    <div>
      <ClipLoader
        color="white"
        loading={true}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="mx-0.5"
      />
    </div>
  );
};

export default Loader;
