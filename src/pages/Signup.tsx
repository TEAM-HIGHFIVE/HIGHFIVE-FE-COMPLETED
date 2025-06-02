/*
 * 회원가입 페이지 (4)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header, Card, Button } from '@components/common';
import IdIcon from '@assets/id.svg?react';
import PasswordIcon from '@assets/password.svg?react';
import { requestPostFetch } from '@services/apiService';

const Signup = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!id || !password) {
      setError('아이디 또는 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      await requestPostFetch('api/users/sign-up', {
        username: id,
        password: password,
      });

      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      setError('회원가입에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Header backIcon={true} />
      <ContentContainer>
        <Card style={{ width: '25%', height: '30%', padding: '4rem 8rem' }}>
          <InputWrapper>
            <InputContainer withBorder>
              <IdIcon />
              <Input
                placeholder="아이디"
                value={id}
                onChange={e => setId(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <PasswordIcon />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </InputContainer>
          </InputWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <Button
            buttonText="회원가입"
            type="setting"
            style={{ marginTop: '3rem', width: '100%', padding: '1rem 0' }}
            onClick={handleSignup}
          />
        </Card>
      </ContentContainer>
    </Container>
  );
};

export default Signup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  background-color: white;
`;

const InputContainer = styled.div<{ withBorder?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem;
  background-color: white;
  border-bottom: ${({ withBorder }) =>
    withBorder ? '1px solid #ddd' : 'none'};
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  padding-left: 0.5rem;
  background-color: transparent;
`;

const ErrorText = styled.div`
  color: #f51c1c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;
