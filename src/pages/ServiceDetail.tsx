import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Header, Button } from '@components/common';
import { TbMinusVertical } from 'react-icons/tb';
import { requestGetFetch } from '@services/apiService';

interface WelfareServiceDetail {
  title: string;
  updatedAt: string;
  areas: string[];
  targets: string[];
  criteria: string;
  content: string;
  applyMethod: string;
  tel: string;
  referenceLink: string;
  reference: string;
}

const ServiceDetail = () => {
  const { welfareNo } = useParams<{ welfareNo: string }>();
  const [detail, setDetail] = useState<WelfareServiceDetail | null>(null);
  const [newComment, setNewComment] = useState('');
  const chatBubbleRef = useRef<HTMLDivElement>(null);

  const [chatList, setChatList] = useState<
    { question: string; answer: string }[]
  >([]);
  const [, setLoadingIndex] = useState<number | null>(null);

  const handleAddComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !welfareNo) return;

    const question = trimmed;
    const tempId = chatList.length;

    setChatList(prev => [...prev, { question, answer: '답변 작성 중...' }]);
    setLoadingIndex(tempId);
    setNewComment('');

    try {
      const encodedQuestion = encodeURIComponent(question);
      const res = await requestGetFetch(
        `/api/welfare/chatbot/${welfareNo}?question=${encodedQuestion}`
      );
      console.log(res);

      const answer =
        res?.result?.chatBotReply ||
        '답변 준비 중입니다. 관리자에게 문의해주세요.';

      setChatList(prev =>
        prev.map((item, idx) => (idx === tempId ? { question, answer } : item))
      );
    } catch (error) {
      console.error('챗봇 오류:', error);
      setChatList(prev =>
        prev.map((item, idx) =>
          idx === tempId
            ? { question, answer: '오류가 발생했습니다. 다시 시도해주세요.' }
            : item
        )
      );
    } finally {
      setLoadingIndex(null);
    }
  };

  useEffect(() => {
    if (!welfareNo) return;

    requestGetFetch(`/api/welfare/${welfareNo}`)
      .then(res => setDetail(res.result))
      .catch(err => {
        console.error('복지 상세 정보 불러오기 실패:', err);
      });
  }, [welfareNo]);

  useEffect(() => {
    if (chatBubbleRef.current) {
      chatBubbleRef.current.scrollTo({
        top: chatBubbleRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatList]);

  if (!detail) return <div>로딩 중...</div>;

  const formattedDate = new Date().toLocaleDateString('ko-KR');

  return (
    <Container>
      <Header backIcon={true} />
      <ContentContainer>
        <TitleRow>
          <TitleWithTag>
            <Title>{detail.title}</Title>
            <TagRow>
              {detail.areas.map((tag, idx) => (
                <Tag key={idx}>#{tag}</Tag>
              ))}
            </TagRow>
          </TitleWithTag>
          <Dates>갱신일: {formattedDate}</Dates>
        </TitleRow>
        <Row>
          <LeftSection>
            <InfoCard>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  지원 대상
                </Label>
                <Text>{detail.targets.length ? detail.targets.join(', ') : '정보 없음'}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  선정 기준
                </Label>
                <Text>{detail.criteria}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  서비스 내용
                </Label>
                <Text>{detail.content}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  신청 방법
                </Label>
                <Text>{detail.applyMethod}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  전화 문의
                </Label>
                <Text>{detail.tel}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  관련 웹사이트
                </Label>
                <Text>{detail.referenceLink || '정보 없음'}</Text>
              </InfoItem>
              <InfoItem>
                <Label>
                  <TbMinusVertical size={32} color="#373EA2" />
                  근거 법령 및 자료
                </Label>
                <Text>{detail.reference}</Text>
                <Button
                  buttonText="자료 다운로드"
                  type="setting"
                  bgColor="#EAF1F8"
                  txtColor="#000"
                  style={{
                    width: '30%',
                    borderRadius: '1rem',
                    marginTop: '2rem',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </InfoItem>
            </InfoCard>
          </LeftSection>
          <RightSection>
            <InfoCard style={{ height: '100%' }}>
              <ChatBubble ref={chatBubbleRef}>
                {chatList.map((chat, index) => (
                  <div key={index}>
                    <strong
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '-0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <TbMinusVertical size={32} />
                      {chat.question}
                    </strong>
                    <ChatReply>{chat.answer}</ChatReply>
                  </div>
                ))}
              </ChatBubble>
              <ChatInputWrapper>
                <ChatInput
                  placeholder="질문을 입력해주세요."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  buttonText="질문하기"
                  type="setting"
                  bgColor="#BAD7F3"
                  txtColor="#000"
                  style={{
                    width: '100%',
                    fontWeight: 'bold',
                    borderRadius: '1rem',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
                    padding: '0.5rem 0',
                  }}
                  onClick={handleAddComment}
                />
              </ChatInputWrapper>
            </InfoCard>
          </RightSection>
        </Row>
      </ContentContainer>
    </Container>
  );
};

export default ServiceDetail;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 14%;
  gap: 2rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

const LeftSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleWithTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: bold;
`;

const Dates = styled.span`
  font-size: 1.2rem;
  color: #000;
`;

const TagRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  background-color: rgba(4, 0, 255, 0.06);
  font-size: 0.85rem;
  color: #000;
  font-weight: bold;
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 2rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  gap: 1rem;
  height: 100%;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: #000;
  font-size: 1.2rem;
  margin-left: '-0.5rem';
`;

const Text = styled.span`
  font-size: 0.95rem;
  color: #000;
  margin-left: 2.4rem;
`;

const ChatBubble = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
`;

const ChatReply = styled.div`
  font-size: 0.9rem;
  background: #bad7f3;
  padding: 0.75rem;
  border-radius: 0.75rem;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChatInput = styled.textarea`
  resize: none;
  height: 80px;
  padding: 1rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  outline: none;
  background: #f9fafb;
`;
