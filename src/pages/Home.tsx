/*
 * 메인 페이지 (1)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Header } from '@components/common';
import { IoSearch } from 'react-icons/io5';
import Item from '@components/Item';
import { regions, targets } from '@constants/filters';
import { recentPosts, popularServices } from '@constants/dummy';
import LoginRequiredModal from '@components/modal/LoginRequiredModal';
import { requestGetFetch } from '@services/apiService';

const Home = () => {
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoginRequiredModalVisible, setIsLoginRequiredModalVisible] =
    useState(false);
  const [popularList, setPopularList] = useState<
    { welfareNo: string; title: string }[]
  >([]);
  const [recentList, setRecentList] = useState<
    { postNo: string; title: string; createdAt: string }[]
  >([]);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleSearch = () => {
    if (!isLoggedIn) {
      setIsLoginRequiredModalVisible(true);
      return;
    }

    navigate('/list', {
      state: {
        region: selectedRegion ? [selectedRegion] : [],
        target: selectedTarget ? [selectedTarget] : [],
        input: inputText,
      },
    });
  };

  const handleProtectedNavigation = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setIsLoginRequiredModalVisible(true);
    }
  };

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const res = await requestGetFetch('api/welfare/popular');
        setPopularList(res.result || []);
      } catch (err) {
        console.error('자주 찾는 복지 서비스 불러오기 실패:', err);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const res = await requestGetFetch('api/board/recent');
        setRecentList(res.result || []);
      } catch (err) {
        console.error('최근 게시물 불러오기 실패:', err);
      }
    };

    fetchPopularServices();
    fetchRecentPosts();
    setPopularList(
      popularServices.map((item, index) => ({
        welfareNo: `${index + 1}`,
        title: item.title,
      })),
    );

    setRecentList(
      recentPosts.map((item, index) => ({
        postNo: `${index + 1}`,
        title: item.title,
        createdAt: item.date.replace(/\./g, '-'),
      })),
    );
  }, []);

  return (
    <Container>
      <Header showAuthButtons={true} />
      <ContentContainer>
        <Title>복지 서비스 조회</Title>
        <Card>
          <SearchBox>
            <Input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="ex) 성남에 거주 중인 20대 남자야. 교통사고로 하반신 마비를 갖게 됐어. 받을 수 있는 혜택이 있을까?"
            />
            <IoSearch
              size={24}
              style={{ cursor: 'pointer', marginLeft: '1rem' }}
              onClick={handleSearch}
            />
          </SearchBox>

          <Filters>
            <FilterGroup>
              <Label>거주 지역</Label>
              <Chips>
                {regions.map(region => (
                  <Chip
                    key={region}
                    selected={selectedRegion === region}
                    onClick={() =>
                      setSelectedRegion(selectedRegion === region ? '' : region)
                    }
                  >
                    {region}
                  </Chip>
                ))}
              </Chips>
            </FilterGroup>

            <FilterGroup>
              <Label>지원 대상</Label>
              <Chips>
                {targets.map(target => (
                  <Chip
                    key={target}
                    selected={selectedTarget === target}
                    onClick={() =>
                      setSelectedTarget(selectedTarget === target ? '' : target)
                    }
                  >
                    {target}
                  </Chip>
                ))}
              </Chips>
            </FilterGroup>
          </Filters>
        </Card>

        <FlexRow>
          <Section>
            <Title
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/review')}
            >
              최근 게시물
            </Title>
            <Card>
              <List>
                {recentList.map(post => (
                  <Item
                    key={post.postNo}
                    title={post.title}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    onClick={() =>
                      handleProtectedNavigation(`/post/${post.postNo}`)
                    }
                  />
                ))}
              </List>
            </Card>
          </Section>

          <Section>
            <Title>자주 찾는 복지 서비스</Title>
            <Card>
              <List>
                {popularList.map(service => (
                  <Item
                    key={service.welfareNo}
                    title={service.title}
                    onClick={() =>
                      handleProtectedNavigation(`/service/${service.welfareNo}`)
                    }
                  />
                ))}
              </List>
            </Card>
          </Section>
        </FlexRow>
      </ContentContainer>

      <LoginRequiredModal
        isVisible={isLoginRequiredModalVisible}
        onClose={() => setIsLoginRequiredModalVisible(false)}
        onLogin={() => navigate('/login')}
      />
    </Container>
  );
};

export default Home;

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
  padding: 2rem 20rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  align-self: flex-start;
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px #ccc;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterGroup = styled.div``;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.div<{ selected?: boolean }>`
  background: ${({ selected }) => (selected ? '#4b9cd3' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  border: 1px solid #ddd;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 2rem;
  margin-top: 1rem;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
