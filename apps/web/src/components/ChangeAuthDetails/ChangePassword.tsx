import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CHANGE_USER_PASSWORD } from '../../graphql/mutations';
import { useToast } from '../../hooks/use-toast';
import useUser from '../../hooks/useGetUser';
import { NewPasswordSchema } from '../../Schemas';
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

const ChangePassword = ({
  setIsChangingPassword,
}: {
  setIsChangingPassword: (value: boolean) => void;
}) => {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const { getUserId } = useUser();
  const userId = getUserId();

  const passwordForm = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      oldPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  });

  const { toast } = useToast();

  const [changeUserPassword] = useMutation(CHANGE_USER_PASSWORD, {
    onCompleted: (data) => {
      if (data) {
        setIsChangingPassword(false);
        toast({
          description: 'Password changed successfully.',
        });
        router.refresh();
      }
    },
    onError: () => {
      setError('Failed to change Password');
    },
  });

  const onPasswordSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      changeUserPassword({
        variables: {
          updatePasswordInput: {
            userId: userId,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
        },
      });
    });
  };

  return (
    <Card className="relative mb-40 flex w-[95vw] flex-col border border-neutral-500 sm:w-[90vw] xl:w-[50vw] dark:border-neutral-300">
      <Button
        variant="destructive"
        className="absolute right-0 top-0 h-10 w-10 text-2xl"
        onClick={() => {
          setIsChangingPassword(false);
        }}
      >
        x
      </Button>

      <CardHeader>
        <p className="text-center text-2xl font-semibold">Change Password</p>
      </CardHeader>

      <CardContent className="flex flex-col">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <div>
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
                        disabled={isPending}
                        className="mb-2 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> New Password </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Confirm Password </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="******"
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
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
