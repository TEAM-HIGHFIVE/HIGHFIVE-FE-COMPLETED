import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaAngleLeft } from 'react-icons/fa6';
import Logo from '@assets/logo.svg?react';
import LogoutModal from '@components/modal/LogoutModal';

interface HeaderProps {
  backIcon?: boolean;
  showAuthButtons?: boolean;
}

const Header = ({ backIcon = false, showAuthButtons = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogoutModalVisible(false);
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <HeaderContainer>
      <LeftArea>
        {backIcon && (
          <BackIcon onClick={handleBack}>
            <FaAngleLeft color="#000" size={24} />
            <Txt>돌아가기</Txt>
          </BackIcon>
        )}
      </LeftArea>

      <CenterArea>
        <Logo />
        <Title>BOCK-GPT</Title>
      </CenterArea>

      <RightArea>
        {showAuthButtons &&
          (isLoggedIn ? (
            <AuthButton onClick={() => setIsLogoutModalVisible(true)}>
              로그아웃
            </AuthButton>
          ) : (
            <>
              <AuthButton onClick={() => navigate('/login')}>로그인</AuthButton>
              <AuthButton onClick={() => navigate('/signup')}>
                회원가입
              </AuthButton>
            </>
          ))}
      </RightArea>

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onLogout={handleLogout}
      />
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  height: 4rem;
  background-color: #fff;
  padding: 1rem 12rem;
`;

const LeftArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const CenterArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RightArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
`;

const BackIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
`;

const Txt = styled.div`
  font-size: 1rem;
  color: #000;
`;

const AuthButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #000;
`;
