import { usePathname } from 'next/navigation';
import { FormErrorProps } from '../../types';

const FormError = ({ message }: FormErrorProps) => {
  const pathname = usePathname();
  if (!message) return null;

  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const formattedMessage = message.replace(
    emailRegex,
    (email) => `<strong>${email}</strong>`,
  );

  const colorClass = (() => {
    switch (pathname) {
      case '/':
        return 'bg-transparent text-red-500 justify-center -mt-10';
      case '/MyAccount':
        return 'bg-red-200 text-red-500 gap-x-2 mt-5';
      default:
        return 'bg-yellow-600 text-black gap-x-2';
    }
  })();

  return (
    <div className={`flex items-center rounded-md p-3 text-base ${colorClass}`}>
      <p dangerouslySetInnerHTML={{ __html: formattedMessage }} />
    </div>
  );
};

export default FormError;
