import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CHANGE_USER_EMAIL } from '../../graphql/mutations';
import { GET_USER_BY_ID } from '../../graphql/queries';
import { useToast } from '../../hooks/use-toast';
import useUser from '../../hooks/useGetUser';
import { NewEmailSchema } from '../../Schemas';
import FormError from '../FormComponents/form-error';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface ChangeEmailProps {
  setIsChangingEmail: (isChanging: boolean) => void;
}

const ChangeEmail = ({ setIsChangingEmail }: ChangeEmailProps) => {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { getUserId } = useUser();
  const userId = getUserId();

  const { data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const email = data?.getUserById?.email;

  const { toast } = useToast();

  const [changeUserEmail] = useMutation(CHANGE_USER_EMAIL, {
    onCompleted: (data) => {
      if (data) {
        setIsChangingEmail(false);
        toast({
          description: 'Email changed successfully.',
        });
        refetch();
      }
    },
    onError: () => {
      setError('Failed to change email');
    },
  });

  const emailForm = useForm<z.infer<typeof NewEmailSchema>>({
    resolver: zodResolver(NewEmailSchema),
    defaultValues: {
      email: email || undefined,
    },
  });

  const onEmailSubmit = (values: z.infer<typeof NewEmailSchema>) => {
    startTransition(() => {
      changeUserEmail({
        variables: { userId: userId, newEmail: values.email },
      });
    });
  };

  return (
    <Card className="relative mb-40 flex w-[95vw] flex-col border border-neutral-500 sm:w-[90vw] xl:w-[50vw] dark:border-neutral-300">
      <Button
        variant="destructive"
        className="absolute right-0 top-0 h-10 w-10 text-2xl"
        onClick={() => {
          setIsChangingEmail(false);
        }}
      >
        x
      </Button>

      <CardHeader>
        <p className="text-center text-2xl font-semibold">Change Email</p>
      </CardHeader>

      <CardContent className="flex flex-col">
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <div>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@gmail.com"
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="submit"
                disabled={
                  isPending ||
                  emailForm.watch('email')?.toLowerCase() ===
                    email?.toLowerCase()
                }
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangeEmail;
