import { useRouter } from 'next/navigation';

const useChangePage = () => {
  const router = useRouter();

  const changePage = async (route: string) => {
    await router.push(route);
    router.refresh();
  };

  return changePage;
};

export default useChangePage;
