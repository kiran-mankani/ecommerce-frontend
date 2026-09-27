import { useSelector } from "react-redux";

const useProfile = () => {
  const { profile, loading, saving, error, successMessage } = useSelector(
    (state) => state.user
  );
  return { profile, loading, saving, error, successMessage };
};

export default useProfile;