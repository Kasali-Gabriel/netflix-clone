import { DotLoader } from 'react-spinners';

const PageLoader = () => {
  return (
    <div className=" absolute z-50 flex  h-screen  w-screen justify-center  bg-gray-950">
      <DotLoader size={80} color="white" className="mt-20" />
    </div>
  );
};

export default PageLoader;
