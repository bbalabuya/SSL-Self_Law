import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 URL에서 accessToken 값을 가져옵니다.
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");

    // accessToken이 있으면 '/'로 이동합니다.
    if (accessToken) {
      // 여기에서 accessToken을 로컬 스토리지에 저장하거나, 다른 작업을 할 수 있습니다.
      // 예: localStorage.setItem('accessToken', accessToken);

      // '/' 경로로 이동
      navigate("/");
    }
  }, [navigate]);

  return null;
};

export default AuthSuccess;
