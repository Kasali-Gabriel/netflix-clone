'use client';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2Icon } from 'lucide-react';
import { useContext, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Loader from '../../../components/Buttons/ButtonLoader';
import FormError from '../../../components/FormComponents/form-error';
import FormSuccess from '../../../components/FormComponents/form-success';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { UserContext } from '../../../context/UserContext';
import { REGISTER_USER, USER_LOGIN } from '../../../graphql/mutations';
import useChangePage from '../../../hooks/useChangePage';
import { createSession } from '../../../lib/session';
import { useAppSelector } from '../../../Redux/hooks';
import { PasswordSchema } from '../../../Schemas';

const Page = () => {
  const changePage = useChangePage();
  const { setUser } = useContext(UserContext);
  const email = useAppSelector(
    (state: { email: { value: string } }) => state.email.value,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [userLogin] = useMutation(USER_LOGIN, {
    onCompleted: async (data) => {
      if (data?.userLogin) {
        await createSession({
          user: { id: data.userLogin.id, email: data.userLogin.email },
          accessToken: data.userLogin.accessToken,
          refreshToken: data.userLogin.refreshToken,
        });
        setUser({ id: data.userLogin.id, email: data.userLogin.email });
        setSuccess('Registration successful');
      }
    },
    onError: (loginError) => {
      setError(loginError.message);
    },
  });

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: async (registerData) => {
      if (registerData?.registerUser) {
        await userLogin({
          variables: { email, password: form.getValues().password },
        });
      }
    },
    onError: (registerError) => {
      setError(registerError.message);
    },
  });

  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (passwordInput: z.infer<typeof PasswordSchema>) => {
    setError('');
    setLoading(true);

    startTransition(async () => {
      const validatedPassword = PasswordSchema.safeParse(passwordInput);
      if (!validatedPassword.success) {
        setError('Invalid input');
        setLoading(false);
        return;
      }

      const { password } = validatedPassword.data;
      await registerUser({
        variables: { createUserInput: { email, password } },
      });

      setLoading(false);
      setIsSubmitted(true);
    });
  };

  useEffect(() => {
    if (!email) {
      changePage('/');
    }
  }, [email]);

  if (!email) {
    return null;
  }

  return (
    <div className="h-screen bg-white">
      <div className="mx-auto h-full w-full sm:mt-5 sm:w-[470px]">
        <Card className="flex flex-col justify-center border-none bg-transparent px-4 sm:p-7">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-black/80 sm:mt-4">
              {!isSubmitted ? (
                <p>
                  Welcome back! <br /> Joining Netflix is easy.
                </p>
              ) : (
                <div className=" flex flex-col text-center text-base font-normal">
                  <div className="mb-7 flex items-center justify-center">
                    <CheckCircle2Icon className="h-14 w-14 text-[#CC0000]" />
                  </div>
                  <div>
                    STEP <span className="font-bold"> 1 </span> OF{' '}
                    <span className="font-bold">3</span>
                  </div>
                  <div className="ml-6 self-start text-4xl font-bold">
                    Choose your plan.
                  </div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <div>
                <h2 className="text-xl font-medium text-black/70">
                  Enter your password and you&apos;ll be watching in no time.
                </h2>
                <p className="mt-6 text-lg font-medium text-black/70">Email</p>
                <p className="-mt-2 text-lg font-medium text-black">{email}</p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              className="f my-4 h-16 rounded border-white bg-gray-200/10 text-lg text-black"
                              placeholder="Enter your password"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      onClick={() => onSubmit(form.getValues())}
                      disabled={isPending}
                      className="mt-2 h-10 w-full bg-[#CC0000] text-lg font-bold 
                  text-white hover:bg-[#990000]"
                    >
                      {loading ? <Loader /> : 'Next'}
                    </Button>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                  </form>
                </Form>
              </div>
            ) : (
              <div className="max-w-80 space-y-3 text-xl">
                <p className="flex">
                  <Check className="mr-2 mt-1 h-10 w-8 text-[#CC0000]" /> No
                  commitments, cancel at any time.
                </p>
                <p className="flex">
                  <Check className="mr-2 mt-1 h-10 w-8 text-[#CC0000]" />
                  Everything on Netflix for one low price.
                </p>
                <p className="flex">
                  <Check className="mr-2 mt-2 h-10 w-8 text-[#CC0000]" />
                  No adverts and no extra fees. Ever.
                </p>
                <Button
                  disabled={loading || isPending}
                  onClick={() => {
                    changePage('/SignUp/planform');
                  }}
                  className="mt-2 h-14 w-full rounded-none bg-[#CC0000] text-lg font-bold text-white hover:bg-[#990000]"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
