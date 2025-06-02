/*
 * 후기 및 Q&A 페이지 (3-1)
 */

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card, Header } from '@components/common';
import { Item, Pagination } from '@components/index';
import { requestGetFetch } from '@services/apiService';
// import { serviceListDummyData } from '@constants/dummy';

interface PostItem {
  postNo: string;
  title: string;
  createdAt: string;
}

const ReviewQA = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async (page: number) => {
    try {
      const res = await requestGetFetch(`api/board?page=${page - 1}`);
      const result = res.result;

      setPosts(result.content || []);
      setTotalPages(result.totalPages || 0);
    } catch (err) {
      console.error('게시글 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
    // const pageSize = 10;
    // const total = serviceListDummyData.length;
    // const totalPages = Math.ceil(total / pageSize);

    // const pagedPosts = serviceListDummyData
    //   .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    //   .map((item, index) => ({
    //     postNo: `${(currentPage - 1) * pageSize + index + 1}`,
    //     title: item.title,
    //     createdAt: item.date.replace(/\./g, '-'),
    //   }));

    // setPosts(pagedPosts);
    // setTotalPages(totalPages);
  }, [currentPage]);

  return (
    <Container>
      <Header backIcon={true} />
      <ContentContainer>
        <Label>Q&A 및 후기 게시판</Label>
        <Card style={{ width: '50%' }}>
          <List>
            {posts.map(post => (
              <Item
                key={post.postNo}
                title={post.title}
                date={new Date(post.createdAt).toLocaleDateString()}
                onClick={() => navigate(`/post/${post.postNo}`)}
              />
            ))}
          </List>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </ContentContainer>
    </Container>
  );
};

export default ReviewQA;

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
  gap: 2rem;
  padding: 2rem 0;
  width: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Label = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 24rem;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
