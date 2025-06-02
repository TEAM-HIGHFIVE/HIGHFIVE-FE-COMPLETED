/*
 * 게시판 상세 페이지 (3-2)
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Card, Header } from '@components/common';
import CommentItem from '@components/CommentItem';
import { requestGetFetch, requestPostFetch } from '@services/apiService';

interface Comment {
  commentNo: string;
  content: string;
  isMine: boolean;
  createdAt: string;
}

const BoardDetail = () => {
  const { postNo } = useParams<{ postNo: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await requestGetFetch(`api/board/${postNo}`);
        const result = res.result;
        setTitle(result.title);
        setContent(result.content);
        setCreatedAt(new Date(result.createdAt).toLocaleDateString());
        setComments(result.comments);
      } catch (err) {
        console.error('게시글 상세 조회 실패:', err);
      }
    };

    if (postNo) {
      fetchPostDetail();
    }
  }, [postNo]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !postNo) return;
    try {
      await requestPostFetch(`api/board/${postNo}`, {
        content: newComment.trim(),
      });
      // 댓글 성공 시 목록 재조회
      const res = await requestGetFetch(`api/board/${postNo}`);
      const result = res.result;
      setComments(result.comments);
      setNewComment('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
    const trimmed = newComment.trim();
    if (!trimmed) return;

    const newEntry: Comment = {
      commentNo: `${comments.length + 1}`,
      content: trimmed,
      isMine: true,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newEntry]);
    setNewComment('');
  };

  return (
    <Container>
      <Header backIcon={true} />

      <ContentContainer>
        <TitleBox>
          <Title>{title}</Title>
          <DateText>{createdAt}</DateText>
        </TitleBox>

        <Card style={{ width: '90%' }}>
          <div style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
            {content}
          </div>
        </Card>

        <TitleBox>
          <Title>댓글</Title>
        </TitleBox>

        <CommentList>
          {comments.map((c, i) => (
            <CommentItem
              key={i}
              text={c.content}
              date={new Date(c.createdAt).toLocaleDateString()}
            />
          ))}
        </CommentList>

        <InputWrapper style={{ marginTop: comments.length > 0 ? '4rem' : '0' }}>
          <CommentTextarea
            placeholder="댓글 작성"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <Button
            buttonText="댓글 작성"
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
        </InputWrapper>
      </ContentContainer>
    </Container>
  );
};

export default BoardDetail;

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
  align-items: center;
  padding: 2rem 20rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const CommentTextarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  resize: none;
  height: 100px;
  background-color: #f8f9fa;
  outline: none;
  margin-bottom: 1rem;
`;
