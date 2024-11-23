import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setEmail } from '../../Redux/emailReducer';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { EmailSchema } from '../../Schemas';
import { GET_USER_BY_EMAIL } from '../../graphql/queries';
import useChangePage from '../../hooks/useChangePage';
import Loader from '../Buttons/ButtonLoader';
import FormError from '../FormComponents/form-error';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const EmailInput = () => {
  const changePage = useChangePage();
  const dispatch = useAppDispatch();
  const email = useAppSelector(
    (state: { email: { value: string } }) => state.email.value,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof EmailSchema>>({
    mode: 'onChange',
    defaultValues: { email: '' },
    resolver: zodResolver(EmailSchema),
  });

  const { handleSubmit } = form;

  const { data, error: userError } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    fetchPolicy: 'network-only'
  });

  const onSubmit = () => {
    setLoading(true);

    startTransition(() => {
      if (data && data.getUserByEmail && !userError) {
        setError('⚠️ Email already in use!');
      } else {
        changePage('/SignUp');
      }
      setLoading(false);
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="m-3">
            <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        onChange={(e) => {
                          dispatch(setEmail(e.target.value.toLowerCase()));
                          field.onChange(e);
                        }}
                        type="email"
                        className="mb-2 mt-5 h-14 w-60 rounded border-white bg-gray-200/10 text-lg text-white sm:w-72 md:w-96"
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    <FormError message={error} />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="mx-2 mt-2 flex h-10 w-40 bg-[#CC0000] text-lg text-white hover:bg-[#990000] sm:mt-[18px] sm:h-[60px] sm:w-48 sm:text-2xl"
              >
                {loading ? (
                  <Loader />
                ) : (
                  <div className="flex flex-row">
                    Get Started <ChevronRight className="ml-1 mt-0.5 sm:mt-1" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailInput;
