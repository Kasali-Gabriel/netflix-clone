import { ChangeAuthDetailsProps } from '../../types/index';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';

const ChangeAuthDetails = ({
  isChangingEmail,
  isChangingPassword,
  setIsChangingEmail,
  setIsChangingPassword,
}: ChangeAuthDetailsProps) => {
  return (
    <>
      {isChangingEmail && (
        <ChangeEmail setIsChangingEmail={setIsChangingEmail} />
      )}

      {isChangingPassword && (
        <ChangePassword setIsChangingPassword={setIsChangingPassword} />
      )}
    </>
  );
};

export default ChangeAuthDetails;
