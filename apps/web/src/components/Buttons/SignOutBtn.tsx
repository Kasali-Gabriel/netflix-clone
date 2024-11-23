import { SquareArrowOutUpRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState, useTransition } from 'react';
import { ClipLoader } from 'react-spinners';
import { UserContext } from '../../context/UserContext';
import { deleteSession } from '../../lib/session';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

const SignOutBtn = () => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const notAuth = pathName
    ? !pathName.startsWith('/SignUp') && pathName !== '/signIn'
    : false;

  const handleSignOut = async () => {
    startTransition(async () => {
      await deleteSession();
      setUser(null);
      router.refresh();
    });
  };

  const handleClick = () => {
    setIsDialogOpen(true);
    handleSignOut();
  };

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        disabled={isPending}
        onClick={handleClick}
        className="flex flex-row items-center p-5 text-lg md:p-8 md:text-2xl xl:p-5"
      >
        {notAuth && (
          <SquareArrowOutUpRight
            size={32}
            strokeWidth={3}
            className="mr-2 mt-1"
          />
        )}
        Sign Out
      </Button>

      {isDialogOpen && (
        <Dialog open={isDialogOpen}>
          <DialogContent className="flex max-w-[70vw] flex-col items-center justify-center p-6 md:p-8 xl:p-10">
            <DialogHeader className="mb-4 flex w-full items-center justify-center text-center text-xl">
              Signing out
            </DialogHeader>
            <ClipLoader color="red" size={35} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SignOutBtn;
